import React, { useState } from "react";


const ContactUs =()=>{


    const [formData,setFormData] = useState({
        name:"",
        email:"",
        message:"",
    })



    const handleChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        });
    };



    const handleSubmit = (e) =>{
        e.preventDefault();
    }


    return(
        <div>
            <div className="flex flex-col justify-center text-center items-center">
                <h2 className="mt-10 text-red-600 text-2xl font-bold">
                    Get In Touch With Us
                </h2>

                <p className="mt-4 mb-10 ">
                    Have a question? Feel free to reach out, and we will get back to you as soon as possible.
                </p>

                <div className="mb-10">

                <div className="flex flex-col justify-center text-center" >
                    
                <div >

                <form className="flex flex-col justify-center text-center gap-2" onSubmit={handleSubmit}>
                    <input 
                    type="text"
                    name="name"
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-md" />

                    
                    <input 
                    type="text"
                    name="email" 

                    placeholder="Your Email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-md" />
                    
                    <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea w-[300px]" 
                    placeholder="Your Message"></textarea>
                    
                    </form>

                    </div>
                </div>
            </div>

                <div className="mb-10">
                    <h3 className="mb-2 text-red-600 font-bold">Our Contact Number</h3>
                    <p className="mb-2">For urgent queries, call us at:</p>
                    <a href="">01872164554</a>
                </div>
            </div>

        </div>
    )
}

export default ContactUs;