import axios from "axios";
import { useEffect, useState } from "react";
import Tours from "./Tours"
const Books = () => {
    const [tourss,setTourss] = useState([])
  async  function bookings(){
      const tours= await axios({
        method:'get',
        url:'/booking/my-tours',
        
      })
     
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