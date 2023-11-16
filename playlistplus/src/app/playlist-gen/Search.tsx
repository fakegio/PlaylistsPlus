import { ChangeEvent, useEffect, useState } from "react";
//Interfaces so I can filter out compilation tracks
interface Artist {
  name: string;
  id: string;
}

interface Track {
  album: {
    album_type: string;
    name: string;
  };
  artists: Array<Artist>;
  id: string;
  name: string;
}

interface TrackObj {
  tracks: Array<Track>;
}

export function Search({ typeOfPlaylist }: { typeOfPlaylist: string }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermID, setSearchTermID] = useState<string>("");
  const [token, setToken] = useState<string | null>("");
  const [results, setResults] = useState<Array<{ name: string; id: string }>>(
    []
  );
  //available genres on Spotify
  const genreSeeds: string[] = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indonesian",
    "industrial",
    "instrumental",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rap",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "world-music",
  ];

  //retrieves access token upon initial render
  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  //returns the id of the most recently saved tracks
  function getRecentlySavedTracks(): Promise<string | void> {
    return new Promise((resolve, reject) => {
      if (token) {
        let queryParameters = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };

        let url = "https://api.spotify.com/v1/me/tracks";
        fetch(url, queryParameters)
          .then((response) => response.json())
          .then((data) => {
            let recentlySavedTrackIDs: string | undefined;
            if (data["items"]) {
              const iterations = Math.min(data["items"].length, 4);
              let ids = [];
              for (let index = 0; index < iterations; index++) {
                ids.push(data["items"][index]["track"]["id"]);
              }
              recentlySavedTrackIDs = ids.toString();
            }
            resolve(recentlySavedTrackIDs); // Resolve the Promise with recentlySavedTrackID
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            reject(error);
          });
      }
    });
  }

  //When the search bar changes, searches the Spotify database as long as the term being searched for is not a genre type
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (searchTerm && typeOfPlaylist !== "Genre") {
      let queryParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      let url =
        "https://api.spotify.com/v1/search?q=" +
        searchTerm +
        "&type=" +
        typeOfPlaylist.toLowerCase() +
        "&limit=50";

      fetch(url, queryParameters)
        .then((response) => response.json())
        .then((data) => {
          if (typeOfPlaylist === "Artist") {
            setResults(data.artists.items);
          } else if (typeOfPlaylist === "Track") {
            setResults(data.tracks.items);
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  //Removes disliked artists from intial tracks and calls filter tracks
  function filterArtists(listOfTracks: Track[]) {
    let removedArtists;
    let storedDislikedArtists: string | null =
      sessionStorage.getItem("dislikedArtists");
    if (storedDislikedArtists) {
      let parsedArtists: string[] = JSON.parse(storedDislikedArtists);
      removedArtists = listOfTracks.filter((track) => {
        return !parsedArtists.includes(track.artists[0].id); // returns artists whose id is not disliked
      });
      return filterTracks(removedArtists);
    } else {
      return filterTracks(listOfTracks);
    }
  }

  //removes disliked tracks from filtered artists
  function filterTracks(listOfTracks: Track[]) {
    let removedTracks;
    let storedDislikedTracks: string | null =
      sessionStorage.getItem("dislikedTracks");

    if (storedDislikedTracks) {
      let parsedTracks: string[] = JSON.parse(storedDislikedTracks);
      removedTracks = listOfTracks.filter((track) => {
        return !parsedTracks.includes(track.id); // returns tracks whose id is not disliked
      });
      return removedTracks;
    } else {
      return listOfTracks;
    }
  }

  //shuffles array of tracks
  const shuffle = (array: Track[]) => {
    return array
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  };

  //Filters through the recommended tracks and gets rid of compilation tracks and tracks whose artist is the search term
  //Return a list of 10 track objects
  function filterCompilationAlbums(trackObj: TrackObj) {
    const listOfTracks = trackObj.tracks;
    const filteredTracks = [];
    let tracksFiltered = 0;

    let filteredDislikes = filterArtists(listOfTracks);
    let shuffledTracks = shuffle(filteredDislikes);

    for (let i = 0; i < shuffledTracks.length; i++) {
      const track = shuffledTracks[i];
      if (
        track.album.album_type !== "COMPILATION" &&
        track.artists[0].name !== searchTerm &&
        !track.album.name.includes("Remaster") &&
        !track.name.includes("Remaster")
      ) {
        filteredTracks.push(track);
        tracksFiltered++;
      }

      if (tracksFiltered === 10) {
        break; // Stop when you have 10 tracks
      }
    }

    return filteredTracks;
  }

  //Sends the playlist title and list of tracks to the display page
  function storeResultsAndRedirect(title: string, data: Track[]) {
    if (typeof window !== "undefined") {
      const dataToSend = [title, data];
      const dataString = JSON.stringify(dataToSend);
      sessionStorage.setItem("PlaylistData", dataString);
      window.location.href = `/display-playlist-gen`;
    }
  }

  //calls the spotify get recommendations endpoint
  function getRecommendations() {
    let playlistTitle = "New Playlist";
    //not utilizing listening patterns
    let queryParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    let url = "";

    if (typeOfPlaylist === "Genre") {
      playlistTitle = "Genre Explorer: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_genres=" +
        searchTerm +
        "&max_popularity=50&limit=100";
    } else if (typeOfPlaylist === "Track") {
      playlistTitle = "Song Roulette: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_tracks=" +
        searchTermID +
        "&max_popularity=50&limit=100";
    } else {
      playlistTitle = "Artist Spotlight: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_artists=" +
        searchTermID +
        "&max_popularity=50&limit=100";
    }
    fetch(url, queryParameters)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = filterCompilationAlbums(data);
        storeResultsAndRedirect(playlistTitle, filteredData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  //calls the spotify get recommendations endpoint with user's recently saved tracks
  async function getRecommendationsWithSavedTracks() {
    let playlistTitle = "New Playlist";
    const recentTrackIDs = await getRecentlySavedTracks();
    let queryParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };

    let url = "";

    if (typeOfPlaylist === "Genre") {
      playlistTitle = "Genre Explorer: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_genres=" +
        searchTerm +
        "&seed_tracks=" +
        recentTrackIDs +
        "&max_popularity=60&target_popularity=30&limit=100";
    } else if (typeOfPlaylist === "Track") {
      playlistTitle = "Song Roulette: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_tracks=" +
        searchTermID +
        "," +
        recentTrackIDs +
        "&max_popularity=60&target_popularity=30&limit=100";
    } else {
      playlistTitle = "Artist Spotlight: " + searchTerm;
      url =
        "https://api.spotify.com/v1/recommendations?seed_artists=" +
        searchTermID +
        "&seed_tracks=" +
        recentTrackIDs +
        "&max_popularity=60&target_popularity=30&limit=100";
    }
    fetch(url, queryParameters)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = filterCompilationAlbums(data);
        storeResultsAndRedirect(playlistTitle, filteredData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  //Handles form submission
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here, e.g., make API calls, perform data processing, etc.
    let form = e.target as HTMLFormElement;
    let checkboxElement = form.children[2].children[0] as HTMLInputElement;

    if (checkboxElement.checked) {
      // utilizing listening patterns
      getRecommendationsWithSavedTracks();
    } else {
      getRecommendations();
    }
  };

  //Only for track and artist playlist generators
  //Renders available artists/tracks on Spotify
  function renderSpotifySearchResults() {
    return results
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        const fullName = item.name.toLowerCase();
        return term && fullName.startsWith(term) && fullName !== term;
      })
      .slice(0, 8)
      .map((item) => (
        <div
          onClick={() => {
            setSearchTerm(item.name);
            setSearchTermID(item.id);
          }}
          className="cursor-pointer text-left"
          key={item.id}
        >
          {item.name}
        </div>
      ));
  }

  //Renders available genres using the genreSeeds array
  function renderSpotifyGenreResults() {
    return genreSeeds
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        return term && item.startsWith(term) && item !== term;
      })
      .slice(0, 8)
      .map((item) => (
        <div
          onClick={() => setSearchTerm(item)}
          className="cursor-pointer text-left"
          key={item}
        >
          {item}
        </div>
      ));
  }

  return (
    <>
      <label htmlFor="search-form">{typeOfPlaylist}</label>
      <form
        action="#"
        name="search-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          className="bg-white rounded-md text-black"
          type="text"
          name="text"
          id="text"
          placeholder={"Search " + typeOfPlaylist + "s..."}
          value={searchTerm}
          onChange={
            typeOfPlaylist !== "Genre"
              ? handleInputChange
              : (e) => setSearchTerm(e.target.value)
          }
        />
        <div className="bg-white flex flex-col">
          {typeOfPlaylist !== "Genre"
            ? renderSpotifySearchResults()
            : renderSpotifyGenreResults()}
        </div>
        <label htmlFor={typeOfPlaylist}>
          {" "}
          <input
            className="mr-2 form-checkbox text-white"
            type="checkbox"
            name={typeOfPlaylist}
            id={typeOfPlaylist}
          />
          Utilize listening patterns
        </label>
        <button
          className="bg-green-500 rounded-lg px-4 py-2 font-bold"
          type="submit"
          disabled={!searchTerm}
        >
          Create Playlist
        </button>
      </form>
    </>
  );
}
