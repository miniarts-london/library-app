
import React, { useState, useEffect } from 'react'
import { assetTypes, trendingAssets } from '../config'
import { setIcon } from './Helper'
import { AssetList } from '../models/assets'

type SectionAssetListProps = {
    title:string
    assets:AssetList[]
    handleOpenModal:(e:React.MouseEvent<HTMLElement>, val: {id: number, asset_type: string}) => void
}

export function SectionAssetList({title, assets, handleOpenModal }: SectionAssetListProps) {

    const [trending, setTrending] = useState<AssetList[]>()

    useEffect(() => {
        const trending = assets?.sort((a,b)=>b.likes-a.likes).slice(0,trendingAssets)
        setTrending(trending)
    }, [assets])

    return(
        <>
        <section className="mb-3 mt-10">
            <h2 className="text-3xl font-semibold">{title}</h2>
            {
                title === assetTypes[0] && <p className='text-gray-500'>Curated top picks from this week</p> 
            }
            <div className="gap-4 mb-10 mt-10 grid md:grid-cols-2 text-left">
            {
                !assets && (<>Loading ..</>) || 
                (
                    assets?.map((item, i) => {
                        return (
                            <a href="#" className="group rounded-lg border border-gray-300 bg-gray-100 dark:text-black transition-colors hover:bg-gray-200 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                                key={i}
                                onClick={(e) => handleOpenModal(e, item)}>
                                <div className='max-h-30 flex p-4 gap-3'>
                                    <div className='bg-gray-300 max-w-[10ch] grid content-center'>
                                        {setIcon(item.asset_type)}
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-2xl font-semibold">
                                        {item.name}
                                        </h3>
                                        <p className="h-15 line-clamp-2">
                                            {item.description}
                                        </p>
                                        <p className="text-sm opacity-50">{item.date}</p>
                                    </div>
                                </div>
                            </a>
                        )
                    })
                )
            }
            </div>
        </section>

        <section className="mb-3 mt-10">
            <h2 className="text-3xl font-semibold title">Trending</h2>
            <p className='text-gray-500'>Most polular by community</p>
            <div className="gap-4 mb-30 mt-10 grid md:grid-cols-2 text-left">
            {
                !trending && (<>Loading ..</>) || 
                (
                    trending?.map((item, i) => {
                        return (
                            <a href="#" className="group rounded-lg border border-gray-300 bg-gray-100 dark:text-black transition-colors hover:bg-gray-200 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                                key={i}
                                onClick={(e) => handleOpenModal(e, item)}>
                                <div className= 'max-h-30 flex p-4 gap-3'>
                                    <div className='bg-gray-300 max-w-[10ch] grid content-center'>
                                        <div className='bg-gray-300 max-w-[10ch] grid content-center'>
                                            {setIcon(item.asset_type)}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-2xl font-semibold">
                                        {item.name}
                                        </h3>
                                        <p className="h-15 line-clamp-2">
                                            {item.description}
                                        </p>
                                        <p className="text-sm opacity-50">{item.date}</p>
                                    </div>
                                </div>
                            </a>
                        )
                    })
                )
            }
            </div>
        </section>
        </>
    )
}