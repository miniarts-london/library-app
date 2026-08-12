export function Request ({requestOpen,setRequestOpen}: {requestOpen:boolean, setRequestOpen:(val:boolean) => void}){

    return (
        <div className="fixed top-10 right-0">
            <button type="submit" onClick={()=>setRequestOpen(true)} className={`${requestOpen?'hidden':''} inline-flex items-center justify-center rounded-lg bg-gray-600 p-5 py-3 text-white gap-3`}>
            <svg className="h-6 w-6 text-gray-200"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                <path stroke="none" d="M0 0h24v24H0z"/>  
                <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3" />  
                <line x1="12" y1="12" x2="20" y2="7.5" />  
                <line x1="12" y1="12" x2="12" y2="21" />  
                <line x1="12" y1="12" x2="4" y2="7.5" />
            </svg>
                Request
            </button> 
            
            <div className={`${requestOpen?'':'hidden'} bg-gray-200 p-4 flex flex-col`}>
            <div className='flex justify-between'>
                <h3 className="mb-2">Request</h3>
                <button type="button" onClick={()=>setRequestOpen(false)} className={`${requestOpen?'':'hidden'} text-gray-400 bg-gray-300 p-2`} data-modal-hide="default-modal">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close request</span>
                </button>
            </div>
            <textarea rows={6}/>
            <button onClick={()=>setRequestOpen(false)} className="bg-gray-300 p-2">Send</button>
            </div>
      </div>
    )
}