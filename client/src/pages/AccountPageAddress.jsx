import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function AccountPageAddress() {
  const { user, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    isDefaultShippingAddress: false,
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && !loading) {
      navigate('/login');
    } else if (user) {
      setLoading(false);
    }
  }, [user, navigate, loading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveChanges = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.addressLine1 ||
      !formData.addressLine2 ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.country ||
      !formData.phoneNumber
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: '/.netlify/functions/addAddress',
        data: { address: formData },
        withCredentials: true,
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        setUser(updatedUser); // Update user state with the new address
        toast.success('Address added successfully');
        setIsAddingAddress(false); // Close the form after saving
        setFormData({
          // Reset form data
          firstName: '',
          lastName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phoneNumber: '',
          isDefaultShippingAddress: false,
        });
      } else {
        toast.error('Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await axios({
          method: 'DELETE',
          url: '/.netlify/functions/deleteAddress',
          data: { index },
          withCredentials: true,
        });

        if (response.status === 200) {
          const updatedUser = response.data;
          setUser(updatedUser);
          toast.success('Address deleted successfully');
        } else {
          toast.error('Failed to delete address');
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleMakeDefault = async (index) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: '/.netlify/functions/makeDefaultAddress',
        data: { index },
        withCredentials: true,
      });

      if (response.status === 200) {
        const updatedUser = response.data;
        setUser(updatedUser);
        toast.success('Address marked as default');
      } else {
        toast.error('Failed to make address default');
      }
    } catch (error) {
      console.error('Error making address default:', error);
      toast.error('Failed to make address default');
    }
  };

  console.log(user);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Manage Addresses
      </h2>

      {/* Add New Address Button */}
      <div className="flex justify-center">
        {!isAddingAddress && (
          <button
            onClick={() => setIsAddingAddress(true)}
            className="w-34 sm:w-36 text-sm bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Add New Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {isAddingAddress && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
          <div className="space-y-4">
            {/* Form Fields */}
            {[
              'firstName',
              'lastName',
              'addressLine1',
              'addressLine2',
              'city',
              'state',
              'zipCode',
              'country',
              'phoneNumber',
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            {/* Save Changes Button */}
            <div className="mt-4 text-center">
              <button
                onClick={handleSaveChanges}
                className="w-40 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Add Address
              </button>
            </div>

            {/* Close Form */}
            <div className="text-center">
              <button
                onClick={() => setIsAddingAddress(false)}
                className=" w-40 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="mt-6 space-y-4">
        {user.address && user.address.length > 0 ? (
          user.address.map((address, index) => (
            <div
              key={index}
              className={`border-2 p-4 rounded-lg ${
                address.isDefaultShippingAddress
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center gap-5">
                <div>
                  <div className="space-y-1 text-sm">
                    <h4 className="font-semibold text-base flex items-center gap-3">
                      {address.firstName} {address.lastName}
                      {address.isDefaultShippingAddress && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </h4>
                    <p>
                      {address.addressLine1}, {address.addressLine2}
                    </p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                    <p>{address.phoneNumber}</p>
                  </div>

                  <button
                    onClick={() => handleMakeDefault(index)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 mr-3 mt-3 text-sm"
                  >
                    Make Default
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(index)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses added yet.</p>
        )}
      </div>
    </div>
  );
}

export default AccountPageAddress;
