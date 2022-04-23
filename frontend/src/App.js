import React from 'react'
import Login from './pages/login'
import Upload from './pages/upload'
import Payment from './pages/payment'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import './css/style.sass'
import './App.css'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const EthVod = styled.div`
  height: 100vh;
  background-color: black;
`

function App () {
  return (
    <EthVod className='App'>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route
            path='/login'
            element={<Login />}
            // element={props => (<Login {...props} />)}
            // render={props => (<Login {...props} />)}
          />
          <Route
            path='/upload'
            element={<Upload />}
            // element={props => (<Login {...props} />)}
            // render={props => (<Login {...props} />)}
          />
          <Route
            path='/payment'
            element={<Payment />}
            // element={props => (<Login {...props} />)}
            // render={props => (<Login {...props} />)}
          />

          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </EthVod>
  )
}

export default App
