import React, { useState, useContext } from 'react';
import CartIcon from './CartIcon';
import AccountIcon from './AccountIcon';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../Context';

const Header = () => {
  // Used to hide the icons on the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/account');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-50 shadow-md z-50 h-20">
      <div className="container mx-auto px-3 flex items-center justify-between">
        {/* Hamburger Menu Icon - Visible on lg and smaller */}
        <button
          className="lg:hidden text-gray-700 text-3xl focus:outline-none ml-6"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Navigation Links - Collapsible */}
        <nav
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } lg:flex lg:justify-evenly text-center space-x-6 absolute lg:static top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none p-3 lg:p-0`}
        >
          <Link to={'/'}>
            <button className="text-gray-700 text-base font-semibold hover:text-blue-600 transition duration-300 relative group cursor-pointer">
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
          <Link to={'/products'}>
            <button className="text-gray-700 text-base font-semibold hover:text-blue-600 transition duration-300 relative group  cursor-pointer">
              Product List
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
          <Link to={'/contact-us'}>
            <button className="text-gray-700 text-base font-semibold hover:text-blue-600 transition duration-300 relative group cursor-pointer">
              Contact Us
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </Link>
          <button
            onClick={handleAccountClick}
            className="text-gray-700 text-base font-semibold hover:text-blue-600 transition duration-300 relative group cursor-pointer"
          >
            Account
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Website Name - Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-900">
          SWIFT <span className="text-blue-600">MART</span>
        </div>

        {/* Cart Icon - Right */}
        <div className="relative flex items-center space-x-4">
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
