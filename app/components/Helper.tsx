import { assetTypes } from '../config'

export const setIcon = (type: string) => {
    if (type === assetTypes[1]) {
        return (
            <svg className="h-20 w-20 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                <path stroke="none" d="M0 0h24v24H0z"/>  
                <polyline points="4 19 8 13 12 15 16 10 20 14 20 19 4 19" />  
                <polyline points="4 12 7 8 11 10 16 4 20 8" />
            </svg>
        ) 
    } else if (type === assetTypes[2]) { 
        return (
            <svg className="h-20 w-20 text-gray-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  
                <line x1="3" y1="9" x2="21" y2="9" />  
                <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
        )
    } else if (type === assetTypes[3]) {
        return (
            <svg className="h-20 w-20 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                <path stroke="none" d="M0 0h24v24H0z"/>  
                <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />  
                <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />  
                <line x1="3" y1="6" x2="3" y2="19" />  
                <line x1="12" y1="6" x2="12" y2="19" />  
                <line x1="21" y1="6" x2="21" y2="19" />
            </svg>
        )
    } else {
       return (
            <svg className="h-20 w-20 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ) 
    }
}