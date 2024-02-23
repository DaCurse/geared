import { produce } from 'immer'
import { Building, Resource, matchesCost, subtractResources } from './data'
import { initialState } from './initialState'

export interface State {
  tps: number
  lastSave: number
  resources: Resource[]
  buildings: Building[]
}

export enum ActionType {
  UPDATE_RESOURCE,
  PURCHASE_BUILDING,
  SAVE_GAME,
  IMPORT_STATE,
}

interface UpdateResourceAction {
  type: ActionType.UPDATE_RESOURCE
  resource: Resource
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
  serializedState: string
}

type Action =
  | SaveGameAction
  | UpdateResourceAction
  | UpdateBuildingAction
  | ReloadStateAction

function saveRawState(serializedState: string) {
  localStorage.setItem('state', serializedState)
}

function saveState(state: State) {
  saveRawState(btoa(JSON.stringify(state)))
}

export function loadState(): State {
  const serializedState = localStorage.getItem('state')
  try {
    if (!serializedState) throw new Error()

    return JSON.parse(atob(serializedState))
  } catch {
    // State is corrupted, restore to initial
    saveState(initialState)
    return initialState
  }
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case ActionType.UPDATE_RESOURCE:
      return produce(state, draft => {
        const resource = draft.resources.find(
          r => r.type === action.resource.type
        )
        if (resource) {
          resource.amount += action.resource.amount
        } else {
          draft.resources.push(action.resource)
        }
      })
    case ActionType.PURCHASE_BUILDING:
      return produce(state, draft => {
        const building = draft.buildings.find(
          b => b.type === action.buildingType
        )
        if (!building || !matchesCost(draft.resources, building.cost)) return

        subtractResources(draft.resources, building.cost)
        building.cost.forEach(c => (c.amount *= building.costMultiplier))
        building.amount++
      })
    case ActionType.SAVE_GAME:
      if (action.reset) {
        saveState(initialState)
        return initialState
      } else {
        saveState(state)
        return produce(state, draft => {
          draft.lastSave = Date.now()
        })
      }

    case ActionType.IMPORT_STATE:
      saveRawState(action.serializedState)
      return loadState()

    default:
      return state
  }
}
