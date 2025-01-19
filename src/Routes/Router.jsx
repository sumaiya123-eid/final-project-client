import {
    createBrowserRouter,
  } from "react-router-dom";
import Root from "../Layout/Root";
import Login from "../Login";
import Register from "../Register";
import Home from "../Pages/Home";
import AllTrainers from "../Pages/AllTrainers";
import TrainerDetails from "../Pages/TrainerDetails";
import BeATrainer from "../Pages/BeATrainer";
import TrainerBookedPage from "../Pages/TrainerBookedPage";
import PaymentPage from "../Pages/PaymentPage";
import Dashboard from "../Dashboard/Dashboard";
import AppliedTrainers from "../Dashboard/AppliedTrainers";
import AppliedTrainerDetails from "../Dashboard/AppliedTrainerDetails";
import AddClassPage from "../Dashboard/AddClassPage";
import AllClassesPage from "../Pages/AllClassesPage";
import AddForum from "../Dashboard/AddForum";
import MyProfile from "../Dashboard/MyProfile";
import TrainersList from "../Dashboard/TrainersList";
import ManageSlots from "../Dashboard/ManageSlots";
import AddNewSlot from "../Dashboard/AddNewSlot";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import TrainerRoute from "./TrainerRoute";
import ActivityLog from "../Dashboard/ActivityLog";
import MyBookedTrainer from "../Dashboard/MyBookedTrainer";
import ForumPage from "../Pages/ForumPage";
import AdminOrTrainerRoute from "./AdminOrTrainerRoute";
import ForumDetails from "../Pages/ForumDetails";
import NewsletterSubscription from "../Pages/NewsletterSubscription";
import SubscribersList from "../Dashboard/SubscribersList";
import Balance from "../Dashboard/Balance";


 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Root></Root>,
      children:[
        {
            path:'/',
            element:<Home></Home>,
          },
        {
            path:'/allTrainers',
            element:<AllTrainers></AllTrainers>,
          },
        {
            path:'/users/:email',
            element:<TrainerDetails></TrainerDetails>,
          },
        {
            path:'/become-trainer',
            element:<BeATrainer></BeATrainer>,
          },
        {
            path:"/trainer-booked/:email",
            element:<TrainerBookedPage></TrainerBookedPage>,
          },
        {
            path:"/payment/:email",
            element:<PaymentPage></PaymentPage>,
          },
        {
            path:"/allClasses",
            element:<AllClassesPage></AllClassesPage>,
          },
        {
            path:"/allForum",
            element:<ForumPage></ForumPage>,
          },
        {
            path:"/forumDetails/:id",
            element:<ForumDetails></ForumDetails>,
          },
        {
            path:'/login',
            element:<Login></Login>,
          },
          {
            path:'/register',
            element:<Register></Register>,
          },
      ]
    },
    {
      path:'/dashboard',
      element:<Dashboard></Dashboard>,
      children:[
        
        // admin only routes
        {
          path:"/dashboard/subscribers",
          element:<PrivateRoute><AdminRoute><SubscribersList></SubscribersList></AdminRoute></PrivateRoute>
        },
        {
          path:"/dashboard/appliedTrainers",
          element:<PrivateRoute><AdminRoute><AppliedTrainers></AppliedTrainers></AdminRoute></PrivateRoute>
        },
        {
          path:"/dashboard/appliedTrainerDetail/:email",
          element:<PrivateRoute><AdminRoute><AppliedTrainerDetails></AppliedTrainerDetails></AdminRoute></PrivateRoute>
        },
        {
          path:"/dashboard/balance",
          element:<PrivateRoute><AdminRoute><Balance></Balance></AdminRoute></PrivateRoute>
        },
        {
          path:"/dashboard/addClass",
          element:<PrivateRoute><AdminRoute><AddClassPage></AddClassPage></AdminRoute></PrivateRoute>
        },
        {
          path:"/dashboard/trainerList",
          element:<PrivateRoute><AdminRoute><TrainersList></TrainersList></AdminRoute></PrivateRoute>
        },

          // trainer only route
          {
            path:"/dashboard/manageSlots",
            element:<PrivateRoute><TrainerRoute><ManageSlots></ManageSlots></TrainerRoute></PrivateRoute>
          },
          {
            path:"/dashboard/addSlot",
            element:<PrivateRoute><TrainerRoute><AddNewSlot></AddNewSlot></TrainerRoute></PrivateRoute>
          },
         
          // admin or trainer route
          {
            path:"/dashboard/addForum",
            element:<PrivateRoute><AdminOrTrainerRoute><AddForum></AddForum></AdminOrTrainerRoute></PrivateRoute>
          },

          // user only route
        {
          path:"/dashboard/myProfile",
          element:<MyProfile></MyProfile>
        },
        {
          path:"/dashboard/activityLog",
          element:<ActivityLog></ActivityLog>
        },
        {
          path:"/dashboard/myBookedTrainer",
          element:<MyBookedTrainer></MyBookedTrainer>
        },
      ]
    }
  ]);