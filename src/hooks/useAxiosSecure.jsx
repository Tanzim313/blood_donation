import axios from 'axios';
import React, { use, useContext, useEffect } from 'react';
import { AuthContext } from '../Authprovider/AuthContext';



const axiosSecure = axios.create({
    baseURL: 'https://blood-server-topaz.vercel.app'
})

const useAxiosSecure = ()=>{

    const {user} = use(AuthContext);


    return axiosSecure;

};

export default useAxiosSecure;