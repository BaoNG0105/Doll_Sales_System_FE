import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

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
import FAQ from './home/templates/FAQ.jsx';
import Menu from './home/templates/Menu.jsx';
import DollType from './home/templates/DollType.jsx';
import DollModel from './home/templates/DollModel.jsx';
import Characters from './home/templates/Characters.jsx';
import Profile from './home/templates/Profile.jsx';
import DollDetail from './home/templates/DollDetail.jsx';
import CharacterDetail from './home/templates/CharacterDetail.jsx';
import ScrollToTopButton from './home/components/ScrollToTopButton.jsx';


// Admin
import Adminlayouts from './dashboard/layouts/adminLayouts.jsx';
import ManageCharacters from './dashboard/templates/ManageCharacters.jsx';
import ManageDolls from './dashboard/templates/ManageDolls.jsx';
import ManageOrders from './dashboard/templates/ManageOrders.jsx';
import ManageCharacterOrders from './dashboard/templates/ManageCharacterOrders.jsx';
import ManageUsers from './dashboard/templates/ManageUsers.jsx';

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
      // FAQ page
      { path: "/faq", element: <FAQ />, },
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
      { path: "manage-dolls", element: <ManageDolls /> },
      { path: "manage-characters", element: <ManageCharacters /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-orders", element: <ManageOrders /> }, 
      { path: "manage-character-orders", element: <ManageCharacterOrders /> },
    ],
  }


])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      <RouterProvider router={router} />
      <ScrollToTopButton />
    </Provider>
  </StrictMode>,
)
