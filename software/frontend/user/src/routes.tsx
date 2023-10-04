import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup'

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Signup />} path="/signup" />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;