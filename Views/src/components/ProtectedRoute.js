import React, { Component, useReducer } from 'react';
import { connect } from 'react-redux';
import {Redirect, Route} from "react-router-dom"



const ProtectedRoute = ({path,component:Component,user,render,...rest})=>{
   return (  
    <Route
    {...rest}   
    render={props=>{
        user.props = props
       if(localStorage.getItem('jwt')) user.isLoggedIn = true
        if(!user.isLoggedIn) return <Redirect to={{
            pathname:"/login",
            state:{from:props.location}
        }}/>
      
        return Component ? <Component charn={props}/> : render(props)
    }}
    />
   )


  

}
const mapStateToProps=(state)=>{
    return {
        user: state.user 
    }
}
export default connect(mapStateToProps,null)(ProtectedRoute)

