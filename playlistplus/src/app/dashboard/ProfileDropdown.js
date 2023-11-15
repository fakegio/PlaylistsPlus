import React, { useState } from 'react';
import {removeCredentials} from '@/API/authorize';

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
          <a href="#" onClick={removeCredentials}>Log Out</a>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;