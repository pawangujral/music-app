import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// Define the FormDialog component, which takes 'open' and 'onClose' as props
function FormDialog({ open, onClose }) {
  return (
    <React.Fragment>
      <Dialog
        // Control the open state of the dialog
        open={open}
        // Handle the dialog close event
        onClose={onClose}
        // Set form properties for the dialog
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            // Prevent the default form submission behavior
            event.preventDefault();
            // Create a FormData object from the form
            const formData = new FormData(event.currentTarget);
            // Convert the FormData object to a JSON object
            const formJson = Object.fromEntries(formData.entries());
            // Extract the playlist name from the form data
            const playlistName = formJson.name;
            // Call the onClose function with the playlist name
            onClose(playlistName);
          },
        }}
      >
        <DialogTitle>Add New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            // Set the text field to auto-focus when the dialog opens
            autoFocus
            // Make the text field required
            required
            // Set the margin of the text field
            margin="dense"
            // Set the ID of the text field
            id="name"
            // Set the name of the text field
            name="name"
            // Set the label of the text field
            label="Enter new playlist name"
            // Set the type of the text field
            type="text"
            // Make the text field take the full width of its container
            fullWidth
            // Set the variant of the text field
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          {/* Button to cancel and close the dialog */}
          <Button onClick={onClose}>Cancel</Button>
          {/* Button to submit the form */}
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default FormDialog;
