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
  display: grid;
  min-height: 100vh;
  justify-center: center;
`
const Spacer = styled.div`
  height: 50px;
`
const Container = styled.div`
  width: 80vw;
  justify-self: center;
`

function App () {
  return (
    <EthVod className='App'>
      <Header />
      <Spacer />
      <Container>
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
      </Container>
    </EthVod>
  )
}

export default App
