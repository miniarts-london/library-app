import { redirect } from 'next/navigation'
// import { analyticsInit } from './analytics'

export default function Home() {
  
  //Show the Library page when you access the url
  return redirect('/Library')
}
