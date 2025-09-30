import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Home
import Login from './home/templates/Login.jsx';
import Register from './home/templates/Register.jsx';
import AuthLayout from './home/layout/AuthLayout.jsx';
import MainLayout from './home/layout/MainLayout.jsx';
import Error from './home/templates/Error.jsx';
import Home from './home/templates/Home.jsx';
import Menu from './home/templates/Menu.jsx';
import Dolls from './home/templates/Dolls.jsx';
import Labubu from './home/templates/Labubu.jsx';
import Babythree from './home/templates/Babythree.jsx';
import Characters from './home/templates/Characters.jsx';
import Profile from './home/templates/Profile.jsx';
import DollDetail from './home/templates/DollDetail.jsx';

// Admin
import Adminlayouts from './dashboard/layouts/adminLayouts.jsx';
import DollsManager from './dashboard/templates/dollsManager.jsx';
import FeedbackManager from './dashboard/templates/feedbackManager.jsx';
import OrdersManager from './dashboard/templates/orderManager.jsx';
import UserManager from './dashboard/templates/userManager.jsx';
import RevenueTracking from './dashboard/templates/revenueTracking.jsx';
import WarrantyPolicy from './dashboard/templates/warrantyPolicy.jsx';

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
      {
        path: "/products",
        element: <Menu />,
      },
      // Trang chọn loại doll
      {
        path: "/dolls",
        element: <Dolls />,
      },
      // Trang chi tiết từng loại doll
      {
        path: "/dolls/labubu",
        element: <Labubu />,
      },
      {
        path: "/dolls/babythree",
        element: <Babythree />,
      },
      // Characters library page
      {
        path: "/characters",
        element: <Characters />,
      },
      // Product Detail page
      {
        path: "/dolls/:id",
        element: <DollDetail />,
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
