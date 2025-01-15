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
import BookedTrainer from "../Dashboard/BookedTrainer";
import MyProfile from "../Dashboard/MyProfile";


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
        {
          path:"/dashboard/appliedTrainers",
          element:<AppliedTrainers></AppliedTrainers>
        },
        {
          path:"/dashboard/appliedTrainerDetail/:email",
          element:<AppliedTrainerDetails></AppliedTrainerDetails>
        },
        {
          path:"/dashboard/addClass",
          element:<AddClassPage></AddClassPage>
        },
        {
          path:"/dashboard/addForum",
          element:<AddForum></AddForum>
        },
        {
          path:"/dashboard/bookedTrainer",
          element:<BookedTrainer></BookedTrainer>
        },
        {
          path:"/dashboard/myProfile",
          element:<MyProfile></MyProfile>
        },
      ]
    }
  ]);