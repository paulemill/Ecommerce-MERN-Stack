import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

import AccountPageAccountInfo from './AccountPageAccountInfo';
import AccountPageAddress from './AccountPageAddress';
import AccountPageOrders from './AccountPageOrders';

function AccountPage() {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account-info');

  const navigate = useNavigate();

  useEffect(() => {
    if (user === null && !loading) {
      navigate('/login');
    } else if (user) {
      setLoading(false);
    }
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'account-info':
        return <AccountPageAccountInfo />;
      case 'manage-addresses':
        return <AccountPageAddress />;
      case 'order-history':
        return <AccountPageOrders />;
      default:
        return <AccountPageAccountInfo />;
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-8 mt-10">
          {/* Sidebar */}
          <aside className="col-span-1">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </h2>
              <p className="text-sm text-gray-500">My Account</p>
            </div>

            <nav className="flex flex-col gap-4">
              {[
                { key: 'account-info', label: 'Account Information' },
                { key: 'manage-addresses', label: 'Manage Addresses' },
                { key: 'order-history', label: 'Order History' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`text-sm font-medium text-center px-4 py-2 rounded-md transition-colors cursor-pointer ${
                    activeTab === key
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-3  p-6 rounded-lg shadow-md">
            <div className="w-full">{renderContent()}</div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AccountPage;
