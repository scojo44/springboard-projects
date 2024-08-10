import React from 'react'
import NavBar from './widgets/NavBar'
import RoutesList from './RoutesList'
import './App.css'

function App() {
  return (
    <>
      <NavBar />
      <main>
        <RoutesList />
      </main>
    </>
  )
}

export default App
