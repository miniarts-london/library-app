import { configureStore } from '@reduxjs/toolkit'
import favouritesReducer from './favouritesSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      favourites: favouritesReducer,
    },
    // Shows up as "library-app" in the Redux DevTools Chrome extension
    devTools: process.env.NODE_ENV !== 'production' ? { name: 'library-app' } : false,
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
