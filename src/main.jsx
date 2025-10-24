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
import Privacy from './home/templates/Privacy.jsx';
import Terms from './home/templates/Terms.jsx';
import Menu from './home/templates/Menu.jsx';
import DollType from './home/templates/DollType.jsx';
import DollModel from './home/templates/DollModel.jsx';
import Characters from './home/templates/Characters.jsx';
import Profile from './home/templates/Profile.jsx';
import DollDetail from './home/templates/DollDetail.jsx';
import CharacterDetail from './home/templates/CharacterDetail.jsx';
import Chatbot from './home/components/Chatbot.jsx'; 
import ScrollToTopButton from './home/components/ScrollToTopButton.jsx';


// Admin
import Adminlayouts from './dashboard/layouts/adminLayouts.jsx';
import CharacterManager from './dashboard/templates/characterManager.jsx';
import DollsManager from './dashboard/templates/dollsManager.jsx';
import FeedbackManager from './dashboard/templates/feedbackManager.jsx';
import OrdersManager from './dashboard/templates/orderManager.jsx';
import UserManager from './dashboard/templates/userManager.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Home page
      { path: "/", element: <Home />, },
      // About page
      { path: "/about", element: <About />, },
      // Contact page
      { path: "/contact", element: <Contact />, },
      // Privacy Policy page
      { path: "/privacy-policy", element: <Privacy />, },
      // Terms of Service page
      { path: "/terms-of-service", element: <Terms />, },
      // Menu page
      { path: "/products", element: <Menu />, },
      // Doll Type page
      { path: "/doll-type", element: <DollType />, },
      // Doll Model page
      {path: "/doll-type/:id", element: <DollModel />, },
      // Doll Detail page
      { path: "/doll-detail/:id", element: <DollDetail />, },
      // Characters page
      {path: "/characters", element: <Characters />, },
      // Character Detail page
      { path: "/characters/:id", element: <CharacterDetail />, },
      // Profile page
      { path: "/profile", element: <Profile />, },
      // 404 Not Found page
      { path: "*", element: <Error />, },
    ],
  },

  //Login page
  {
    element: <AuthLayout />,
    children: [
      {path: "/login", element: <Login />, },
    ],
  },

  //Register Page
  {
    element: <AuthLayout />,
    children: [
      {path: "/register", element: <Register />, },
    ],
  },

  //Admin Page

  {
    path: "/dashboard",
    element: <Adminlayouts />,
    children: [

      { path: "dollsManager", element: <DollsManager /> },
      { path: "character-manager", element: <CharacterManager /> },
      { path: "users", element: <UserManager /> },
      { path: "feedback", element: <FeedbackManager /> },
      { path: "orders", element: <OrdersManager /> },   
    ],
  }


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
    <Chatbot />
    <ScrollToTopButton />
  </StrictMode>,
)
