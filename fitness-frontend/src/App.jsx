import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { useDispatch } from 'react-redux'
import { setCredentials } from './store/appSlice'
import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivityDetails from './components/ActivityDetails'
import Navbar from './components/Navbar'

const ActivityPage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ActivityForm onActivityAdded={() => window.location.reload()} />
        <div className="mt-8">
          <ActivityList />
        </div>
      </div>
    </div>
  );
}

const HomePage = ({logIn}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Welcome to FitTrack</h2>
        <p className="text-xl text-gray-600 mb-8">Your personal fitness tracking companion</p>
        <p className="text-gray-500 mb-8">Please login to get started and track your fitness journey!</p>
        <button
          onClick={() => logIn()}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          Login with Your Account
        </button>
      </div>
    </div>
  );
}

function App() {

  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }))
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch])

  return (
    <>
      <BrowserRouter>
        {!token ? (
          <>
            <Navbar/>
            <HomePage logIn={logIn} />
          </>
        ) : (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            
            <Routes>
              <Route path='/activities' element={<ActivityPage />}></Route>
              <Route path='/activities/:id' element={<ActivityDetails />}></Route>
              <Route path='/add-activity' element={<ActivityForm onActivityAdded={() => window.location.reload()} />}></Route>
              <Route path='/' element={<ActivityList />} />
            </Routes>
          </div>
        )}
      </BrowserRouter>
    </>
  )
}

export default App
