import { React, useEffect, useState } from 'react';
import {connect} from "react-redux"
import axios from 'axios';    
   
// import { useGlobal } from './useGlobal';

import { useHistory } from 'react-router-dom';
import { showAlert } from './alerts';
// import { showAlert } from './alerts';
const Login = ({user}) => {
  const history = useHistory()
  
    const [data,setData] = useState({email:"",password:""})
  

 const handleChange=(e)=>{
     let name = e.target.id
     let value = e.target.value
     
     setData({...data,[name]:value})
     
 }
 const handleClick=async (e)=>{
     e.preventDefault()
     console.log('clicking')
     try{
       const res= await axios({
        method:'post',
        url:"/user/login/user",
        data:{
          email:data.email,
          password:data.password
      }        
        })
      localStorage.setItem('jwt',res.data.token)
      if(res.status===200){
        showAlert('success',"Logged In")
         user.isLoggedIn=true
        
          if(user.props){
           window.location = user.props.location.pathname
           }else window.location = '/'

      }
    }catch(err){
         console.log(err)
    }
     

 }
  
  return (
    <>
      <main className="main">
        <div className="login-form">      
          <h2  className="heading-secondary ma-bt-lg">Login to your Account</h2> 

          <form className="form--login" >
            <div className="form__group">
              <label className="form__label" htmlFor="email">
                Email Address
              </label>
              <input
                onChange={(e)=>handleChange(e)}
                id="email"
                className="form__input"
                type="email"
                placeholder="you@gmail.com"
              />
            </div>
            <div className="form__group ma-bt-md">
              <label className="form__label" htmlFor="password">
                Password
              </label>
              <input
                onChange={(e)=>handleChange(e)}
                id="password"
                className="form__input"
                type="password"
                placeholder="your password"
                minLength="8"
              />
            </div>
            <div className="form__group">
              {/* <Link to="#" className="btn btn--green">Log In</Link> */}
              <button onClick={(e)=>handleClick(e)} className="btn btn--green">
                Log In
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};


// const mapDispatchToProps=(dispatch)=>{
//     return {
//         call:()=>dispatch(callTheUser())
//     }

// }

const mapStateToProps = (state)=>{
  
    return {
        user:state.user
    }
}




export default connect(mapStateToProps,null)(Login);
    // export default Login
                                 