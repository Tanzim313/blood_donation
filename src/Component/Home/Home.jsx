import React from "react";
import Banner from "./Banner";
import Featured from "./Featured";
import ContactUs from "./ContactUs";


const Home =()=>{

    return(
        <div>
            
            <Banner/>
            <div className="p-10">
                <Featured/>
            </div>
            <ContactUs/>  

        </div>
    )

}

export default Home;