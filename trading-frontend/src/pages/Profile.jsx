import React, { useState, useEffect } from "react";
import axios from 'axios';



const Profile = () => {
  const [initialCapital, setInitialCapital] = useState('');
  const [capitalMessage, setCapitalMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [fullName, setFullName] = useState("");  
  const [email, setEmail] = useState("");
  const [isEditingName, setIsEditingName] = useState(false); // tracks if user is editing
  const [nameInput, setNameInput] = useState("");    // stores current input while editing
  const [nameError, setNameError] = useState("");    




const handleSetCapital = async () => {
  try {
    const tokenObject = JSON.parse(localStorage.getItem('token'));
    const token = tokenObject ? tokenObject.token : null;

    const response = await axios.put(
      "http://localhost:8080/api/profile/set-initial-capital",
      { capital: initialCapital }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
      }
    );

    setCapitalMessage("Initial capital set successfully.");
  } catch (error) {
    setCapitalMessage("Failed to set initial capital.");
    console.error(error);
  }
};


const handleChangePassword = async () => {
  if (newPassword !== confirmNewPassword) {
    setPasswordMessage("New passwords don't match.");
    return;
  }

  try {
    const tokenObject = JSON.parse(localStorage.getItem('token'));
    const token = tokenObject ? tokenObject.token : null;

    await axios.put(
      'http://localhost:8080/api/profile/change-password',
      {
        current_pass: currentPassword,
        new_pass: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setPasswordMessage('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  } catch (error) {
    setPasswordMessage('Failed to update password.');
  }
};

const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
    return;
  }

  try {
    const tokenObject = JSON.parse(localStorage.getItem('token'));
    const token = tokenObject ? tokenObject.token : null;

    const response = await axios.delete("http://localhost:8080/api/profile/delete-account", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Account deleted successfully");
    localStorage.removeItem('token');
    window.location.href = "/"; // redirect to homepage or login
  } catch (error) {
    console.error("Failed to delete account", error);
    alert("Failed to delete account");
  }
};

useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const tokenObject = JSON.parse(localStorage.getItem('token'));
      const token = tokenObject ? tokenObject.token : null;

      const response = await axios.get("http://localhost:8080/api/profile/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFullName(response.data.full_name);  // Correct setter here
      setNameInput(response.data.full_name); 
      setEmail(response.data.email);          // Correct setter here
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  fetchUserProfile();
}, []);


const handleSaveName = async () => {
  if (!nameInput.trim()) {
    setNameError("Name cannot be empty");
    return;
  }

  try {
    setNameError("");
    const tokenObject = JSON.parse(localStorage.getItem('token'));
    const token = tokenObject ? tokenObject.token : null;

    await axios.put(
      "http://localhost:8080/api/profile/change-name",
      { full_name: nameInput }, // assuming backend expects { full_name: "new name" }
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setFullName(nameInput);      // update fullName on success
    setIsEditingName(false);     // exit edit mode
  } catch (error) {
    setNameError("Failed to update name. Please try again.");
    console.error(error);
  }
};


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
    value={isEditingName ? nameInput : fullName}      // show editable input or fullName
    onChange={(e) => setNameInput(e.target.value)}    // update input state on typing
    className="col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 capitalize"
    readOnly={!isEditingName}                          // readonly when not editing
  />

  {!isEditingName ? (
    <button
      className="md:col-start-3 text-indigo-600 hover:text-indigo-800 font-medium"
      onClick={() => setIsEditingName(true)}           // switch to edit mode on click
    >
      Change Name
    </button>
  ) : (
    <div className="md:col-start-3 space-x-2">
      <button
        className="text-indigo-300 hover:text-indigo-600 font-medium"
        onClick={handleSaveName}                       // save handler, defined next
      >
        Save
      </button>
      <button
        className="text-red-600 hover:text-red-800 font-medium"
        onClick={() => {
          setIsEditingName(false);                      // cancel editing
          setNameInput(fullName);                        // revert input to original name
          setNameError("");                              // clear error
        }}
      >
        Cancel
      </button>
    </div>
  )}

  {nameError && (
    <p className="text-red-600 col-span-full">{nameError}</p>   // show error if any
  )}
</div>


          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <label className="text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              value={email}
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
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleSetCapital}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
                Set Initial Capital
              </button>

            </div>
          </div>
          
          {capitalMessage && (
            <p className="text-sm text-green-600 mt-2">{capitalMessage}</p>)}

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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">New Password</label>
           <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
           <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Update Password
          </button>
          {passwordMessage && (
            <p className="mt-2 text-sm text-green-600">{passwordMessage}</p>
          )}

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
        onClick={handleDeleteAccount}
        className="text-red-600 hover:text-red-800 font-medium underline hover:no-underline"
      >
        Delete My Account
      </a>

      </div>
    </div>
  );
};

export default Profile;