import { useEffect } from 'react'
import AddEmployee from './Components/AddEmployee'
import Dashboard from './Components/Dashboard'
import EditEmployee from './Components/EditEmployee'
import Employee from './Components/Employee'
import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Start from './Components/Start'
import PrivateRoute from './Components/PrivateRoute'
import PrivateRouteEmployes from './Components/PrivateRouteEmployes'
import Logout from './Components/Logout'
import Tablette from './Components/Tablette'
import Poste from './Components/Poste'
import LoginEmployee from './Components/LoginEmployee'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/connexion-employes' element={<LoginEmployee />}></Route>
        <Route path='/deconnexion' element={<Logout />}></Route>
        <Route path='/tablette' element={
          <PrivateRouteEmployes>
            <Tablette />
          </PrivateRouteEmployes>
        }></Route>
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
          <Route path='' element={<Home />}></Route>
          <Route path='/dashboard/employee' element={<Employee />}></Route>
          <Route path='/dashboard/poste' element={<Poste />}></Route>
          <Route path='/dashboard/add_employee' element={<AddEmployee />}></Route>
          <Route path='/dashboard/edit_employee/:id' element={<EditEmployee />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
