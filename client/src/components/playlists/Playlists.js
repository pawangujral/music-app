import React, { useState, useEffect } from "react";
import PlaylistRow from "./PlaylistRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormDialog from "./Add";
import Grid from "@mui/material/Grid2";

function Playlists() {
  const [open, setOpen] = React.useState(false);

  const [playlists, setPlaylists] = useState([]);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

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
