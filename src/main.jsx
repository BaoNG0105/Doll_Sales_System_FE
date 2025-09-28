import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import App from './App.jsx'
import Login from './home/templates/login.jsx';
import Register from './home/templates/register.jsx';
import AuthLayout from './home/layout/AuthLayout.jsx';
import MainLayout from './home/layout/MainLayout.jsx';
import Error from './home/templates/Error.jsx';
import Home from './home/templates/Home.jsx';
import Menu from './home/templates/Menu.jsx';
import Dolls from './home/templates/Dolls.jsx';
import Emotion from './home/templates/Emotion.jsx';
import Adminlayouts from './dashboard/layouts/adminLayouts.jsx';
import DollsManager from './dashboard/templates/dollsManager.jsx';
import FeedbackManager from './dashboard/templates/feedbackManager.jsx';
import OrdersManager from './dashboard/templates/orderManager.jsx';
import UserManager from './dashboard/templates/userManager.jsx';
import RevenueTracking from './dashboard/templates/revenueTracking.jsx';
import WarrantyPolicy from './dashboard/templates/warrantyPolicy.jsx';  

const router = createBrowserRouter([
  //Home page (Default)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Menu />,
      },
      {
        path: "/dolls",
        element: <Dolls />,
      },
      {
        path: "/emotion",
        element: <Emotion />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },

  //Login page
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },

  //Register Page
  {
    path: "/register",
    element: <AuthLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  //Admin Page

{
  path: "/dashboard",
  element: <Adminlayouts />,
  children: [
    { path: "dollsManager", element: <DollsManager /> },
    { path: "users", element: <UserManager /> },
    { path: "feedback", element: <FeedbackManager /> },
    { path: "orders", element: <OrdersManager /> },
    { path: "revenue", element: <RevenueTracking /> },       // 👈 mới
    { path: "warranty", element: <WarrantyPolicy /> },       // 👈 mới
  ],
}


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
