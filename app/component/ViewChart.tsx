import React from 'react'
import { AssetDetail } from '../models/assets'
import { PieChart } from './ChartsNivo/Pie/PieChart'
import { BarChart } from './ChartsNivo/Bar/BarChart'
import { ChartData } from '../models/charts'

export function ViewChart({ data, metrics }: {data: AssetDetail, metrics:ChartData[]}) {

    const total = metrics?.reduce((n:number, {value}:any) => n + value, 0)
    const pieFixedProps = {}

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
                            <div className='font-bold'>{data.date}</div>
                            <div className='text-gray-500 text-sm'>Last Updated</div>
                        </li>
                    </ul>
                </div>

                <h3 className="font-semibold">
                    Applicable KPI favourites
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
            </div>       

            <div className="p-4">
                <h3 className="font-semibold">
                    Data
                </h3>
                <div className='bg-gray-100 p-3'>
                    <table width={300} className='bg-gray-100 p-3'>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th className='text-left'>Name</th>
                                <th className='text-right'>Value</th>
                            </tr>
                            {metrics?.map((item:ChartData, i:number) => {
                                return (
                                    <tr key={i}><th>{item.id}</th><td>{item.name}</td><td className='text-right'>{item.value}</td></tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='grid place-content-center'>
                    <div style={{ width: '400px', height: '300px' }}>
                        {metrics && metrics.length ? data.type?.toLowerCase() === "pie"? (
                            <PieChart
                                data={metrics}
                                valueFormat={(value: number) => {
                                    const val = (value / total) * 100
                                    const num = Number(Number(val).toFixed(2))
                                    return `${num}`
                                }}
                                props={pieFixedProps}
                            /> ):(
                            <BarChart
                                data={metrics}
                            />
                            ) : (
                                <div className='p-4'>
                                    Loading ...
                                </div>
                        )}
                    </div>
                </div>
            </div>         
        </>
    )
}