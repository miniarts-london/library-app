export type Question = {
    title: string
    question: string
}

export interface AssetDetail {
    id: number
    name: string
    description_short: string
    description:string
    asset_type: string
    date?: string
    tags?:string[]
    questions?: Question[]
    like?:number
    metrics?:number[]
    charts?:string[]
    affiliate?:boolean
    kpi?:string[]
    affiliate_list?:string[]
    type?:string
    used?:number
    pageNum?:number
}


export interface AssetList {
    id: number
    name: string
    description?: string
    description_short?: string
    date?: string
    asset_type: string
    likes: number
    featured?: boolean
}

export interface Metric {
    id: number
    name: string
    label: string
    value: number
}

export type ModalDataProps = {
    id: number
    asset_type: string
    type?: string
}