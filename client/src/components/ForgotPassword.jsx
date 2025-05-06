import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from './Footer';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState({
    email: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordFormData({
      ...forgotPasswordFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, newPassword, confirmNewPassword } = forgotPasswordFormData;
    try {
      const { data } = await axios.post('/.netlify/functions/forgotPassword', {
        email,
        newPassword,
        confirmNewPassword,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setForgotPasswordFormData({
          email: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        toast.success('Password reset successfully!');
        navigate('/login');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const getPasswordStrength = () => {
    let score = 0;
    if (forgotPasswordFormData.newPassword.length >= 6) score++;
    if (/[A-Z]/.test(forgotPasswordFormData.newPassword)) score++;
    if (/\d/.test(forgotPasswordFormData.newPassword)) score++;
    if (
      forgotPasswordFormData.newPassword &&
      forgotPasswordFormData.confirmNewPassword &&
      forgotPasswordFormData.newPassword ===
        forgotPasswordFormData.confirmNewPassword
    )
      score++;
    return score;
  };

  const strengthColors = [
    'bg-red-500',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-500',
  ];

  return (
    <>
      <Header />
      <div className="bg-gray-100 flex justify-center items-center min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Reset Your Password
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Enter your email and new password to reset your account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
              <input
                type="email"
                name="email"
                value={forgotPasswordFormData.email}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                placeholder="john@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              New Password
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={forgotPasswordFormData.newPassword}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmNewPassword"
                  value={forgotPasswordFormData.confirmNewPassword}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {/* Password strength and validation */}
            <div>
              <p className="font-medium text-sm text-gray-700 mb-1">
                Password Strength
              </p>
              <div className="flex space-x-1 h-2 mb-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded ${
                      getPasswordStrength() > i
                        ? strengthColors[i]
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <ul className="text-xs text-gray-400 space-y-1">
                <li
                  className={
                    forgotPasswordFormData.newPassword.length >= 6
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Minimum 6 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(forgotPasswordFormData.newPassword)
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Must contain at least one uppercase letter
                </li>
                <li
                  className={
                    /\d/.test(forgotPasswordFormData.newPassword)
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Must contain at least one number
                </li>
                <li
                  className={
                    forgotPasswordFormData.newPassword &&
                    forgotPasswordFormData.confirmNewPassword &&
                    forgotPasswordFormData.newPassword ===
                      forgotPasswordFormData.confirmNewPassword
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Provided passwords must match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Reset Password
            </button>

            <p className="text-center text-sm text-gray-600">
              <Link to="/login" className="text-blue-500 hover:underline">
                Return to Login Page
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
