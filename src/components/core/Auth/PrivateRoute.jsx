import React from 'react'
import { useSelector } from 'react-redux'
import {Navigate} from 'react-router-dom'

const PrivateRoute = () => {
    const {token} = useSelector((state)=>state.auth)
 

    // if token available 
    if(token !== null){
        return children
    }
    else{ // no available then login
        return <Navigate to="/login" />
    }
    
  
}
// login required for privateRoute 
export default PrivateRoute