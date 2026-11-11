import { sum } from '../core/index.ts'
import { Total } from '../ui/Total.tsx'

/** App layer: wires the core logic to the UI components. */
function App() {
  return (
    <main>
      <h1>Sandbox</h1>
      <Total value={sum(2, 3)} />
    </main>
  )
}

export default App
