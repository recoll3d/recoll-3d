import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChakraProvider disableGlobalStyle>
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<SignUp />} path="/signup" />
            <Route element={<SignIn />} path="/signin" />
            <Route element={<Dashboard />} path="/dashboard" />
          </Routes>
        </ChakraProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default MyRoutes;
