"use client"
import { authorize, getToken, login, removeCredentials } from '@/API/authorize';
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from "./Header";
import Sidebar from './Sidebar'; 




export default function Home() {
  const [token, setToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [codeVerifier, setCodeVerifier] = useState('')
  const [backgroundColors, setBackgroundColors] = useState('');
  const [artist, setArtist] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const [selectedArtistPopularity, setSelectedArtistPopularity] = useState(null);
  const [selectedTrackPopularity, setSelectedTrackPopularity] = useState(null);
  const [timeRange, setTimeRange] = useState('short_term'); // Default time range is 'short_term'


 



  useEffect(() => {
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
    const token = sessionStorage.getItem("access_token")
    console.log(token);


      function getTopArtists() {
      
        console.log("Fetching top artists...");

        fetch(`https://api.spotify.com/v1/me/top/artists?limit=5&time_range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get('Retry-After');
              console.log(`Rate limited. Retry after ${retryAfter} seconds.`);
              // Implement logic to wait for the specified time before retrying.
            } else if (response.status === 403) {
              console.log("Forbidden. Check if the access token has the right scopes.");
            } else {
              throw new Error(`HTTP status ${response.status}`);
            }
          }
          return response.json();
        })
        .then(data => {
          console.log("Top artists data:", data);
          setTopArtists(data.items);
        })
        .catch(error => {
          console.error("Error getting top artists:", error);
          if (error.response) {
            // Log the response content when there's an error
            error.response.text().then(text => console.error("Response content:", text));
          }

          setTopArtists([]);
        });
      }
   




      function getTopTracks() {
        console.log("Fetching top tracks...");
        fetch(`https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=${timeRange}`, {

          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get('Retry-After');
              console.log(`Rate limited. Retry after ${retryAfter} seconds.`);
              // Implement logic to wait for the specified time before retrying.
            } else if (response.status === 403) {
              console.log("Forbidden. Check if the access token has the right scopes.");
            } else {
              throw new Error(`HTTP status ${response.status}`);
            }
          }
          return response.json();
        })
        .then(data => {
          console.log("Top tracks data:", data);
          setTopTracks(data.items);
        })
        .catch(error => {
          console.error("Error getting top tracks:", error);
          if (error.response) {
            // Log the response content when there's an error
            error.response.text().then(text => console.error("Response content:", text));
          }
          setTopTracks([]);
        });
      }


      if (!token) {
        // Token is not available, handle this case
        console.error('Token not available. Redirecting to login...');
        } 
      else{
          getTopArtists(token); // Fetch top artists
          getTopTracks(token); // Fetch top tracks
        } 

  }, [token, timeRange]);
  

 
  const handleArtistSelect = (artistId) => {
    fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setSelectedArtist(data);
    })
    .catch(error => {
      console.error("Error getting artist details:", error);
    });
  };

  const handleTrackSelect = (trackId) => {
    fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setSelectedTrack(data); // Set the selected track
      setSelectedTrackPopularity(data.popularity);
    })
    .catch(error => {
      console.error("Error getting track details:", error);
    });
  };
  






const handleDisplayPopularity = () => {
  // Check if an artist is selected
  if (selectedArtist) {
    // Display the popularity of the selected artist
    setSelectedArtistPopularity(selectedArtist.popularity);
  }
  if (selectedTrack){
    setSelectedTrackPopularity(selectedTrack.popularity);
  }
};


  const handleArtistChange = (event) => {
    const selectedArtistId = event.target.value;
    const artist = topArtists.find((a) => a.id === selectedArtistId);
    setSelectedArtist(artist);
  };

  const handleTrackChange = (event) => {
    const selectedTrackId = event.target.value;
    const track = topTracks.find((a) => a.id === selectedTrackId);
    setSelectedTrack(track);
  };

  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);
  };




  


  
  

  

  










return (
  <div className="app">
    <Sidebar /> {/* Include the Sidebar component here */}
    <Header />
    <div className="center">
    </div>

    <label>Select time range:</label>
      <select onChange={handleTimeRangeChange} value={timeRange}>
        <option value="short_term">Short Term</option>
        <option value="medium_term">Medium Term</option>
        <option value="long_term">Long Term</option>
      </select>

   





    
    <div className="button-container">
      <button className="button">Mood Sync</button>
      <button className="button">Playlist Generator</button>
      <button className="button">Joint Playlist</button>
      <button className="button">Liked/Dislike Songs</button>
    </div>
   

    <div className="right-content">
      <div className="top-artists textbox"> Top Artists</div>
      <div className="artist-images-container">
          {topArtists.map((artist) => (
            <div key={artist.id} className="artist-image-container">
              {artist.images.length > 0 && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="artist-image"
                />
              )}
              <div className="artist-name">{artist.name}</div>
            </div>
          ))}
        </div>




      

    


<div className="top-genres textbox">Top Tracks</div>
<div className="track-list">
  {topTracks.map((track) => (
    <div key={track.id} className="track-container">
      {track.album.images.length > 0 && (
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="track-image"
        />
      )}
      <div className="track-details">
        <div className="track-name">{track.name}</div>
        <div className="track-artists">
          {track.artists.map((artist) => artist.name).join(", ")}
        </div>
      </div>
    </div>
        ))}
     </div>

     <div>
          <label>Select an artist:</label>
          <select onChange={handleArtistChange}>
            <option value="">-- Select an artist --</option>
            {topArtists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
          <button onClick={handleDisplayPopularity} className="button">
            Display Popularity
          </button>

          {selectedArtistPopularity !== null && (
            <div>
              <h3>{selectedArtist.name}'s Popularity:</h3>
              <p>{selectedArtistPopularity}</p>
            </div>
          )}
        </div>


        <div>
          <label>Select a track:</label>
          <select onChange={handleTrackChange}>
            <option value="">-- Select a track --</option>
            {topTracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name} by {track.artists.map((artist) => artist.name).join(", ")}
              </option>
            ))}
          </select>
          <button onClick={handleDisplayPopularity} className="button">
            Display Popularity
          </button>

          {selectedTrackPopularity !== null && (
            <div>
              <h3>Selected Track's Popularity:</h3>
              <p>{selectedTrackPopularity}</p>
            </div>
          )}
        </div>



      </div>
    </div>
);
}
