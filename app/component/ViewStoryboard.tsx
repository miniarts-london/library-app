import React from 'react'
import { AssetDetail } from '../models/assets'

export function ViewStoryboard({ data }: {data: AssetDetail}) {
    
    return (
        <>
            <div className="p-4">
                <div className="items-center flex flex-col">
                    <ul className="flex flex-wrap text-center divide-x">
                        <li className="me-2 px-5 py-3">
                            <div className='font-bold'>{data.used}</div>
                            <div className='text-gray-500 text-sm'>Used</div>
                        </li>
                        <li className="me-2 px-5 py-3">
                            <div className='font-bold'>{data.type}</div>
                            <div className='text-gray-500 text-sm'>Type</div>
                        </li>
                        <li className="me-2 px-5 py-3">
                            <div className='font-bold'>{data.pageNum}</div>
                            <div className='text-gray-500 text-sm'>Pages No.</div>
                        </li>
                        <li className="me-2 px-5 py-3">
                            <div className='font-bold'>{data.date}</div>
                            <div className='text-gray-500 text-sm'>Last Updated</div>
                        </li>
                    </ul>
                </div>

                <h3 className="font-semibold">
                    Used KPI
                </h3>
                <div className="p-4 md:p-5 space-y-4">
                    {
                        data.kpi?.map((item:string, i: number)=>{
                            return(
                                <span key={i} className='bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 m-2'>{item}</span>
                            )
                        })
                    }
                </div>

                <h3 className="font-semibold">
                    Affiliates
                </h3>
                <div className="p-4 md:p-5 space-y-4">
                    {
                        data.affiliate_list?.map((item:string, i: number)=>{
                            return(
                                <span key={i} className='bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 m-2'>{item}</span>
                            )
                        })
                    }
                </div>
            </div>
            <button type="submit" className="mb-3 inline-flex w-full items-center justify-center rounded-lg p-2 py-3 gap-3 border border-gray-700">
                <svg className="h-6 w-6 text-gray-600"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  
                    <path d="M20 12h-13l3 -3m0 6l-3 -3" />
                </svg>
                Request access
            </button>
        </>
    )
}