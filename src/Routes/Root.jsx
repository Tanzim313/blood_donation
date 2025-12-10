import React from "react";

import { Outlet } from "react-router";
import Nabvar from "../LayOut/Nabvar";
import Footer from "../LayOut/Footer";


const Root =()=>{

    return(
        <div>

            <Nabvar></Nabvar>
            <Outlet></Outlet>
            <Footer></Footer>
        

        </div>
    )

}

export default Root;