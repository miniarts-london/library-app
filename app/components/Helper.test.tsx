import { setIcon } from './Helper'

describe('Helper', () => {
    test('render an icon', () => {
        expect(setIcon('KPI')).toEqual(
            <svg className="h-20 w-20 text-gray-500"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  
                <path stroke="none" d="M0 0h24v24H0z"/>  
                <polyline points="4 19 8 13 12 15 16 10 20 14 20 19 4 19" />  
                <polyline points="4 12 7 8 11 10 16 4 20 8" />
            </svg>
        );

        expect(setIcon('TEST')).toEqual(
            <svg className="h-20 w-20 text-gray-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        );
    });
})