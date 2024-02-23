import { Building, BuildingType, iron, research, wood } from './data'
import { State } from './state'

const miner: Building = {
  type: BuildingType.MINER,
  cost: [wood(10), iron(5)],
  costMultiplier: 1.1,
  amount: 0,

  rps: [iron(1)],
}
const woodcutter: Building = {
  type: BuildingType.WOODCUTTER,
  cost: [wood(5), iron(10)],
  costMultiplier: 1.1,
  amount: 0,
  rps: [wood(1)],
}
const lab: Building = {
  type: BuildingType.LAB,
  cost: [wood(75), iron(100)],
  costMultiplier: 1.2,
  amount: 0,
  rps: [research(0)],
}

export const initialState: State = {
  tps: 20,
  resources: [wood(0), iron(0)],
  buildings: [woodcutter, miner, lab],
}
