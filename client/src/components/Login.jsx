import { useState, useContext } from 'react';
import { Context } from '../Context';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { fetchUser, fetchCart, cartSummary } = useContext(Context);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = loginFormData;
    try {
      const { data } = await axios.post(
        '/.netlify/functions/loginUser',
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (data.error) {
        toast.error(data.error);
      } else {
        await fetchUser();
        await fetchCart();
        setLoginFormData({
          email: '',
          password: '',
        });
        toast.success('Logged in successfully!');

        setTimeout(() => navigate('/account'), 200);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(cartSummary);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 flex justify-center items-center min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Login to Your Account
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Enter your credentials to access your account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                name="email"
                value={loginFormData.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                placeholder="john@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Password
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginFormData.password}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500 pr-10" // Add padding-right for the button
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-500 hover:underline focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 text-white py-2 rounded-lg transition ${
                loading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-2">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
