import React from 'react'
import { AssetDetail } from '../models/assets'

export function ViewLayout({ data }: {data: AssetDetail}) {

    return (
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
                Preview
            </h3>
            <div className="px-5 py-20 space-y-4 bg-gray-200">

                LAYOUT

            </div>
        </div>
    )
}