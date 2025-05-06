import { Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { ContextProvider } from './Context';

import ProductDetailsPerItem from './pages/ProductDetailsPerItem';
import ContactUsPage from './pages/ContactUsPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import AccountPage from './pages/AccountPage';
import ChangePassword from './components/ChangePassword';

// axios.defaults.baseURL = 'http://localhost:4000/'; // Not needed for netlify
axios.defaults.withCredentials = true;

function App() {
  return (
    <ContextProvider>
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />{' '}
        <Route path="/products" element={<ProductPage />} />{' '}
        <Route path="/products/:id" element={<ProductDetailsPerItem />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
