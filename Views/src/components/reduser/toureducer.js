import axios from "axios"
import redux from "redux"
import {createStore} from "redux"
import { applyMiddleware } from "redux"



const GET_TOUR = "GET_TOUR"
const GET_TOUR_SUCCESSFUL = "GET_TOUR_SUCCESSFUL"
const GET_TOUR_FAILED = "GET_TOUR_FAILED"
//initial state
const initialState = {
    
        loading:true,
        data:[],
        error:''
    
}

//Creating Action

function GetTour(){
    return {
        type:GET_TOUR,
    }

}

function GetTourSuccessful(Tour){
    return {
        type:GET_TOUR_SUCCESSFUL,
        payload:Tour
    }
}

function GetTourFailed(msg){
    return{
        type:GET_TOUR_FAILED,
        payload:msg
    }
}


//Creating Reducer

export const touReducer=(state = initialState,action)=>{
    switch(action.type){
        case GET_TOUR : return{
            ...state,
            loading:true,
        }
        case GET_TOUR_SUCCESSFUL : 
           return {...state,
                data:action.payload,
                loading:false
            }
                
            
        case GET_TOUR_FAILED : return {  
            loading:false,
            data:[],
            error:action.payload
        }
        default: return state
    }
}


export const callTheTour=()=> {
    console.log("calling")
   return function(dispatch){ 
       dispatch(GetTour())
       axios.get("http://127.0.0.1:8080/tour/")
       .then(response=>{
           const Tour = response.data.data.tours
         
           dispatch(GetTourSuccessful(Tour))
          console.log(dispatch(GetTourSuccessful(Tour)))
           
           
       }).catch(err=>{
           dispatch(GetTourFailed(err.msg))
           console.log(initialState)
       })
   }
}


