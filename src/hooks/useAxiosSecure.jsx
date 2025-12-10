import axios from 'axios';
import React, { use, useEffect } from 'react';
import { AuthContext } from '../Authprovider/AuthContext';



const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = ()=>{

    const {user} = use(AuthContext);

    useEffect(()=>{
        //intercept request
        axiosSecure.interceptors.request.use(config=>{
            config.headers.Authorization = `Bearer ${user?.accessToken}`
            return config
        })
    },[user])

    return axiosSecure;

};

export default useAxiosSecure;