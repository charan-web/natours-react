import React,{useEffect} from 'react';
import Header from './components/Header';
// import Footer from './components/Footer';
// import Tours from './components/Tours';
import Me from "./components/Me"
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
// import ProtectedRoute from "./components/ProtectedRoute"
import Tours from "./components/Tours"
import Tour from './components/Tour';
// import ProtectedRoute from './components/ProtectedRoute';
// import Error from './components/Error'
import Bookings from './components/Booking';
// // import axios from "axios"\
import Books from "./components/Books"
// axios.defaults.withCredentials=true
// import { callTheTour } from './components/reduser/toureducer';
// import {connect} from "react-redux"
// import jwtDecode from 'jwt-decode'
import { callTheUser } from './components/reduser/userAction';
import {connect} from "react-redux"


const App = ({user,callUser})=>{
  // const [userData,setUserData] = useState()
  useEffect(() => {
    let token  = localStorage.getItem('jwt')
      if(token){
        user.isLoggedIn = true
        // const userInfo = jwtDecode(token)
        // const call = callUser()
        

       
      }
     
  
 
    
  }, [user]);
  return (
    
    <>
    <Header/>
    <Switch>
      <Route exact path="/"><Tours/></Route>
      <Route exact path='/tour/:id' ><Tour/></Route>
      {/* <ProtectedRoute exact path="/me" component={Me}/> */}
      <Route exact path="/me"><Me/></Route>  
      <Route exact path="/login"><Login /></Route>  
       <Route exact path="/bookings"><Books/></Route>
       <Route exact path="/my-tours"><Books/></Route>
      <Route exact path="/booking/:id"><Bookings/></Route> 
      
      
    </Switch>
    

       
    </>
  )
}



const mapStateToProps = (state) =>{
  return {
      user:state.user
  }
}
const mapDispatchToProps = (dispatch) =>{
  return {
      callUser:()=>dispatch(callTheUser())
  }
} 


export default connect(mapStateToProps,mapDispatchToProps)( App);



// export default App;
