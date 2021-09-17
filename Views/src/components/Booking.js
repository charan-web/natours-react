import { useEffect } from "react";
import { useParams } from "react-router";
import axios from  "axios"
import {showAlert} from "./alerts"

// import Stripe from "stripe";
// import { Stripe } from "stripe";
// axios.defaults.withCredentials= true
// const stripee = require("stripe")
// ("pk_test_51IwJA8SImVPQaPp7KU8HTgSvoXGZAMvkF02zfkmVRg52y2LSDqmbwrEJplGcrCdyBmOLe0LatV9mPUo2SGrl2D5c00voJ4MnPh")



const Bookings = () => {
    const tourId = useParams()
 
    const url = `https://infinite-spire-90765.herokuapp.com//booking/checkout-session/${tourId.id}`
    
    useEffect(()=>{
        booking()
    //    const scriptTag = document.createElement('script');
    //    scriptTag.src = "https://js.stripe.com/v3/";
    //     scriptTag.async = true;
    //     document.body.appendChild(scriptTag);
            
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const stripe = window.Stripe("pk_test_51IwJA8SImVPQaPp7KU8HTgSvoXGZAMvkF02zfkmVRg52y2LSDqmbwrEJplGcrCdyBmOLe0LatV9mPUo2SGrl2D5c00voJ4MnPh")
    
  
    async function booking(){
        try{
        
        //* Get checkout session
           const session = await axios({
               method:"get",
               url:url,
               withCredentials:true
           })
        //* Charge the credit card
             await stripe.redirectToCheckout({
                 sessionId:session.data.session.id
             })
        }
       
                  
        
        catch(err){
            showAlert("error",err)

        }
       
    }
    
    
    
    
    return (<>
    Payment page is Loading...
    </>  );
}
 
export default Bookings;