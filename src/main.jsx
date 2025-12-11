import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from './Component/Login/Login.jsx';
import Register from './Component/Register/Register.jsx';
import Root from './Routes/Root.jsx';
import AuthProvider from './Authprovider/AuthProvider.jsx';
import './index.css'
import Home from './Component/Home/Home.jsx';
import Dashboard from './Component/Dashboard/Dashboard.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Profile from './Component/Dashboard/Profile.jsx';
import CreateDonation from './Component/Dashboard/CreateDonation.jsx';
import MyDonationRequests from './Component/Dashboard/MyDonationRequests.jsx';
import DashboardHome from './Component/Dashboard/DashboardHome.jsx';
import DonorDashboard from './Component/Dashboard/DonorDashboard.jsx';
import AdminDashboard from './Component/Dashboard/Admin/AdminDashboard.jsx';
import BloodDonationRequests from './Component/Home/BloodDonationRequests.jsx';
import BloodDonationDetails from './Component/Home/BloodDonationDetails.jsx';
import Donate from './Component/Home/Donate.jsx';
import { AllUsers } from './Component/Dashboard/Admin/AllUsers.jsx';
import AllBloodRequest from './Component/Dashboard/Admin/AllBloodRequest.jsx';
import AllBloodVolunteer from './Component/Dashboard/Volunteer/AllBloodVolunteer.jsx';
import Funding from './Component/Home/Funding.jsx';
import FundingSuccess from './Component/Home/FundingSuccess.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/> ,

    children:[
      {
        path:"/",
        element:<Home/>
      },
      {
        path:"/pending-donation",
        element:<BloodDonationRequests/>
      },
      {
            path:"/pending-details",
            element: <BloodDonationDetails/>
      },
      { 
        path:"/donate",
        element: <Donate/>

      },
      {
            path:'login',
            element:<Login/>
      },
      {
            path:'register',
            element:<Register/>,

            loader: async () => {
              const districts = await fetch('/districts.json').then(res=>res.json());
              const upozilas = await fetch('/upozila.json').then(res=>res.json());
            
            return { districts, upozilas };
            }
      },
      {
        path:'/funding',
        element: <Funding/>
      }
      ,{
        path:"/funding-success",
        element: <FundingSuccess/>
      }
    ]
  },
  {
            
    path:'dashboard',
    element: <Dashboard/>,

    children:[

      {
        index:true,
        element: <DashboardHome/>
      },
      
      {
        path:'profile',
        element: <Profile/>
      },
      {
        path:'create-donation-request',
        element: <CreateDonation/>,

        loader: async () => {
              const districts = await fetch('/districts.json').then(res=>res.json());
              const upozilas = await fetch('/upozila.json').then(res=>res.json());
            
            return { districts, upozilas };
            }

      }
      ,
      {
        path:'my-donation-requests',
        element: <MyDonationRequests/>
      }
      ,
      {
        path:'all-users',
        element: <AllUsers/>
      }
      ,
      {
        path:'all-donations',
        element: <AllBloodRequest/>
      }
      ,
      {
        path:'all-donations-volunteer',
        element: <AllBloodVolunteer/>
      }
      

    ]

  }
]);



// Create a client
const queryClient = new QueryClient()



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
              <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
    
  </StrictMode>,
)
