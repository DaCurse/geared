import { useCallback, useEffect, useReducer, useState } from 'react'
import './App.css'
import { matchesCost } from './data'
import {
  ActionType,
  deserializeState,
  loadState,
  reducer,
  saveState,
  serializeState,
} from './state'
import { formatBuilding, formatResource, snakeToTitleCase } from './utils'

const TPS = 20
const TICK_INTERVAL = 1000 / TPS
const MIN_MULTIPLIER = TPS / 1000
const AUTOSAVE_EVERY_MS = 10 * 1000

const initialState = await loadState()

function App() {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState)
  const [previousUpdate, setPreviousUpdate] = useState(() => performance.now())

  const update = useCallback(
    (mulitplier: number) => {
      for (const building of state.buildings) {
        if (building.amount <= 0) continue

        dispatch({
          type: ActionType.UPDATE_RESOURCES,
          resources: building.rps,
          multiplier: building.amount * mulitplier,
        })
      }
    },
    [state.buildings]
  )

  // Offline catchup
  useEffect(() => {
    const timeSince = Math.min(
      state.offline.maxCatchupTime,
      Date.now() - state.lastSave
    )

    const mulitplier = (timeSince / 1000) * state.offline.multiplier
    update(mulitplier)
    dispatch({ type: ActionType.SAVE_GAME })

    console.log('catchup', mulitplier, timeSince)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tick = useCallback(() => {
    if (Date.now() - state.lastSave > AUTOSAVE_EVERY_MS) {
      dispatch({ type: ActionType.SAVE_GAME })
    }

    // Catchup when tab is not focused
    const delta = performance.now() - previousUpdate
    setPreviousUpdate(performance.now())
    const multiplier = Math.max(MIN_MULTIPLIER, delta / 1000)

    update(multiplier)
  }, [state.lastSave, previousUpdate, update])

  const saveCurrentState = useCallback(() => saveState(state), [state])

  useEffect(() => {
    saveCurrentState()
  }, [state.lastSave, saveCurrentState])

  useEffect(() => {
    const intervalId = setInterval(tick, TICK_INTERVAL)

    return () => clearInterval(intervalId)
  }, [tick])

  const resources = state.resources.map(resource => (
    <div key={resource.type} style={{ paddingBottom: '1rem' }}>
      {formatResource(resource)}
      <br />

      {resource.minable && (
        <button
          onClick={() =>
            dispatch({
              type: ActionType.UPDATE_RESOURCES,
              resources: [{ type: resource.type, amount: 1 }],
              multiplier: 1,
            })
          }
        >
          Gain {snakeToTitleCase(resource.type)}
        </button>
      )}
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
      <div class="saves">
      <details>
        <summary>
          <h4 className="details-title">Manage Save</h4>
        </summary>

        <div className="grid-container">
          <button onClick={() => dispatch({ type: ActionType.SAVE_GAME })}>
            💾 Save progress
          </button>
          <button
            onClick={() =>
              confirm('Are you sure?') &&
              dispatch({ type: ActionType.SAVE_GAME, reset: true })
            }
          >
            🗑️ Clear Progress
          </button>

          <button
            onClick={async () => {
              const importData = prompt('Enter your exported save code:')
              if (!importData) return

              const importedState = await deserializeState(importData)
              dispatch({
                type: ActionType.IMPORT_STATE,
                state: importedState,
              })
            }}
          >
            ♻️ Import Save
          </button>
          <button
            onClick={async () => {
              prompt(
                'Copy the following code to import it:',
                await serializeState(state)
              )
            }}
          >
            ⬆️ Export Save
          </button>
        </div>
      </details>
      <div>Last saved at {new Date(state.lastSave).toLocaleString()}</div>
    </div>
    <div class="content-container">
      <div class="resources">
        <h3>Resources</h3>
        {resources}
      </div>
      <div class="buildings">
        <h3>Buildings</h3>
        {buildings}
      </div>
    </div>
    </>
  )
}

export default App
