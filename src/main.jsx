import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// ================= HOME =================
import Login from "./home/templates/Login.jsx";
import Register from "./home/templates/Register.jsx";
import AuthLayout from "./home/layout/AuthLayout.jsx";
import MainLayout from "./home/layout/MainLayout.jsx";
import Error from "./home/templates/Error.jsx";
import Home from "./home/templates/Home.jsx";
import About from "./home/templates/About.jsx";
import Contact from "./home/templates/Contact.jsx";
import Privacy from "./home/templates/Privacy.jsx";
import Terms from "./home/templates/Terms.jsx";
import FAQ from "./home/templates/FAQ.jsx";
import Menu from "./home/templates/Menu.jsx";
import DollType from "./home/templates/DollType.jsx";
import DollModel from "./home/templates/DollModel.jsx";
import Characters from "./home/templates/Characters.jsx";
import Profile from "./home/templates/Profile.jsx";
import DollDetail from "./home/templates/DollDetail.jsx";
import CharacterDetail from "./home/templates/CharacterDetail.jsx";
import ScrollToTopButton from "./home/components/ScrollToTopButton.jsx";

// ================= ADMIN =================
import Adminlayouts from "./dashboard/layouts/adminLayouts.jsx";
import ManageCharacters from "./dashboard/templates/ManageCharacters.jsx";
import ManageOrders from "./dashboard/templates/ManageOrders.jsx";
import ManageCharacterOrders from "./dashboard/templates/ManageCharacterOrders.jsx";
import ManageUsers from "./dashboard/templates/ManageUsers.jsx";
import ManageDollModels from "./dashboard/templates/ManageDollModels.jsx";
import ManageDollTypes from "./dashboard/templates/ManageDollTypes.jsx";
import ManageDollVariants from "./dashboard/templates/ManageDollVariants.jsx";

// ================= ROUTER CONFIG =================
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy-policy", element: <Privacy /> },
      { path: "terms-of-service", element: <Terms /> },
      { path: "faq", element: <FAQ /> },
      { path: "products", element: <Menu /> },
      { path: "doll-type", element: <DollType /> },
      { path: "doll-type/:id", element: <DollModel /> },
      { path: "doll-detail/:id", element: <DollDetail /> },
      { path: "characters", element: <Characters /> },
      { path: "characters/:id", element: <CharacterDetail /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <Error /> },
    ],
  },

  // ---------- Auth Routes ----------
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // ---------- Admin Routes ----------
  {
    path: "/dashboard",
    element: <Adminlayouts />,
    children: [
      { path: "manage-characters", element: <ManageCharacters /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-orders", element: <ManageOrders /> },
      { path: "manage-character-orders", element: <ManageCharacterOrders /> },
      { path: "manage-doll-models", element: <ManageDollModels /> },
      { path: "manage-doll-types", element: <ManageDollTypes /> },
      { path: "manage-doll-variants", element: <ManageDollVariants /> },
    ],
  },
]);

// ================= APP RENDER =================
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ScrollToTopButton />
  </StrictMode>
);
