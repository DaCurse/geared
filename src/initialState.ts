import { Building, BuildingType, iron, research, wood } from './data'
import { State } from './state'

const miner: Building = {
  type: BuildingType.MINER,
  cost: [wood(10), iron(5)],
  costMultiplier: 1.15,
  amount: 0,

  rps: [iron(1)],
}

const woodcutter: Building = {
  type: BuildingType.WOODCUTTER,
  cost: [wood(5), iron(10)],
  costMultiplier: 1.15,
  amount: 0,
  rps: [wood(1)],
}

const lab: Building = {
  type: BuildingType.LAB,
  cost: [wood(75), iron(100)],
  costMultiplier: 1.4,
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
  resources: [wood(0), iron(0), research(0)],
  buildings: [woodcutter, miner, lab],
}
