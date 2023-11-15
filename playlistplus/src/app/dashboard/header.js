import * as React from "react"; 
import ProfileDropdown from "./ProfileDropdown";
  
const Header = () => {
  return (
    <header className="header">
      <h1>Playlist+</h1>
      {/* You can add navigation links or other elements here */}
      <img src="/images/gotospotify.svg" alt="Go To Spotify" className="goToSpotify" width={200} height={10} 
        onClick={() => window.location.href = "https://open.spotify.com/"}
       />
      <ProfileDropdown />
    </header>
  );
};

export default Header;