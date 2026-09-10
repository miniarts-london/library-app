import React, { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { AssetDetail, Metric, Question } from '../models/assets'
import { fetchMetricData } from '../utils/requests'

export function ViewKpi({ data }: {data: AssetDetail}) {
    const [modalOpen, setModalOpen] = useState(false)
    const [chartData, setChartData] = useState<AssetDetail>()
    const [metrics, setMetrics] = useState<Metric[]>()

    useEffect(()=> {
        //fetch metric data used for charts
        const getMetricsData = async()=>{
            // const metricsData = await fetchMetricData(data.id, false)
            const res = await fetchMetricData() //temp
            setMetrics(res?.metricData?.data)
        }

        if(data?.id){
            getMetricsData()
        }
    }, [data])

    const handleSelectChartType = (chartType: string) => {
        setModalOpen(true)

        const chartData = {
            id: 22,
            name: `${chartType} chart`,
            asset_type: `Chart-${chartType}`,
            likes:0,
            description: '',
            description_short: '',
            type: chartType,
        }
        setChartData(chartData)
    }

    const showChartIcon = (chartType:string) => {
        if(chartType === 'pie'){
            return (
                <svg className="h-12 w-12 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  
                    <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" />  
                    <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" />
                </svg>
            )
        } else if (chartType === 'bar'){
            return(
                <svg className="h-12 w-12 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
            )
        }
    }

    return (
        <>
            <div className="p-4">
                <h3 className="font-semibold">
                    Metric IDs: 
                </h3> 
                <div className="items-center flex flex-row p-4 md:p-5 ">
                    {data.metrics?.map((item: number, i:number) => {
                        return (
                            <span key={i} className='bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600 m-2'>{item}</span>
                        )
                    })}
                </div>

                <h3 className="font-semibold">
                    Affiliate Applicability
                </h3> 
                <div className="p-4 md:p-5 space-y-4">
                    <p>{`${data.affiliate}`}</p>
                </div>
                
                <h3 className="font-semibold">
                    Visuals available
                </h3>
                <div className="p-4 md:p-5 space-y-4">
                    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
                        {
                            data.charts?.map((item:string, i:number)=> {
                                return(
                                    <li key={i} className="me-2">
                                        <a href="#" id={item} onClick={()=>handleSelectChartType(item)}>
                                            {showChartIcon(item)}
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                <h3 className="font-semibold">
                    Business questions
                </h3>
                <div className="mt-3 grid grid-cols-2 text-left gap-3">
                    {
                        data?.questions?.map((item:Question, i:number) => {
                            return (
                                <div key={i} className='bg-gray-100 p-2'>
                                    <h4 className="text-sm">
                                        {item.title}
                                    </h4>
                                    <p className="m-0 max-w-[30ch] text-sm opacity-50">
                                        {item.question}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {chartData && 
                <Modal 
                    open={modalOpen} 
                    data={chartData} 
                    assetType={chartData.asset_type} 
                    metrics={metrics} 
                    setModalOpen={setModalOpen} 
                />
            }
        </>
    )
}