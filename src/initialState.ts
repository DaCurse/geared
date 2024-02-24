import {
  Building,
  BuildingType,
  coal,
  iron,
  ironOre,
  research,
  stone,
  wood,
} from './data'
import { State } from './state'

const woodcutter: Building = {
  type: BuildingType.WOODCUTTER,
  cost: [wood(5), stone(10)],
  costMultiplier: 1.2,
  amount: 0,
  rps: [wood(1)],
}

const quarry: Building = {
  type: BuildingType.QUARRY,
  cost: [wood(10), stone(5)],
  costMultiplier: 1.2,
  amount: 0,
  rps: [stone(1)],
}

const coalMiner: Building = {
  type: BuildingType.COAL_MINER,
  cost: [wood(50), stone(75)],
  costMultiplier: 1.2,
  amount: 0,

  rps: [coal(1)],
}

const ironMiner: Building = {
  type: BuildingType.IRON_MINER,
  cost: [wood(150), stone(100), iron(5)],
  costMultiplier: 1.2,
  amount: 0,

  rps: [ironOre(1)],
}

const furnace: Building = {
  type: BuildingType.FURNACE,
  cost: [wood(100), stone(150), coal(5)],
  costMultiplier: 1.2,
  amount: 0,

  rps: [iron(1), ironOre(-1), coal(-2)],
}

const lab: Building = {
  type: BuildingType.LAB,
  cost: [wood(500), stone(500), iron(75)],
  costMultiplier: 1.2,
  amount: 0,
  rps: [research(1)],
}

export const initialState: State = {
  saveStart: Date.now(),
  lastSave: Date.now(),
  offline: {
    multiplier: 0.2,
    maxCatchupTime: 1000 * 60 * 60,
  },
  resources: [wood(0), stone(0), coal(0), ironOre(0), research(0)],
  buildings: [woodcutter, quarry, coalMiner, ironMiner, furnace, lab],
}
