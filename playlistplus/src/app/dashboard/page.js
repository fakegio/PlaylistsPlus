"use client"
import { authorize, getToken, login, removeCredentials } from '@/API/authorize';
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from "./Header";
import SearchBar from "./SearchBar";
import Sidebar from './Sidebar'; 




export default function Home() {
  const [token, setToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [codeVerifier, setCodeVerifier] = useState('')
  const [backgroundColors, setBackgroundColors] = useState('');
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
    const token = sessionStorage.getItem("access_token")
    console.log(token);


      function getTopArtists() {
      
        console.log("Fetching top artists...");

        fetch('https://api.spotify.com/v1/me/top/artists', {
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
        fetch('https://api.spotify.com/v1/me/top/tracks', {
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
  }, []);
  

 

  






  // Function to handle artist search
  const handleSearch = (query) => {
    // You need to replace 'YOUR_API_ENDPOINT' with the actual Spotify API endpoint.
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setSearchResults(data.artists.items);
    })
    .catch(error => {
      console.error("Error searching for artists:", error);
    });
  };



  // ... your JSX rendering ...
  <div className="search-results">
    {searchResults.map((artist) => (
      <div key={artist.id}>{artist.name}</div>
    ))}
  </div>



const artistPopularitySection = artist && (
  <div className="artist-popularity">
    <h2>Artist Popularity</h2>
    <h3>{artist.name}</h3>
    <p>Popularity: {artist.popularity}%</p>
  </div>
);

const handleArtistSelect = (artistId) => {
  // You need to replace 'YOUR_API_ENDPOINT' with the actual Spotify API endpoint.
  fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    setArtist(data);
  })
  .catch(error => {
    console.error("Error getting artist data:", error);
  });
};






return (
  <div className="app">
    <Sidebar /> {/* Include the Sidebar component here */}
    <Header />
    <div className="center">
      <SearchBar onSearch={handleSearch} />
    </div>
    <div className="button-container">
      <button className="button">Mood Sync</button>
      <button className="button">Playlist Generator</button>
      <button className="button">Joint Playlist</button>
      <button className="button">Liked/Dislike Songs</button>
    </div>
    <div className="analytics-header">
      <h2>Analytics</h2>
      {/* Add content related to analytics here */}
    </div>

    <div className="right-content">
      <div className="top-artists textbox"> Top Artists</div>
      <h2>Top Artists</h2>
      <ul>
        {topArtists.map((artist) => (
          <li 
          key={artist.id} 
          className="red-text"
          onClick={() => handleArtistSelect(artist.id)}>  
          {artist.name}
          </li>
        ))}
      </ul>



      {artistPopularitySection}
    


      <div className="top-genres textbox">Top Tracks</div>
      <h2>Top Tracks</h2>
      <ul>
        {topTracks.map((track) => (
          <li key={track.id} className="white-text">
            {track.name}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
}
