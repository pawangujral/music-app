import React, { useEffect, useState } from "react";
import styles from "./PlaylistRow.module.css";
import { NavLink } from "react-router";

function PlaylistRow({ playlist, onTrackDelete }) {
  const [previewTrack, setPreviewTrack] = useState();

  const getTracks = (id) => {
    fetch(`/api/v1/tracks/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPreviewTrack(data.track);
      });
  };

  useEffect(() => {
    if (playlist && playlist.tracks.length) {
      getTracks(playlist.tracks[0]);
    }
  }, [playlist]);

  return (
    <NavLink
      to={`/playlists/${playlist.id}`}
      className={({ isActive }) => (isActive ? styles.active : null)}
    >
      <div className={styles.card}>
        <div
          className={styles.cardMedia}
          style={{
            backgroundImage: previewTrack
              ? `url(${previewTrack.cover_art})`
              : "none",
          }}
        ></div>
        <div className={styles.cardContent}>
          <h5 className={styles.title}>{playlist.title}</h5>
          <h6 className={styles.subtitle}>
            Total tracks: {playlist.tracks.length}
          </h6>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.cardActionsButton}
            onClick={() => onTrackDelete(playlist.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </NavLink>
  );
}

export default PlaylistRow;
