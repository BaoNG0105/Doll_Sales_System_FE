import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
// import App from './App.jsx'
import Login from './home/templates/login.jsx';
import Register from './home/templates/register.jsx';
import AuthLayout from './home/layout/AuthLayout.jsx';
import Header from './home/components/Header.jsx';
// import MainLayout from './home/layout/MainLayout.jsx';

const router = createBrowserRouter([
  //Home page (Default)
  // {
  //   path: "/",
  //   element: <MainLayout />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <Home />,
  //     },
  //   ],
  // },

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

  {
    path: "header",
    element: (
      <Header />
    ),
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>,
)
