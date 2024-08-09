import React from "react";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";



 const SnackbarMessage = ({message, openSnackbar,setOpenSnackbar}) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={openSnackbar}
      autoHideDuration={4000}
      onClose={setOpenSnackbar}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <Button key="undo" color="secondary" size="small" onClick={ setOpenSnackbar}>
          UNDO
        </Button>,
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={setOpenSnackbar}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  )

}


export default SnackbarMessage;
