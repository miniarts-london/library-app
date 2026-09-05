import React, { useState, useEffect } from 'react'
import { ViewLayout } from './ViewLayout'
import { ViewKpi } from './ViewKpi'
import { ViewStoryboard } from './ViewStoryboard'
import { ViewChart } from './ViewChart'
import { getAssetDetails } from '../utils/requests'
import { assetTypes } from '../config'
import { AssetDetail, ModalDataProps } from '../models/assets'
import { ChartData } from '../models/charts'
import { COPY_LINK_PATH } from '../config'
import { setIcon } from './Helper'
import { createPortal } from 'react-dom'

interface ModalProps{
    open: boolean
    data: ModalDataProps
    assetType: string
    setModalOpen: (val:boolean) => void
    metrics?: ChartData[]
    children?: any
}

export function Modal({ open, data, assetType, setModalOpen, metrics=[], children }: ModalProps) {

    const [assetDetail, setAssetDetail] = useState<AssetDetail>()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    useEffect(()=>{
        //Get each asset details
       const getDetails = async() => {
        const details = await getAssetDetails(data.id)
        details.type = data.type //assign clicked chart type
        const newData = {type: data.type, ...details}
        setAssetDetail(newData)
       }

       if(data.id && assetType){
            getDetails()
       }
    },[data, assetType])

    const copyLink = (data: ModalDataProps) => {
        const url = location.origin
        const link = `${url}/${COPY_LINK_PATH}?id=${data.id}&assetType=${assetType}` 
        navigator.clipboard.writeText(link)
    }

    const handleClickFavourite = () => {}

    const handleSetModalOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if((e.target as any).id === "default-modal"){
            setModalOpen(false)
        }
    }
        
    if (!mounted) return null

    const modalRoot = document.getElementById('modal-root')
    if (!modalRoot) return null

    return createPortal(
        <>
            <div id="default-modal" aria-hidden="true" onClick={(e)=>handleSetModalOpen(e)} className={`${open?'':'hidden'} fixed z-50 inset-0 bg-gray-400 bg-opacity-60 overflow-y-auto h-full w-full px-4`}>
                <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-3xl p-4 z-51" >
                    <div className="flex items-center justify-end p-2 gap-4">
                        <button id="copy-link" type="button" onClick={()=>copyLink(data)} className="text-gray-400 bg-transparent origin-center -rotate-45" data-modal-hide="default-modal">
                            <svg className="h-5 w-5 text-gray-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  
                                <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />  <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        </button>
                        <button type="button" onClick={()=>setModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="text-center">
                        <div className='grid place-content-center mb-2'>
                            <span className='bg-gray-100 rounded p-1'>
                                {setIcon(data.asset_type)}
                            </span>
                        </div>
                        <h2 className="title text-3xl font-semibold text-gray-900 flex justify-center items-center gap-3">
                            {assetDetail?.name} 
                            <span className="bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">{data.asset_type}</span>
                        </h2>
                        <p className="text-gray-400 text-sm">{assetDetail?.description_short}</p>
                        <p className="text-gray-600 mt-5 mx-5">{assetDetail?.description}</p>
                    </div>

                    {
                        assetDetail && Object.keys(assetDetail).length? 
                            (
                                <>
                                    <div className="flex justify-center gap-2 flex-wrap p-4">
                                        {
                                            assetDetail.tags?.map((item:string, i:number) => {
                                                return (
                                                    <span 
                                                        key={i} 
                                                        className="bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 border rounded">
                                                            {`#${item}`}
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                    
                                    
                                    {assetType === assetTypes[1] && <ViewKpi data={assetDetail} />}
                                    {assetType === assetTypes[2] && <ViewLayout data={assetDetail}/>}
                                    {assetType === assetTypes[3] && <ViewStoryboard data={assetDetail}/>}
                                    {assetType.includes('Chart') && <ViewChart data={assetDetail} metrics={metrics}/>}
                                    
                                </>
                            ):(<>Loading ...</>)
                        }

                        {children}

                        <button type="submit" onClick={handleClickFavourite} className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-white gap-3">
                            <svg className="h-6 w-6 text-gray-200"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                            </svg>
                            Favourite item
                        </button>
                </div>
            </div>
        </>,
        modalRoot
    )
}