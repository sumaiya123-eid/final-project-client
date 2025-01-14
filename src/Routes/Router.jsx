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
            path:'/trainer/:id',
            element:<TrainerDetails></TrainerDetails>,
          },
        {
            path:'/become-trainer',
            element:<BeATrainer></BeATrainer>,
          },
        {
            path:"/trainer-booked/:id",
            element:<TrainerBookedPage></TrainerBookedPage>,
          },
        {
            path:"/payment/:id",
            element:<PaymentPage></PaymentPage>,
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
  ]);