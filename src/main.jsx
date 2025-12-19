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
import Search from './Component/Home/Search.jsx';
import DonationDetails from './Component/Dashboard/DonationDetails.jsx';
import DonationEdit from './Component/Dashboard/DonationEdit.jsx';
import PrivateRoutes from './Routes/PrivateRoutes.jsx';
import ForgotPassword from './Component/ForgotPassword.jsx';
import Error from './Error/Error.jsx';
import AdminRoutes from './Routes/AdminRoutes.jsx';
import VolunteerRoutes from './Routes/VolunteerRoutes.jsx';


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
        path:"search",
        element: <Search/>
      },
      {
        path:"/pending-donation",
        element:<BloodDonationRequests/>
      },
      {
        path:"/pending-details/:id",
        element: 
        <PrivateRoutes>
                <BloodDonationDetails/>
        </PrivateRoutes>
        
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
        element: 
        <PrivateRoutes>
                <Funding/>
        </PrivateRoutes>
        
      }
      ,{
        path:"/funding-success",
        element: 
        <PrivateRoutes>
                <FundingSuccess/>
        </PrivateRoutes>
        
      },
      {
        path:"forgot-password",
        element: <ForgotPassword/>
      },{
      path:"*",
      element: <Error/>
    }
    ]
  },
  {
            
    path:'dashboard',
    element: 
    <PrivateRoutes>
          <Dashboard/>
    </PrivateRoutes>,

    children:[

      {
        index:true,
        element:
        <PrivateRoutes>
          <DashboardHome/>
        </PrivateRoutes>,
        
      },
      
      {
        path:'profile',
        element: 
        <PrivateRoutes>
              <Profile/>
        </PrivateRoutes>,
      },
      {
        path:'create-donation-request',
        element: 
        <PrivateRoutes>
              <CreateDonation/>,
        </PrivateRoutes>,
       

      }
      ,
      {
        path:'my-donation-requests',
        element: 
        <PrivateRoutes>
              <MyDonationRequests/>
        </PrivateRoutes>,
      },
      {
        path:"donation-request/:id",
        element:
        <PrivateRoutes>
             <DonationDetails/>
        </PrivateRoutes>, 
     
      }
      ,{
        path:"donation-edit/:id",
        element: 
        <PrivateRoutes>
              <DonationEdit/>
        </PrivateRoutes>, 
      
      }
      ,
      {
        path:'all-users',
        element:<PrivateRoutes><AdminRoutes><AllUsers/></AdminRoutes></PrivateRoutes>,
        //element: <AllUsers/>
        
      }
      ,
      {
        path:'all-donations',
        element: 
        <PrivateRoutes>
          <AdminRoutes>
                <AllBloodRequest/>
          </AdminRoutes>
        </PrivateRoutes>, 
        
      }
      ,
      {
        path:'all-donations-volunteer',
        element: 
        <PrivateRoutes>
          <VolunteerRoutes>
              <AllBloodVolunteer/>
          </VolunteerRoutes>
        </PrivateRoutes>, 
      
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
