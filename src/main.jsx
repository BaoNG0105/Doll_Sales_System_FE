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
import About from './home/templates/About.jsx';
import Contact from './home/templates/Contact.jsx';
import Menu from './home/templates/Menu.jsx';
import DollType from './home/templates/DollType.jsx';
import DollModel from './home/templates/DollModel.jsx';
import Characters from './home/templates/Characters.jsx';
import Profile from './home/templates/Profile.jsx';
import DollDetail from './home/templates/DollDetail.jsx';
import CharacterDetail from './home/templates/CharacterDetail.jsx';


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
      // About page
      {
        path: "/about",
        element: <About />,
      },
      // Contact page
      {
        path: "/contact",
        element: <Contact />,
      },
      // Menu page
      {
        path: "/products",
        element: <Menu />,
      },
      // Trang chọn loại doll
      {
        path: "/doll-type",
        element: <DollType />,
      },
      {
        path: "/doll-type/:id",
        element: <DollModel />,
      },
      {
        path: "/doll-detail/:id",
        element: <DollDetail />,
      },
      // Characters library page
      {
        path: "/characters",
        element: <Characters />,
      },
      // Character Detail page
      {
        path: "/characters/:id",
        element: <CharacterDetail />,
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
