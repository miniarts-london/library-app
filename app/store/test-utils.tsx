import { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { AppStore, makeStore } from './store'

export function renderWithStore(
  ui: ReactElement,
  store: AppStore = makeStore(),
) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  }
}
