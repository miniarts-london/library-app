import { getAssetDetails } from '../../utils/requests'
import { ViewAssetScreen } from '../../screen/ViewAsset'

export default async function AssetView({
    searchParams,
}: {
    searchParams: Promise<{ id: string; assetType: string }>
}) {
    const { id, assetType } = await searchParams
    const details = await getAssetDetails(Number(id))

    return (
        <main className="flex min-h-screen flex-col p-24">
            {details && <ViewAssetScreen data={details} assetType={assetType} />}
        </main>
    )
}
