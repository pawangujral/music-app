import React, { useState, useEffect } from "react";
import PlaylistRow from "./PlaylistRow";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormDialog from "./Add";
import Grid from "@mui/material/Grid2";
import { enqueueSnackbar } from "notistack";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

function Playlists() {
  // State to manage the dialog open/close status
  const [open, setOpen] = React.useState(false);
  // State to store the list of playlists
  const [playlists, setPlaylists] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // Function to fetch playlists from the server
  const getPlaylists = () => {
    setLoading(true);
    fetch("/api/v1/playlists")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const { playlists } = data;
        setPlaylists(playlists);
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
      })
      .finally(() => {
        setLoading(false);
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
        enqueueSnackbar("Playlist added successfully", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
      });
  };

  // Function to handle deleting a playlist
  const handlePlaylistDelete = (id) => {
    fetch(`/api/v1/playlists/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          setPlaylists(playlists.filter((playlist) => playlist.id !== id));
          enqueueSnackbar("Playlist deleted successfully", {
            variant: "warning",
          });
        }
      })
      .catch(() => {
        enqueueSnackbar("Something went wrong, try again!", {
          variant: "error",
        });
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

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress /> {/* Show loading spinner */}
      </Box>
    );
  }

  if (!playlists.length) {
    return (
      <>
        <Alert
          icon={<MusicNoteIcon fontSize="inherit" />}
          severity="warning"
          variant="outlined"
        >
          Let's add your first playlist!
        </Alert>
        <Button variant="outlined" onClick={handleClickOpen} sx={{ mt: 2 }}>
          Add New Playlist
        </Button>
      </>
    );
  }

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
