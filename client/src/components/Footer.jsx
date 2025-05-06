import Facebook from '../assets/Facebook.png';
import Instagram from '../assets/Instagram.png';
import Twitter from '../assets/Twitter.png';
import Tiktok from '../assets/Tiktok.png';
import Youtube from '../assets/Youtube.png';
import PlayStore from '../assets/PlayStore.png';
import AppStore from '../assets/AppStore.png';

const Footer = () => {
  return (
    <footer className="bg-blue-50 py-3 mt-auto">
      <h2 className="text-center font-semibold text-base">Follow Us</h2>
      <div className="flex justify-center gap-x-3 mt-1">
        <img
          src={Facebook}
          alt="Facebook"
          className="w-7 h-7 cursor-pointer transition-transform duration-300 hover:scale-130"
        />
        <img
          src={Instagram}
          alt="Instagram"
          className="w-7 h-7 cursor-pointer transition-transform duration-300 hover:scale-130"
        />
        <img
          src={Twitter}
          alt="Twitter"
          className="w-7 h-7 cursor-pointer transition-transform duration-300 hover:scale-130"
        />
        <img
          src={Tiktok}
          alt="Tiktok"
          className="w-7 h-7 cursor-pointer transition-transform duration-300 hover:scale-130"
        />
        <img
          src={Youtube}
          alt="Youtube"
          className="w-7 h-7 cursor-pointer transition-transform duration-300 hover:scale-130"
        />
      </div>
      <div className="flex justify-center gap-x-2 mt-2">
        <img
          src={AppStore}
          alt="App Store"
          className="h-10 object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
        />
        <img
          src={PlayStore}
          alt="Play Store"
          className="h-7 object-contain cursor-pointer mt-1.5 transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="flex flex-col justify-between items-center mt-3">
        {/* Swift Mart at the Top */}
        <p className="text-center mb-2 text-sm">© 2025 Swift Mart</p>

        {/* Links at the Bottom */}
        <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-4 text-center text-xs">
          <div className="relative group cursor-pointer">
            <p className="cursor-pointer">Terms and Conditions</p>
            <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
          <div className="relative group cursor-pointer">
            <p className="cursor-pointer">Privacy Policy</p>
            <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
          <div className="relative group cursor-pointer">
            <p className="cursor-pointer">Shipping & Delivery</p>
            <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
          <div className="relative group cursor-pointer">
            <p className="cursor-pointer">Help Center</p>
            <span className="absolute left-0 bottom-[-2px] w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
