import { produce } from 'immer'
import { Building, Resource, matchesCost, subtractResources } from './data'
import { initialState } from './initialState'

export interface State {
  saveStart: number
  lastSave: number
  offline: {
    multiplier: number
    maxCatchupTime: number
  }
  resources: Resource[]
  buildings: Building[]
}

export enum ActionType {
  UPDATE_RESOURCES,
  PURCHASE_BUILDING,
  SAVE_GAME,
  IMPORT_STATE,
}

interface UpdateResourceAction {
  type: ActionType.UPDATE_RESOURCES
  resources: Resource[]
  multiplier: number
}

interface UpdateBuildingAction {
  type: ActionType.PURCHASE_BUILDING
  buildingType: Building['type']
}

interface SaveGameAction {
  type: ActionType.SAVE_GAME
  reset?: boolean
}

interface ReloadStateAction {
  type: ActionType.IMPORT_STATE
  state: State
}

type Action =
  | SaveGameAction
  | UpdateResourceAction
  | UpdateBuildingAction
  | ReloadStateAction

function saveRawState(serializedState: string) {
  localStorage.setItem('state', serializedState)
}

export async function serializeState(state: State): Promise<string> {
  const byteArray = new TextEncoder().encode(JSON.stringify(state))
  const cs = new CompressionStream('deflate')
  const writer = cs.writable.getWriter()
  writer.write(byteArray)
  writer.close()

  const compressedData = await new Response(cs.readable).blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return reject()

      resolve(reader.result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(compressedData)
  })
}

export async function deserializeState(
  serializedState: string
): Promise<State> {
  const compressedData = Uint8Array.from(atob(serializedState), c =>
    c.charCodeAt(0)
  )

  const ds = new DecompressionStream('deflate')
  const writer = ds.writable.getWriter()
  writer.write(compressedData)
  writer.close()

  const decompressedData = await new Response(ds.readable).arrayBuffer()
  const stateJson = new TextDecoder().decode(decompressedData)
  return JSON.parse(stateJson)
}

export async function saveState(state: State) {
  saveRawState(await serializeState(state))
}

export async function loadState(): Promise<State> {
  const serializedState = localStorage.getItem('state')
  try {
    if (!serializedState) throw new Error()

    return await deserializeState(serializedState)
  } catch {
    // State is corrupted, restore to initial
    saveState(initialState)
    return initialState
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.UPDATE_RESOURCES: {
      // Adjust updates according to multiplier
      const updates = action.resources.map(r => ({
        ...r,
        amount: r.amount * action.multiplier,
      }))

      // Check that negative resource costs can be deducted
      const isValidUpdate = updates.every(
        u =>
          u.amount > 0 ||
          state.resources.some(
            r => r.type === u.type && r.amount + u.amount >= 0
          )
      )

      if (!isValidUpdate) return state

      return produce(state, draft => {
        for (const resourceUpdate of updates) {
          const resource = draft.resources.find(
            r => r.type === resourceUpdate.type
          )

          // Add new resource types
          if (!resource && resourceUpdate.amount > 0) {
            draft.resources.push({
              ...resourceUpdate,
              amount: resourceUpdate.amount,
            })
            continue
          } else if (resource) {
            resource.amount += resourceUpdate.amount
          }
        }
      })
    }
    case ActionType.PURCHASE_BUILDING: {
      return produce(state, draft => {
        const building = draft.buildings.find(
          b => b.type === action.buildingType
        )
        if (!building || !matchesCost(draft.resources, building.cost)) return

        subtractResources(draft.resources, building.cost)
        building.cost.forEach(c => (c.amount *= building.costMultiplier))
        building.amount++
      })
    }
    case ActionType.SAVE_GAME: {
      return produce(action.reset ? initialState : state, draft => {
        draft.lastSave = Date.now()
      })
    }
    case ActionType.IMPORT_STATE: {
      return produce(action.state, draft => {
        draft.lastSave = Date.now()
      })
    }

    default: {
      return state
    }
  }
}
