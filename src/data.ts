// Types
export enum ResourceType {
  WOOD = 'wood',
  IRON = 'iron',
  RESEARCH = 'research_points',
}

export enum BuildingType {
  MINER = 'iron_miner',
  WOODCUTTER = 'woodcutter',
  LAB = 'laboratory',
}

export const ResourceIcons = {
  [ResourceType.IRON]: '🔩',
  [ResourceType.WOOD]: '🌲',
  [ResourceType.RESEARCH]: '💡',
}

export const BuildingIcons = {
  [BuildingType.WOODCUTTER]: '🪓',
  [BuildingType.MINER]: '⛏️',
  [BuildingType.LAB]: '🔬',
}

export interface Resource {
  type: ResourceType
  amount: number
}

export interface Building {
  type: BuildingType
  cost: Array<Resource>
  costMultiplier: number
  amount: number
  rps: Array<Resource>
}

// Resource utils
export function matchesCost(resources: Resource[], cost: Resource[]): boolean {
  return cost.every(c =>
    resources.some(r => r.type === c.type && r.amount >= c.amount)
  )
}
export function subtractResources(
  resources: Resource[],
  cost: Resource[]
): boolean {
  for (const resourceCost of cost) {
    const resource = resources.find(r => r.type === resourceCost.type)
    if (!resource) return false

    resource.amount -= resourceCost.amount
  }

  return true
}

// Resource creation utils
function resource(
  type: Resource['type'],
  amount: Resource['amount']
): Resource {
  return { type, amount }
}

export function wood(amount: Resource['amount']) {
  return resource(ResourceType.WOOD, amount)
}

export function iron(amount: Resource['amount']) {
  return resource(ResourceType.IRON, amount)
}

export function research(amount: Resource['amount']) {
  return resource(ResourceType.RESEARCH, amount)
}
