import { useEffect, useState } from 'react'
import Comi from './Comi.jsx'
import Landing from './Landing.jsx'

function getRoute() {
  return window.location.hash.startsWith('#app') ? 'app' : 'landing'
}

export default function App() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route === 'app' ? <Comi /> : <Landing />
}
