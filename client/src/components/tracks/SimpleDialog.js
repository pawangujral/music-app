import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

function SimpleDialog({ onClose, selectedValue, open, data }) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select playlist</DialogTitle>
      {!data || data.length === 0 ? (
        <Box sx={{ p: 2 }}>
          {" "}
          <Alert
            icon={<MusicNoteIcon fontSize="inherit" />}
            severity="warning"
            variant="outlined"
          >
            You have no playlist currently, go to playlists to create one!
          </Alert>
        </Box>
      ) : (
        <List sx={{ pt: 0 }}>
          {data.map((item) => (
            <ListItem disablePadding key={item}>
              <ListItemButton onClick={() => handleListItemClick(item)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Dialog>
  );
}

export default SimpleDialog;
