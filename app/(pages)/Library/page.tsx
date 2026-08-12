import { Library } from "../../screen/Library"
import {fetchAssetListFromAPI } from "../../utils/requests"

const getAssetList = () => {
  //load the asset list
  //if we need to authenticate, we can pass here

  /* connect to db directly */
  // return fetchAssetList()

  /* API request */
  return fetchAssetListFromAPI()
}

export default async function LibraryScreen() {
  const data = await getAssetList()

  console.log(data)
  return (
      <main className="flex min-h-screen flex-col p-24">
        <div className="items-center flex flex-col ">
          <h1 className="text-5xl font-black mb-10">Library</h1>
          <p>Browse for assets needed to report and present analysis.</p>
        </div>

        <Library data={data?.assetList || []} />
      </main>
  )
}
