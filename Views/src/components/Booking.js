import { useEffect } from "react";
import { useParams } from "react-router";
import axios from  "axios"
import {showAlert} from "./alerts"

// import Stripe from "stripe";
// import { Stripe } from "stripe";
// axios.defaults.withCredentials= true
// const stripee = require("stripe")
// ("pk_test_51IwJA8SImVPQaPp7KU8HTgSvoXGZAMvkF02zfkmVRg52y2LSDqmbwrEJplGcrCdyBmOLe0LatV9mPUo2SGrl2D5c00voJ4MnPh")

// console.log(process.env.STRIPE_PUBLIC_KEY)

const Bookings = () => {
    const tourId = useParams()
    // console.log("The%20Sea%20Explorer".replace(/%20/g, ' '))
    const url = `/booking/checkout-session/${tourId.id}`
    console.log(url)
    useEffect(()=>{
        booking()
       const scriptTag = document.createElement('script');
       scriptTag.src = "https://js.stripe.com/v3/";
        scriptTag.async = true;
        document.body.appendChild(scriptTag);
            
       
    },[url])
    
    const stripe = window.Stripe("pk_test_51IwJA8SImVPQaPp7KU8HTgSvoXGZAMvkF02zfkmVRg52y2LSDqmbwrEJplGcrCdyBmOLe0LatV9mPUo2SGrl2D5c00voJ4MnPh")
    console.log(stripe)
  
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