import axios from "axios";
import { useEffect, useState } from "react";
import Tours from "./Tours"
const Books = () => {
    const [tourss,setTourss] = useState([])
  async  function bookings(){
      const tours= await axios({
        method:'get',
        url:'http://127.0.0.1:8080/booking/my-tours',
        
      })
      console.log(tours)
    }
   

    useEffect(()=>{
        bookings()
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