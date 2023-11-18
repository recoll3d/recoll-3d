import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<SignUp />} path="/signup" />
          <Route element={<SignIn />} path="/signin" />
          <Route element={<Dashboard />} path="/dashboard" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default MyRoutes;
