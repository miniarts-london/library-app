import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

export type FavouriteAsset = {
  id: number
  name: string
}

type FavouritesState = {
  items: FavouriteAsset[]
}

const initialState: FavouritesState = {
  items: [],
}

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<FavouriteAsset>) {
      const exists = state.items.some((item) => item.id === action.payload.id)
      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload.id)
        return
      }
      state.items.push(action.payload)
    },
  },
})

export const { toggleFavourite } = favouritesSlice.actions

export const selectFavourites = (state: RootState) => state.favourites.items

export const selectIsFavourite = (id: number) => (state: RootState) =>
  state.favourites.items.some((item) => item.id === id)

export default favouritesSlice.reducer
