// Types
export enum ResourceType {
  WOOD = 'wood',
  STONE = 'stone',
  COAL = 'coal',
  IRON_ORE = 'iron_ore',
  IRON = 'iron',
  RESEARCH = 'research_points',
}

export enum BuildingType {
  WOODCUTTER = 'woodcutter',
  QUARRY = 'stone_quarry',
  COAL_MINER = 'coal_miner',
  IRON_MINER = 'iron_miner',
  FURNACE = 'stone_furnace',
  LAB = 'laboratory',
}

export const ResourceIcons = {
  [ResourceType.WOOD]: '🌲',
  [ResourceType.STONE]: '🗿',
  [ResourceType.COAL]: '🗻',
  [ResourceType.IRON_ORE]: '⛰️',
  [ResourceType.IRON]: '🔩',
  [ResourceType.RESEARCH]: '💡',
}

export const BuildingIcons = {
  [BuildingType.WOODCUTTER]: '🪓',
  [BuildingType.QUARRY]: '⚒️',
  [BuildingType.COAL_MINER]: '⛏️',
  [BuildingType.IRON_MINER]: '⛏️',
  [BuildingType.FURNACE]: '🔥',
  [BuildingType.LAB]: '🔬',
}

export interface Resource {
  type: ResourceType
  amount: number
  minable?: boolean
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
  amount: Resource['amount'],
  minable: boolean
): Resource {
  return { type, amount, minable }
}

export function wood(amount: Resource['amount']) {
  return resource(ResourceType.WOOD, amount, true)
}

export function stone(amount: Resource['amount']) {
  return resource(ResourceType.STONE, amount, true)
}

export function ironOre(amount: Resource['amount']) {
  return resource(ResourceType.IRON_ORE, amount, true)
}

export function coal(amount: Resource['amount']) {
  return resource(ResourceType.COAL, amount, true)
}

export function iron(amount: Resource['amount']) {
  return resource(ResourceType.IRON, amount, false)
}

export function research(amount: Resource['amount']) {
  return resource(ResourceType.RESEARCH, amount, false)
}
