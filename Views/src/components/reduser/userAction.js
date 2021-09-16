import axios from "axios"
import redux from "redux"
// import {createStore} from "redux"
// import { applyMiddleware } from "redux"
// import {thunkMiddleWare} from "redux-thunk"


const GET_USER = "GET_USER"
const GET_USER_SUCCESSFUL = "GET_USER_SUCCESSFUL"
const GET_USER_FAILED = "GET_USER_FAILED"
//initial state
const initialState={
    
        loading:true,
        isLoggedIn:false,
        data:{},
        error:'',
        cookie:document.cookie
    
}

//Creating Action

function GetUser(){
    return {
        type:GET_USER,
    }

}

function GetUserSuccessful(user){
    return {
        type:GET_USER_SUCCESSFUL,
        payload:user
    }
}

function GetUserFailed(msg){
    return{
        type:GET_USER_FAILED,
        payload:msg
    }
}


//Creating Reducer

export function useReducer(state = initialState,action){
    switch(action.type){
        case GET_USER :
           return {
               ...state,
               loading:true
           }
        case GET_USER_SUCCESSFUL : return {
            ...state,
            loading:false,
            isLoggedIn:true,
            data:action.payload
        }
        
        case GET_USER_FAILED : return {
            ...state,
            loading:false,
            data:[],
            error:action.payload
        }
        default: return state
    }
}

axios.defaults.headers.common['authorization'] = `Bearer ${localStorage.getItem('jwt')}`

export function callTheUser(){
       
   return function(dispatch){
       
       dispatch(GetUser())
       axios.get(`/user/me`)
       .then(response=>{
          
           const user = response.data
          
           dispatch(GetUserSuccessful(user))
          
       }).catch(err=>{
           dispatch(GetUserFailed(err.msg))
       })
   }
}


