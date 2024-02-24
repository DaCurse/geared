import { Building, BuildingIcons, Resource, ResourceIcons } from './data'

type SnakeToTitleCase<S extends string> =
  S extends `${infer First}_${infer Rest}`
    ? `${Capitalize<First>} ${SnakeToTitleCase<Rest>}`
    : Capitalize<S>

export function snakeToTitleCase<T extends string>(
  input: T
): SnakeToTitleCase<T> {
  return input
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') as SnakeToTitleCase<T>
}

export function formatResource(r: Resource) {
  const amount = Math.floor(r.amount).toLocaleString()
  return `${ResourceIcons[r.type]} ${amount} ${snakeToTitleCase(r.type)}`
}

export function formatBuilding(b: Building) {
  const amount = Math.floor(b.amount).toLocaleString()
  return `${BuildingIcons[b.type]} ${snakeToTitleCase(b.type)} (${amount})`
}
