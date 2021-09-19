import { React, useEffect } from 'react';
// import './../App.css'
import { Link } from 'react-router-dom';
import {connect} from "react-redux"
import { callTheUser } from './reduser/userAction';
// import { useGlobal } from './useGlobal';
import { showAlert } from './alerts';
// import axios from 'axios';
// import jwtDecode from 'jwt-decode'

const Header = ({user,callUser}) => {
    useEffect(()=>{ 
     callUser()
     
   
          
    },[callUser])
   
const logout = async ()=>{
  // try {
  //  await axios({  
  //     method:'get',
  //     url :'http://127.0.0.1:8080/user/logout',

  //   })
  //   window.location = '/'
  // } catch (error) {
  //   showAlert("error","Error loggin out")
  
    
  // }
  localStorage.removeItem('jwt')
  showAlert('success',"Logged Out")
  window.location = "/"
}


  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All Tours
        </Link>
        <form className="nav__search">
          <button className="nav__search-btn">
            <svg>
              <use href="./../img/icons.svg#icon-search"></use>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search tours"
            className="nav__search-input"
          />
        </form>
      </nav>
      <div className="header__logo">
        <img src="./../img/logo-white.png" alt="Natours logo" />
      </div>
      {user.isLoggedIn ? (
        <nav className="nav nav--user">
          <Link className="nav__el nav__el--logout" to="" onClick={()=>logout()}>
            Log out
          </Link>
          <Link to="/Me" className="nav__el">
            <img
              className="nav__user-img"
              src={`/img/users/${user?.data?.data?.user?.photo}`}
              alt="user"
            />
            <span>{user?.data?.data?.user?.name.split(' ')[0]}</span>
          </Link> 
        </nav>
      ) : ( 
        <nav className="nav nav--user">
          <Link className="nav__el" to="/login">
            Log in
          </Link>
          <Link to="/singup" className="nav__el nav__el--cta ">
            Sign up
          </Link>
        </nav>
      )}
    </header>
  );
};

const mapStateToProps = (state) =>{
 
//  console.log(state.user)
      return {
          user:state.user
      }
}
const mapDispatchToProps = (dispatch) =>{
      return {
          callUser:()=>dispatch(callTheUser())
      }
} 


export default connect(mapStateToProps,mapDispatchToProps)( Header);
