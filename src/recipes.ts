export enum ResourceId {
  WOOD = 'wood',
  STONE = 'stone',
  COAL = 'coal',
  IRON_ORE = 'iron_ore',
  IRON = 'iron',
  RESEARCH = 'research_points',
}

export enum BuildingId {
  WOODCUTTER = 'woodcutter',
  QUARRY = 'stone_quarry',
  COAL_MINER = 'coal_miner',
  IRON_MINER = 'iron_miner',
  FURNACE = 'stone_furnace',
  LAB = 'laboratory',
}

export enum RecipeId {
  MINE_COAL = 'mine_coal',
  SMELT_IRON = 'smelt_iron',
}

export interface Stack<T> {
  id: T
  amount: number
}

export interface ResourceStorage extends Stack<ResourceId> {
  capacity: number
}

// export interface Recipe<TOutput> {
//   id: RecipeId
//   inputs: Stack<ResourceId>[]
//   buildingTypes: BuildingId[]
//   output: Stack<TOutput>
// }

export function s<T>(id: T, amount: number): Stack<T> {
  return { id: id, amount }
}

export const mineCoal = {
  id: RecipeId.MINE_COAL,
  inputs: [],
  buildingTypes: [BuildingId.COAL_MINER],
  output: s(ResourceId.COAL, 1),
} as const

export const smeltIron = {
  id: RecipeId.SMELT_IRON,
  inputs: [s(ResourceId.IRON_ORE, 1), s(ResourceId.COAL, 2)],
  buildingTypes: [BuildingId.FURNACE],
  output: s(ResourceId.IRON, 1),
} as const

export type Recipe = typeof mineCoal | typeof smeltIron

export enum ModuleInputAction {
  STORAGE,
  SUBMODULE,
}

export interface ModuleInputFromStorage {
  action: ModuleInputAction.STORAGE
  resource: ResourceId
}

export interface ModuleInputFromModule {
  action: ModuleInputAction.SUBMODULE
  module: Module<Recipe>
}

export type ModuleInput = ModuleInputFromStorage | ModuleInputFromModule

export interface Module<TRecipe extends Recipe> {
  recipeId: Recipe['id']
  allocated: Stack<TRecipe['buildingTypes'][number]>
  inputs: ModuleInput[]
}

const mineCoalMod: Module<typeof mineCoal> = {
  recipeId: RecipeId.MINE_COAL,
  allocated: { id: BuildingId.COAL_MINER, amount: 1 },
  inputs: [],
}

export const testModule: Module<typeof smeltIron> = {
  recipeId: smeltIron.id,
  allocated: { id: BuildingId.FURNACE, amount: 1 },
  inputs: [
    {
      action: ModuleInputAction.STORAGE,
      resource: ResourceId.IRON_ORE,
    },
    {
      action: ModuleInputAction.SUBMODULE,
      module: mineCoalMod,
    },
  ],
}

export interface SaveInfo {
  start: Date
  lastSave: Date
}

export interface GameState {
  saveInfo: SaveInfo
  resources: ResourceStorage[]
  buildings: Stack<BuildingId>[]
}
