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
import Profile from './home/templates/Profile.jsx';

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
      // Dolls library page
      {
        path: "/dolls",
        element: <Dolls />,
      },
      // Emotion library page
      {
        path: "/emotion",
        element: <Emotion />,
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

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
