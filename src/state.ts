import { produce } from 'immer'
import {
  ActionType,
  Building,
  Resource,
  matchesCost,
  subtractResources,
} from './data'

export interface State {
  tps: number
  resources: Resource[]
  buildings: Building[]
}

interface UpdateResourceAction {
  type: ActionType.UPDATE_RESOURCE
  resource: Resource
}

interface UpdateBuildingAction {
  type: ActionType.PURCHASE_BUILDING
  buildingType: Building['type']
}

type Action = UpdateResourceAction | UpdateBuildingAction

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
    default:
      return state
  }
}
