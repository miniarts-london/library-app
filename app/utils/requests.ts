export function ssrApiGet(
    url: string,
    useCache?: boolean,
  ) {
  
    return fetch(url, {
      cache: useCache ? 'force-cache' : 'no-store',
    }).catch((err) => {
      console.log(`Failed ssrApiGet '${url}'`)
      throw err
    })
}

export async function ssrApiGetJson<T>(
    path: string,
    useCache?: boolean,
  ): Promise<T> {
    const res = await ssrApiGet(path, useCache)
    return res.json()
}

// fetch data from service-express API
export async function getAssetDetails(
    id: number
  ) 
  {
    const host = 'https://service-express-nine.vercel.app'
    // const host = 'http://localhost:3000'
    const url = `${host}/api/asset/${id}`
  
    const res = await ssrApiGet(url, false)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    return res.json()
   
}

// fetch data from service-express API
export async function fetchAssetListFromAPI(){
  const host = 'https://service-express-nine.vercel.app'
  // const host = 'http://localhost:3000'
  const url = `${host}/api/asset`
 
  const res = await ssrApiGet(url, false)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

// fetch data from DB
export async function fetchAssetList(){
  const host = 'https://library-app-omega-five.vercel.app'
  // const host = 'http://localhost:3000'
  const url = `${host}/api/assetList`
  
  const res = await ssrApiGet(url, false)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}


export async function fetchMetricData(
  // id: number, 
  // useCache?: boolean
){
  const host = window.location.origin
  const url =`${host}/api/metricData`

  const res = await ssrApiGet(url, false)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}