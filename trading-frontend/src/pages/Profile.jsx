import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account information and security</p>
      </div>

      {/* Account Information Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Information</h2>
        
        <div className="space-y-4">
          {/* Full Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              value="John Doe"
              className="col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize"
              readOnly
            />
            <button className="md:col-start-3 text-indigo-600 hover:text-indigo-800 font-medium">
              Change Name
            </button>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              value="john.doe@example.com"
              className="col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              readOnly
            />
            <button className="md:col-start-3 text-indigo-600 hover:text-indigo-800 font-medium">
              Change Email
            </button>
          </div>
        </div>
      </div>

      {/* Initial Capital Section - NEW SECTION ADDED HERE */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Trading Capital</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">Initial Capital</label>
            <div className="col-span-2 flex gap-4">
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Set Initial Capital
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Current capital: $25,000.00
          </p>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
        
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-red-100">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Deleting your account will remove all your data permanently. This action cannot be undone.
        </p>
        <a
          href="#"
          className="text-red-600 hover:text-red-800 font-medium underline hover:no-underline"
        >
          Delete My Account
        </a>
      </div>
    </div>
  );
};

export default Profile;