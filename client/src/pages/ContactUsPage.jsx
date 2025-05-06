import { useState } from 'react';
import Header from '../components/Header';
import Facebook from '../assets/Facebook.png';
import Instagram from '../assets/Instagram.png';
import Twitter from '../assets/Twitter.png';
import Tiktok from '../assets/Tiktok.png';
import Youtube from '../assets/Youtube.png';

const ContactUsPage = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      'Our representative will be in touch with you shortly to address your needs or questions. We appreciate your patience and will ensure a prompt response.'
    );

    // Clear the form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      concern: '',
    });
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 flex justify-center items-center min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className=" p-6 rounded-lg shadow-md">
            <h1 className="text-xl font-bold text-gray-800">Request a call.</h1>
            <p className="text-sm text-gray-600 mt-1">
              Give us some info so that the right person can get back to you.
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-xs font-medium text-gray-700">
                Full Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="John Doe"
                  required
                />
              </label>

              <label className="block text-xs font-medium text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="john@example.com"
                  required
                />
              </label>

              <label className="block text-xs font-medium text-gray-700">
                Phone
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="(123) 456-7890"
                  required
                />
              </label>

              <label className="block text-xs font-medium text-gray-700">
                Concern
                <textarea
                  name="concern"
                  value={formData.concern}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border rounded-lg focus:outline-blue-500"
                  placeholder="Summary of Concern"
                  rows="3"
                  required
                />
              </label>

              <div className="text-xs text-gray-600 mt-2">
                <p>
                  We value your privacy. The information you provide will only
                  be used to respond to your inquiry and will not be shared with
                  third parties. By submitting this form, you agree to our{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm"
              >
                Contact Me
              </button>
            </form>
          </div>

          <div className="space-y-7">
            {/* Give Us A Call */}
            <div className=" p-4 rounded-lg shadow-sm">
              <h2 className="text-base font-semibold text-gray-700">
                Give us a call.
              </h2>
              <p className="text-sm text-gray-600 mt-1">1-234-567-8900</p>
            </div>

            <div className=" p-4 rounded-lg shadow-sm">
              <h2 className="text-base font-semibold text-gray-700">
                Chat with us.
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Get product info, payment help, and live chat with an agent.
              </p>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm">
                Let&apos;s Chat
              </button>
            </div>

            <div className=" p-4 rounded-lg shadow-sm">
              <h2 className="text-base font-semibold text-gray-700">
                Leave us some feedback
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Good or bad, we love to hear it all.
              </p>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm">
                Send Feedback
              </button>
            </div>

            <div className=" p-4 rounded-lg shadow-sm">
              <h2 className="text-base font-semibold text-gray-700">
                Follow Us
              </h2>
              <div className="flex gap-x-4 mt-3">
                <img
                  src={Facebook}
                  alt="Facebook"
                  className="w-10 h-10 cursor-pointer"
                />
                <img
                  src={Instagram}
                  alt="Instagram"
                  className="w-10 h-10 cursor-pointer"
                />
                <img
                  src={Twitter}
                  alt="Twitter"
                  className="w-10 h-10 cursor-pointer"
                />
                <img
                  src={Tiktok}
                  alt="Tiktok"
                  className="w-10 h-10 cursor-pointer"
                />
                <img
                  src={Youtube}
                  alt="Youtube"
                  className="w-10 h-10 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUsPage;
