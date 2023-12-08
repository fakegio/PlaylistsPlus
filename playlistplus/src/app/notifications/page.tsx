"use client";
import { useEffect, useState } from "react";
import "../globals.css";

export default function Notifications() {
  const [token, setToken] = useState<string | null>("");
  const [albumList, setAlbumList] = useState<any[] | null>();
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  //retrieves access token upon initial render
  useEffect(() => {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  //Calls api endpoint to retrieve users' followed artists
  function getFollowedArtists() {
    let artist_ids: any[] = [];
    if (token) {
      let queryParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      let url = "https://api.spotify.com/v1/me/following?type=artist&limit=50";

      fetch(url, queryParameters)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 429) {
              const retryAfter = response.headers.get("Retry-After");
              setErrorMessage(
                `Rate limited. Retry after ${retryAfter} seconds.`
              );
            }
          }
          return response.json();
        })
        .then((data) => {
          let items = data["artists"]["items"];
          items.forEach((item: { id: any }) => {
            artist_ids.push(item.id);
          });
          getRecentMusic(artist_ids);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }

  //Takes a list of artists id's and retrieves the discogrpahy of each artist in listOfIds
  function getRecentMusic(listOfIds: any[]) {
    let listOfAlbums: any[] = [];
    if (token && listOfIds) {
      let lengthOfIds = listOfIds.length;
      let queryParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const fetchAlbumsWithDelay = (id: string) => {
        setTimeout(() => {
          let url =
            "https://api.spotify.com/v1/artists/" +
            id +
            "/albums?include_groups=album";

          fetch(url, queryParameters)
            .then((response) => {
              if (!response.ok) {
                if (response.status === 429) {
                  const retryAfter = response.headers.get("Retry-After");
                  setErrorMessage(
                    `Rate limited. Retry after ${retryAfter} seconds.`
                  );
                }
              }
              return response.json();
            })
            .then((data) => {
              listOfAlbums = listOfAlbums.concat(data["items"]);
              lengthOfIds--;

              if (lengthOfIds === 0) {
                sortAlbums(listOfAlbums);
              }
            })
            .catch((error) => console.error("Error fetching data:", error));
        }, 4000);
      };

      // Iterate through the list of IDs and fetch albums with a delay between requests
      listOfIds.forEach((id) => {
        fetchAlbumsWithDelay(id);
      });
    }
  }

  //Sorts the list of albums by most recent to least recent
  function sortAlbums(albums: any[]) {
    albums.sort((a, b) => {
      const dateA = new Date(a.release_date).getTime();
      const dateB = new Date(b.release_date).getTime();

      if (dateA === dateB) {
        return a.id.localeCompare(b.id); // Sort by album ID (or any other unique identifier)
      }

      return dateB - dateA;
    });
    const albumList = albums.map((item) => (
      <p>
        <a href={`https://open.spotify.com/album/${item.id}`} target="_blank">
          {item["artists"][0].name} released {item.name}
        </a>
        <p className="text-left font-light">{item.release_date}</p>
      </p>
    ));
    const shortAlbumList = albumList.slice(0, 10);
    setAlbumList(shortAlbumList);
  }

  getFollowedArtists();

  let content;
  if (errorMessage) {
    content = errorMessage;
  } else {
    if (albumList) {
      content = albumList;
    } else {
      content = "Loading notifications. This may take a few minutes.";
    }
  }

  return (
    <>
      <main className="min-h-screen overflow-hidden">
        <h1 className="text-white text-6xl font-semibold text-center pt-10">
          Notifications
        </h1>

        <div className="flex mt-8 justify-center w-full h-full overflow-hidden text-black ">
          <div className="sm:w-3/5 lg:w-2/5 pl-2 py-2 flex flex-col gap-3 justify-evenly text-start bg-zinc-200 rounded-lg">
            {content}
          </div>
        </div>
      </main>
    </>
  );
}
