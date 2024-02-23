import { useCallback, useEffect, useReducer } from 'react'
import './App.css'
import { ActionType, matchesCost } from './data'
import { initialState } from './initialState'
import { reducer } from './state'
import { formatResource, snakeToTitleCase } from './utils'

function App() {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)

  const update = useCallback(() => {
    for (const building of state.buildings) {
      for (const { type, amount } of building.rps) {
        dispatch({
          type: ActionType.UPDATE_RESOURCE,
          resource: { type, amount: (amount * building.amount) / state.tps },
        })
      }
    }
  }, [state.tps, state.buildings])

  useEffect(() => {
    const intervalId = setInterval(update, 1000 / state.tps)

    return () => clearInterval(intervalId)
  }, [state.tps, update])

  const resources = state.resources.map(resource => (
    <div style={{ paddingBottom: '1rem' }}>
      {formatResource(resource)}
      <br />

      <button
        onClick={() =>
          dispatch({
            type: ActionType.UPDATE_RESOURCE,
            resource: { type: resource.type, amount: 1 },
          })
        }
      >
        Gain {snakeToTitleCase(resource.type)}
      </button>
    </div>
  ))

  const buildings = state.buildings.map(building => (
    <details>
      <summary>
        <h3 className="details-title">
          {snakeToTitleCase(building.type)} ({building.amount})
        </h3>
      </summary>
      <h4>
        <button
          disabled={!matchesCost(state.resources, building.cost)}
          onClick={() =>
            dispatch({
              type: ActionType.PURCHASE_BUILDING,
              buildingType: building.type,
            })
          }
        >
          Buy {snakeToTitleCase(building.type)}
        </button>
      </h4>

      <div>
        <strong>Cost</strong>
      </div>
      <ul>
        {building.cost.map(r => (
          <li>{formatResource(r)}</li>
        ))}
      </ul>

      <div>
        <strong>Production per second</strong>
      </div>
      <ul>
        {building.rps.map(r => (
          <li>{formatResource(r)}</li>
        ))}
      </ul>
    </details>
  ))

  return (
    <>
      <p>
        <h2>Resources</h2>
        {resources}
      </p>
      <p>
        <h2>Buildings</h2>
        {buildings}
      </p>
    </>
  )
}

export default App
