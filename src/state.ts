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
  SAVE,
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
  type: ActionType.SAVE
  reset?: boolean
}

function saveState(state: State) {
  localStorage.setItem('state', btoa(JSON.stringify(state)))
}

export function loadState(): State {
  const serializedState = localStorage.getItem('state')
  if (serializedState) {
    return JSON.parse(atob(serializedState))
  } else {
    // State is corrupted, restore to initial
    saveState(initialState)
    return initialState
  }
}

type Action = SaveGameAction | UpdateResourceAction | UpdateBuildingAction

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
    case ActionType.SAVE:
      if (action.reset) {
        saveState(initialState)
        return initialState
      } else {
        saveState(state)
        return produce(state, draft => {
          draft.lastSave = Date.now()
        })
      }

    default:
      return state
  }
}
