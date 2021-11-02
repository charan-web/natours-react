import axios from "axios";
import { useEffect, useState } from "react";
import Tours from "./Tours"
axios.defaults.headers['authorization'] = `Bearer ${localStorage.getItem('jwt')}`
const Books = () => {
    const [tourss,setTourss] = useState([])
  async  function bookings(){
      const tours= await axios({
        method:'get',
        url:'https://infinite-spire-90765.herokuapp.com/webhook-checkout',
        withCredentials:true,
        headers: {
          'Authorization':  `Bearer ${localStorage.getItem('jwt')}`
        }
      })
      setTourss(tours)
     
    }
   

    useEffect(()=>{
        bookings()
        // async function getours
    },[])
    return ( 
    <>
     {tourss.length===0? <h1>No tours</h1>:<>
      {tourss.map(el=>{
         return <Tours/>
      })}  </>}
    </> 
    );
}
 
export default Books;