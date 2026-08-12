import React from 'react'
import { getAssetDetails } from '../../utils/requests'
import { ViewAssetScreen } from '../../screen/ViewAsset'

export default async function AssetView({searchParams}: 
    {searchParams:{id: string, assetType: string}}) {

    //get the params from url and fetch the asset details
    const id = searchParams.id
    const assetType = searchParams.assetType
    const details = await getAssetDetails(Number(id))

    return (
        <main className="flex min-h-screen flex-col p-24">
            {details && <ViewAssetScreen data={details} assetType={assetType} />}
        </main>
    )
}