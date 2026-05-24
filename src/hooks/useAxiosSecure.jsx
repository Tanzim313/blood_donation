import axios from 'axios';

const axiosSecure = axios.create({
    baseURL: 'https://blood-server-topaz.vercel.app'
})

const useAxiosSecure = ()=>{
    return axiosSecure;
};

export default useAxiosSecure;
