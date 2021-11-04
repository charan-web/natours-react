import axios from "axios";
import { useEffect, useState } from "react";
import Tours from "./Tours"
axios.defaults.headers['authorization'] = `Bearer ${localStorage.getItem('jwt')}`
const BookedTours = () => {
    const [tourss,setTourss] = useState({})
  async  function bookings(){
      const tours= await axios({
        method:'get',
        url:'https://infinite-spire-90765.herokuapp.com/booking/my-tours',
        // withCredentials:true,
        // headers: {
        //   'Authorization':  `Bearer ${localStorage.getItem('jwt')}`
        // }
      })
      setTourss(tours)
     
    }
   

    useEffect(()=>{
        bookings()
        console.log(tourss)
        // async function getours
    },[])
    return ( 
    <>
     {tourss.length===0? <h1>No tours</h1>:
     <>
      {tourss.tour.map(el=>{
         return <Tours key={el}/>
      })}  </>}
    </> 
    );
}
 
export default BookedTours;