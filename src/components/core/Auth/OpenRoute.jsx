import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const OpenRoute = ({children}) => {
    const token = useSelector((state)=> state.auth)
     
      if(token == null){ // if token if not available still ok 
        return children
      }
      else{ // if token available then show dashboard 
        return <Navigate to={'/dashboard/my-profile'}/>
      }
   
}

// OpenRoute means if no token available no problem still can access the children
export default OpenRoute