import { Link } from 'react-router-dom';
import LandingPagePhoto from '../assets/LandingPagePhoto.jpg';
import Header from '../components/Header';

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className="bg-white min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-center items-center px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl space-y-15 lg:space-y-0 lg:gap-x-20 mt-25 lg-mt-0">
            {/* Left Section */}
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                SWIFT <span className="text-blue-600">MART</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-xl">
                Discover the ultimate online shopping experience where style
                meets convenience. Explore a wide range of trendy products, from
                fashion to essentials, all at your fingertips. Shop now and
                enjoy seamless delivery, secure payments, and unbeatable deals!
              </p>
              <div className="flex justify-center lg:justify-start">
                <Link to="/products">
                  <button className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition cursor-pointer mt-6">
                    SHOP NOW
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={LandingPagePhoto}
                alt="Online Shopping Illustration"
                className="w-full h-auto max-w-sm lg:max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
