import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmPassword } =
      registerFormData;

    // Check if passwords match
    if (password !== registerFormData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.post('/.netlify/functions/registerUser', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        setRegisterFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        }); // Reset form fields
        toast.success('Registration successful');
        navigate('/login');
      }
      console.log('Registration successful:', data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Registration failed');
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
    if (registerFormData.password.length >= 6) score++;
    if (/[A-Z]/.test(registerFormData.password)) score++;
    if (/\d/.test(registerFormData.password)) score++;
    if (
      registerFormData.password &&
      registerFormData.confirmPassword &&
      registerFormData.password === registerFormData.confirmPassword
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
            Create Your Account
          </h1>
          <p className="text-sm text-gray-600 text-center mt-1">
            Fill in the details below to register.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700">
              First Name
              <input
                type="text"
                name="firstName"
                value={registerFormData.firstName}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                placeholder="John"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Last Name
              <input
                type="text"
                name="lastName"
                value={registerFormData.lastName}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                placeholder="Doe"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                name="email"
                value={registerFormData.email}
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
                  value={registerFormData.password}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Enter your password"
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
              Confirm Password
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={registerFormData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Confirm your password"
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
                    registerFormData.password.length >= 6
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Minimum 6 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(registerFormData.password)
                      ? 'text-green-600'
                      : ''
                  }
                >
                  • Must contain at least one uppercase letter
                </li>
                <li
                  className={
                    /\d/.test(registerFormData.password) ? 'text-green-600' : ''
                  }
                >
                  • Must contain at least one number
                </li>
                <li
                  className={
                    registerFormData.password &&
                    registerFormData.confirmPassword &&
                    registerFormData.password ===
                      registerFormData.confirmPassword
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
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
