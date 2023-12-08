"use client"
import { authorize, getToken, login, removeCredentials } from '@/API/authorize';
import React, { useState, useEffect } from 'react';
import './App.css';
import 'reactjs-popup/dist/index.css';
import Header from "./Header";
import Slider from '@mui/material/Slider';
import Popup from 'reactjs-popup';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";

//npm install @mui/material
//npm install @emotion/react
//npm install @emotion/styled

const iconStyle = {
  marginLeft: '10px',
  marginRight: '10px'
}

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
  const [hiddenGem, setHiddenGem] = useState([]);

  const [selectedArtistPopularity, setSelectedArtistPopularity] = useState(null);
  const [selectedTrackPopularity, setSelectedTrackPopularity] = useState(null);
  const [timeRange, setTimeRange] = useState('short_term'); // Default time range is 'short_term'

  const [relatedArtists, setRelatedArtists] = useState([]);

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [displayRelatedArtists, setDisplayRelatedArtists] = useState(false);
  const [popularity, setPopularity] = useState(100); // Set a default value for popularity
  const [topGenres, setTopGenres] = useState([]);



  useEffect(() => {
    setCodeVerifier(sessionStorage.getItem("code_verifier") || "");
    const token = sessionStorage.getItem("access_token")
    console.log(token);


    function getTopArtists() {
      console.log("Fetching top artists...");

      // Include the popularity filter in the API call
      fetch(`https://api.spotify.com/v1/me/top/artists?limit=20&time_range=${timeRange}`, {
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
        // Filter the artists based on the selected popularity
        const filteredArtists = data.items.filter(artist => artist.popularity <= popularity);
        setTopArtists(filteredArtists);
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
      fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${timeRange}`, {
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

    function getRecentlyPlayed() {
      console.log("Fetching recently played tracks...");
      fetch('https://api.spotify.com/v1/me/player/recently-played', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }
            return response.json();
        })
        .then(data => {
          console.log("Recently played data:", data);
          setRecentlyPlayed(data.items);
        })
        .catch(error => {
          console.error("Error getting recently played tracks:", error);
          if (error.response) {
            error.response.text().then(text => console.error("Response content:", text));
          }
          setRecentlyPlayed([]);
        });
    }

    function getTopGenres() {
      console.log("Fetching user's top genres...");
      fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`, {
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
        const genres = data.items.reduce((accumulatedGenres, artist) => {
          return accumulatedGenres.concat(artist.genres);
        }, []);
        // Count occurrences of each genre
        const genreCounts = genres.reduce((acc, genre) => {
          acc[genre] = (acc[genre] || 0) + 1;
          return acc;
        }, {});
        // Sort genres by count
        const sortedGenres = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a]);
        // Get the top 5 genres
        const topFiveGenres = sortedGenres.slice(0, 5);
        setTopGenres(topFiveGenres);
      })
      .catch(error => {
        console.error("Error getting top genres:", error);
      });
    }

    function getHiddenGem() {
      console.log("Fetching user's top gems...");
      fetch('https://api.spotify.com/v1/search?q=tag%3Ahipster&type=album&market=US&limit=20',{
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
          console.log("Hidden gem data:", data);
          setHiddenGem(data.items);
        })
      .catch(error => {
        console.error("Error getting hidden gems:", error);
        if (error.response) {
          error.response.text().then(text => console.error("Response content:", text));
        }
        setHiddenGem([]);
      });
    }

    if (!token) {
      // Token is not available, handle this case
      console.error('Token not available. Redirecting to login...');
      } 
    else{
        getTopArtists(token); // Fetch top artists
        getTopTracks(token); // Fetch top tracks
        getRecentlyPlayed(); // Fetch recently played tracks
        getTopGenres();
        getHiddenGem();
      } 

      if (selectedArtist) {
        // Fetch related artists when the selected artist changes
        fetch(`https://api.spotify.com/v1/artists/${selectedArtist.id}/related-artists`, {
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
          setRelatedArtists(data.artists.slice(0, 5)); // Limit to 5 related artists
        })
        .catch(error => {
          console.error("Error getting related artists:", error);
        });
      }
  }, [token, timeRange, selectedArtist,popularity]);
  
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
    if (selectedArtist && !selectedTrack) {
      // Display the popularity of the selected artist only if no track is selected
      setSelectedArtistPopularity(selectedArtist ? selectedArtist.popularity : null);
    }
    if (selectedTrack) {
      setSelectedTrackPopularity(selectedTrack ? selectedTrack.popularity : null);
    }
  };

  const handleArtistChange = (event) => {
    const selectedArtistId = event.target.value;
    const artist = topArtists.find((a) => a.id === selectedArtistId);
    setSelectedArtist(artist);
    //setPopularity(artist ? artist.popularity : null); // Update popularity when artist changes
  };

  const handleTrackChange = (event) => {
    const selectedTrackId = event.target.value;
    const track = topTracks.find((a) => a.id === selectedTrackId);
    setSelectedTrack(track);
    //setPopularity(track ? track.popularity : null); // Update popularity when track changes
  };

  const handleTimeRangeChange = (event) => {
    const selectedTimeRange = event.target.value;
    setTimeRange(selectedTimeRange);
  };

 

  const handleDisplayRelatedArtists = () => {
    // Display related artists
    console.log("Related Artists:", relatedArtists.map(artist => artist.name));
  };

  return (
    <div className="app">
      <Header />
      <div className="button-container">
        <button className="button">Mood Sync</button>
        <button className="button">Playlist Generator</button>
        <button className="button">Joint Playlist</button>
        <button className="button">Liked/Dislike Songs</button>
        <Popup className="button" trigger={<button className="button">Share Application</button>}>
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
        <label>Select time range:</label>
        <select onChange={handleTimeRangeChange} value={timeRange}>
          <option value="short_term">Short Term</option>
          <option value="medium_term">Medium Term</option>
          <option value="long_term">Long Term</option>
        </select>
      </div>

      <div>
      <label>Popularity: {popularity}</label>
      <Slider
        value={popularity}
        onChange={(event, newValue) => setPopularity(newValue)}
        onMouseUp={handleDisplayPopularity} // Call the display popularity function when slider is released
        min={0}
        max={100}
        step={1}
        valueLabelDisplay="auto"
        sx={{ width: '80%', margin: 'auto' }} // Adjust the width and margin as needed
      />
      </div>

      <div className="center">
      <div className="left-content">
        <div className="top-artists textbox"> Top Artists</div>
        <div className="artist-images-container">
        {topArtists.slice(0, 5).map((artist,index) => (
          <div key={artist.id} className="artist-image-container">
          <span>{index + 1}</span>
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

          {relatedArtists.length > 0 && (
            <div>
              <h3>Related Artists:</h3>
              <div className="related-artists-container">
              {relatedArtists.map(artist => (
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
            </div>
          )}

          <div className="top-genres textbox">Top Genres</div>
          {topGenres.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px' }}>
              {topGenres.map((genre, index) => (
                <div key={index} style={{ backgroundColor: 'grey', padding: '5px', borderRadius: '5px' }}>{genre}</div>
              ))}
            </div>
          )}
        </div>
        <div className="hidden-gem textbox">Hidden Gems</div>
        <div className="hidden-gem-textbox">
        {Array.isArray(hiddenGem) && hiddenGem
          .filter((album) => album.popularity <= popularity)
          .slice(0, 5)
          .map((album) => (
            <div key={album.id} className="track-image-container">
              {album.images.length > 0 && (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="track-image"
                />
              )}
              <div className="track-details">
                <div className="track-name">{album.name}</div>
                <div className="track-artists">
                  {album.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right-content">
        <div className="top-genres textbox">Top Tracks</div>
        <div className="top-tracks-container">
        <div className="top-tracks-column">
        {topTracks
          .filter((track) => track.popularity <= popularity)
          .slice(0, 3) // Render first half of the tracks
          .map((track) => (
            <div key={track.id} className="track-image-container">
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
        <div className="top-tracks-column">
          {topTracks
            .filter((track) => track.popularity <= popularity)
            .slice(3, 6) // Render the second half of the tracks
            .map((track) => (
              <div key={track.id} className="track-image-container">
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
      <div className="recently-played textbox"> Recent Tracks</div>
      <div className="top-tracks-container">
      <div className="top-tracks-column">
          {recentlyPlayed
            .filter((item) => item.track.popularity <= popularity)
            .slice(0, 3) // Render the first 3 recent tracks in the first column
            .map((item) => (
              <div key={item.track.id} className="track-image-container">
                {item.track.album.images.length > 0 && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    className="track-image"
                  />
                )}
                <div className="track-details">
                  <div className="track-name">{item.track.name}</div>
                  <div className="track-artists">
                    {item.track.artists.map((artist) => artist.name).join(", ")}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="top-tracks-column">
          {recentlyPlayed
            .filter((item) => item.track.popularity <= popularity)
            .slice(3, 6) // Render the next 3 recent tracks in the second column
            .map((item) => (
              <div key={item.track.id} className="track-image-container">
                {item.track.album.images.length > 0 && (
                  <img
                    src={item.track.album.images[0].url}
                    alt={item.track.name}
                    className="track-image"
                  />
                )}
                <div className="track-details">
                  <div className="track-name">{item.track.name}</div>
                  <div className="track-artists">
                    {item.track.artists.map((artist) => artist.name).join(", ")}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}           
