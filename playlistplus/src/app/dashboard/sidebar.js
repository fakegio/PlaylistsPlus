import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList, faCog, faShare, faQuestion } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <div className="sidebar">
      <button className="sidebar-button"><FontAwesomeIcon icon={faHome} /> Home</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faUser} /> Profile</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faList} /> Playlist</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faCog} /> Settings</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faShare} /> Share</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faQuestion} /> Help</button>
    </div>
  );
}

export default Sidebar;