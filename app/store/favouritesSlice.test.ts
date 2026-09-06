import { makeStore } from './store'
import { selectFavourites, selectIsFavourite, toggleFavourite } from './favouritesSlice'

describe('favouritesSlice', () => {
  test('adds and removes a favourite', () => {
    const store = makeStore()
    const asset = { id: 1, name: 'KPI Alpha' }

    store.dispatch(toggleFavourite(asset))
    expect(selectFavourites(store.getState())).toEqual([asset])
    expect(selectIsFavourite(1)(store.getState())).toBe(true)

    store.dispatch(toggleFavourite(asset))
    expect(selectFavourites(store.getState())).toEqual([])
    expect(selectIsFavourite(1)(store.getState())).toBe(false)
  })
})
