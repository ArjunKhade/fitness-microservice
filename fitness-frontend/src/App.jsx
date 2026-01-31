import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { Box, Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDispatch } from 'react-redux'
import { setCredentials } from './store/appSlice'
import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivityDetails from './components/ActivityDetails'

const ActivityPage = () => {
  return(
    <Box sx={{ p: 2, border: '1px dashed grey' }}>
          <ActivityForm onActivityAdded = { () => window.location.reload()}/>
          <ActivityList/>
    </Box>
  );
}

function App() {

  const {token, tokenData, logIn, logOut, isAuthenticated} = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady]= useState(false);

  useEffect(()=>{
    if(token) {
      dispatch(setCredentials({token, user: tokenData}))
      setAuthReady(true);
    }
  },[token, tokenData, dispatch])

  return (
    
    <>
    <h1> Fitness Microservices App </h1>
    <BrowserRouter>

       {!token ? (
      <Button onClick={() => logIn()} variant="contained">Login</Button>
       ) : (
        <div>
          <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Button onClick={() => logOut()} variant="contained">Logout</Button>
        </Box>

        <Routes>
            <Route path='/activities' element={<ActivityPage/>}></Route>
            <Route path='/activities/:id' element={<ActivityDetails/>}></Route>
            <Route path='/' element={token? <Navigate to="/activities" replace/>
            : <div>Welcome! Please login</div>}/>
        </Routes>
        </div>
       )}  

    </BrowserRouter>
    </>
  )
}

export default App
