import React, { useState, useEffect } from "react";
import PlaylistRow from "./PlaylistRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormDialog from "./Add";
import Grid from "@mui/material/Grid2";

function Playlists() {
  // State to manage the dialog open/close status
  const [open, setOpen] = React.useState(false);

  // State to store the list of playlists
  const [playlists, setPlaylists] = useState([]);

  // Function to fetch playlists from the server
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

  // Fetch playlists when the component mounts
  useEffect(() => {
    getPlaylists();
  }, []);

  // Function to handle adding a new playlist
  const handleAddPlaylist = (value) => {
    fetch("/api/v1/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Date.now(),
        title: value,
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
      });
  };

  // Function to handle deleting a playlist
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

  // Function to open the add playlist dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the add playlist dialog and add the playlist
  const handleClose = (name) => {
    handleAddPlaylist(name);
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 2, mb: 2 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {playlists.map((playlist, ix) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              onTrackDelete={handlePlaylistDelete}
            />
          ))}
        </Grid>
      </Box>

      <Button variant="outlined" onClick={handleClickOpen} sx={{ mt: 2 }}>
        Add New Playlist
      </Button>
      <FormDialog open={open} onClose={handleClose} />
    </>
  );
}

export default Playlists;
