import React, { useState } from 'react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-button" onClick={toggleDropdown}>
        Profile
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <a href="#">Settings</a>
          <a href="#">Log Out</a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;