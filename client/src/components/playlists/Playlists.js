import React, { useState, useEffect } from "react";
import PlaylistRow from "./PlaylistRow";
import styles from "./Playlists.module.css";

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getPlaylists = () => {
    fetch("/api/v1/playlists")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlists } = data;
        setPlaylists(playlists);
      });
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  const handleAddPlaylist = () => {
    fetch("/api/v1/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Date.now(),
        title: inputValue,
        tracks: [],
        dateCreated: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setPlaylists([...playlists, data.playlist]);
        setInputValue("");
      });
  };

  const handlePlaylistDelete = (id) => {
    fetch(`/api/v1/playlists/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        setPlaylists(playlists.filter((playlist) => playlist.id !== id));
      }
    });
  };

  return (
    <>
      <div>
        <div className={styles.header}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter new playlist name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className={styles.addPlaylist}
            onClick={handleAddPlaylist}
            disabled={!inputValue.length}
          >
            Add New Playlist
          </button>
        </div>

        <hr className={styles.divider} />

        <div className={styles.container}>
          {playlists.map((playlist, ix) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              onTrackDelete={handlePlaylistDelete}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Playlists;
