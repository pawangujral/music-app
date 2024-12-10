import React, { useEffect, useState, useRef } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function TrackRow({ track, handlePlay, playlists, onDelete, onOpen }) {
  const btnRef = useRef();
  // State to keep track of the selected playlist
  const [selectedValue, setSelectedValue] = useState();

  // Effect to update selectedValue when playlists change
  useEffect(() => {
    if (playlists.length) {
      // Find if the track is in any playlist
      const findTrackInPlaylist = playlists.find((playlist) =>
        playlist.tracks.includes(track.id)
      );

      // If found, set the selectedValue to the playlist id
      if (findTrackInPlaylist) {
        setSelectedValue(findTrackInPlaylist.id);
      } else {
        setSelectedValue(null);
      }
    }
  }, [playlists]);

  return (
    <ListItem
      secondaryAction={
        // If onDelete is provided, show delete icon
        selectedValue ? (
          // If track is in a playlist, show filled favorite icon
          <IconButton
            ref={btnRef}
            edge="end"
            aria-label="like"
            data-playlistid={selectedValue}
            onClick={(e) => {
              e.stopPropagation();
              const playlistId = btnRef.current.dataset.playlistid;
              console.log(track.id, playlistId);
              onDelete(track.id, playlistId);
            }}
          >
            <FavoriteIcon />
          </IconButton>
        ) : (
          // Otherwise, show outlined favorite icon
          <IconButton
            edge="end"
            aria-label="like"
            onClick={() => onOpen(track.id)}
          >
            <FavoriteBorderIcon />
          </IconButton>
        )
      }
    >
      <ListItemButton role={undefined} onClick={() => handlePlay(track)} dense>
        <ListItemAvatar>
          <Avatar alt={track.title} src={track.cover_art} />
        </ListItemAvatar>
        <ListItemText
          primary={track.title}
          secondary={track.main_artists.join(", ")}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default TrackRow;
