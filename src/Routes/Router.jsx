import {
    createBrowserRouter,
  } from "react-router-dom";
import Root from "../Layout/Root";
import Login from "../Login";
import Register from "../Register";

 export const router = createBrowserRouter([
    {
      path: "/",
      element: <Root></Root>,
      children:[
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