import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRouteEmployes = ({ children }) => {
    return localStorage.getItem("validEmployee") ? children : <Navigate to="/connexion-employes" />
}

export default PrivateRouteEmployes