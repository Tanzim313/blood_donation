import axios from 'axios';
import React, { use, useContext, useEffect } from 'react';
import { AuthContext } from '../Authprovider/AuthContext';



const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = ()=>{

    const {user} = use(AuthContext);


    return axiosSecure;

};

export default useAxiosSecure;