'use client'

import { useAppSelector } from '../store/hooks'
import { selectFavourites } from '../store/favouritesSlice'

export function FavouritesBar() {
  const favourites = useAppSelector(selectFavourites)

  return (
    <div className="mt-6 w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-sm text-gray-700">
      <p className="font-semibold">Favourites ({favourites.length})</p>
      {favourites.length === 0 ? (
        <p className="mt-1 text-gray-500">
          None yet. Open an asset and tap Favourite item.
        </p>
      ) : (
        <p className="mt-1">{favourites.map((item) => item.name).join(', ')}</p>
      )}
    </div>
  )
}
