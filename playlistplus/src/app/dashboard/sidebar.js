import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faList, faCog, faShare, faQuestion } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";
import 'reactjs-popup/dist/index.css';
import './sidebar.css';

const iconStyle = {
  marginLeft: '10px',
  marginRight: '10px'
}

function Sidebar() {
  return (
    <div className="sidebar">
      <button className="sidebar-button"><FontAwesomeIcon icon={faHome} /> Home</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faUser} /> Profile</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faList} /> Playlist</button>
      <button className="sidebar-button"><FontAwesomeIcon icon={faCog} /> Settings</button>
      <Popup className="share" trigger={<button className="sidebar-button"><FontAwesomeIcon icon={faShare} /> Share</button>}
        position="left center">
          <div className="icons">
            <FacebookShareButton
              url={'https://www.PlaylistsPlus.com'}
              quote={'I loving using PlaylistsPlus!'}
              hashtag={"#Spotify"}
            >
              <FacebookIcon size={32} round style={iconStyle} />
            </FacebookShareButton>

            <TwitterShareButton
              url={'https://www.PlaylistsPlus.com'}
              title={"Twitter"}
              quote={'I loving using PlaylistsPlus!'}
              hashtags={["Spotify", "PlaylistsPlus"]}
            >
              <TwitterIcon size={32} round style={iconStyle} />
            </TwitterShareButton>

            <LinkedinShareButton
              url={'https://www.PlaylistsPlus.com'}
              title={"Linkedin"}
              summary={'I loving using PlaylistsPlus!'}
              source={"PlaylistsPlus"}
            >
              <LinkedinIcon size={32} round style={iconStyle} />
            </LinkedinShareButton>
          </div>
      </Popup>
      <button className="sidebar-button"><FontAwesomeIcon icon={faQuestion} /> Help</button>
    </div>
  );
}

export default Sidebar;