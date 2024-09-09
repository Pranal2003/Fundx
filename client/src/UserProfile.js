import React from 'react';

function UserProfile() {
  // You can access user information from your authentication state or context here
  const user = getUser(); // Replace with your actual user retrieval logic

  return (
    <div className="user-profile">
      <img src={user.profilePicture} alt="User Profile" />
      <span>{user.name}</span>
      <a href="/account-settings">Account Settings</a>
    </div>
  );
}

export default UserProfile;
