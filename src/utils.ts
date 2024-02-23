import { Resource } from './data'

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
  return `${Math.floor(r.amount).toLocaleString()} ${snakeToTitleCase(r.type)}`
}
