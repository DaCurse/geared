import { useCallback, useEffect, useReducer } from 'react'
import './App.css'
import { matchesCost } from './data'
import { ActionType, loadState, reducer } from './state'
import { formatBuilding, formatResource, snakeToTitleCase } from './utils'

const AUTOSAVE_EVERY_MS = 10 * 1000

const initialState = loadState()

function App() {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)

  const update = useCallback(() => {
    if (Date.now() - state.lastSave > AUTOSAVE_EVERY_MS) {
      dispatch({ type: ActionType.SAVE })
    }

    for (const building of state.buildings) {
      for (const { type, amount } of building.rps) {
        dispatch({
          type: ActionType.UPDATE_RESOURCE,
          resource: { type, amount: (amount * building.amount) / state.tps },
        })
      }
    }
  }, [state.tps, state.lastSave, state.buildings])

  useEffect(() => {
    const intervalId = setInterval(update, 1000 / state.tps)

    return () => clearInterval(intervalId)
  }, [state.tps, update])

  const resources = state.resources.map(resource => (
    <div key={resource.type} style={{ paddingBottom: '1rem' }}>
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
    <details key={building.type}>
      <summary>
        <h3 className="details-title">{formatBuilding(building)}</h3>
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
          <li key={r.type}>{formatResource(r)}</li>
        ))}
      </ul>

      <div>
        <strong>Production per second</strong>
      </div>
      <ul>
        {building.rps.map(r => (
          <li key={r.type}>{formatResource(r)}</li>
        ))}
      </ul>
    </details>
  ))

  return (
    <>
      <h2>⚙️ Geared</h2>
      <p>
        <h3>Resources</h3>
        {resources}
      </p>
      <p>
        <h3>Buildings</h3>
        {buildings}
      </p>
      <p>
        <button onClick={() => dispatch({ type: ActionType.SAVE })}>
          💾 Save progress
        </button>
        <button
          onClick={() =>
            confirm('Are you sure?') &&
            dispatch({ type: ActionType.SAVE, reset: true })
          }
        >
          🗑️ Clear Progress
        </button>
        <div>Last saved at {new Date(state.lastSave).toLocaleString()}</div>
      </p>
    </>
  )
}

export default App
