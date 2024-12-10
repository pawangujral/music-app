import React, { useEffect, useState } from "react";
import styles from "./TrackRow.module.css";

function TrackRow({ track, handlePlay, playlists, onSaved, onDelete }) {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (playlists.length) {
      const findTrackInPlaylist = playlists.find((playlist) =>
        playlist.tracks.includes(track.id)
      );

      if (findTrackInPlaylist) {
        setSelectedValue(findTrackInPlaylist.id);
      }
    }
  }, [playlists]);

  return (
    <div className={styles.trackRow}>
      <div className={styles.trackLeft}>
        <button className={styles.trackPlay} onClick={() => handlePlay(track)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 12L8 5V19L20 12Z" fill="white" />
          </svg>
        </button>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{track.title}</div>
          <div className={styles.trackArtist}>
            {track.main_artists.join(", ")}
          </div>
        </div>
      </div>
      <div>
        {onDelete ? (
          <button
            className={styles.addPlaylist}
            onClick={() => onDelete(track.id)}
          >
            Remove
          </button>
        ) : (
          <select
            className={styles.select}
            onChange={(e) => {
              onSaved(e.target.value, track.id);
              setSelectedValue(e.target.value);
            }}
            value={selectedValue}
          >
            <option value="">-- Select a playlist</option>
            {playlists.map((playlist) => {
              return (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.title}
                </option>
              );
            })}
          </select>
        )}
      </div>
    </div>
  );
}

export default TrackRow;
