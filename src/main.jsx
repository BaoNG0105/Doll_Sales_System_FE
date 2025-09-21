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
import Dolls from './home/templates/Dolls.jsx';
import Characters from './home/templates/Characters.jsx';
import Profile from './home/templates/Profile.jsx';
import Adminlayouts from './dashboard/layouts/adminLayouts.jsx';
import DollsManager from './dashboard/templates/dollsManager.jsx';
import FeedbackManager from './dashboard/templates/feedbackManager.jsx';
import OrdersManager from './dashboard/templates/orderManager.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home page
      {
        path: "/",
        element: <Home />,
      },
      // Menu page
      // {
      //   path: "/products",
      //   element: <Menu />,
      // },
      // Dolls library page
      {
        path: "/dolls",
        element: <Dolls />,
      },
      // Emotion library page
      {
        path: "/characters",
        element: <Characters />,
      },
      // Profile page
      {
        path: "/profile",
        element: <Profile />,
      },
      // 404 Not Found page
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
      { path: "feedback", element: <FeedbackManager /> },
      { path: "orders", element: <OrdersManager /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
