import React from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Avatar,TextField, Dialog, DialogTitle, DialogContent, DialogContentText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { userAPI } from "./Service";

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2)
  },
  avatar: {
    width: "77px",
    height: "77px"
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    width: "131%"
  },
  dialogButtons: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: "22%"
  },
  loader: {
    marginLeft: theme.spacing(1)
  }
}));

export default function SimplePopover(props) {
  const name = localStorage.getItem("Name");
  const email = localStorage.getItem("Email");
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [file, setFile] = React.useState('');
  const [loading, setLoading] = React.useState(false); // Loading state

   const handleLogout = async () => {
    const response = await userAPI.logout();
    if (response) {
      localStorage.removeItem("Token");
      props.PropsDashboard.history.push("/");
    }
  };

  const handleFileSubmitChange = async () => {
    try {
      if (!file) {
        alert("Please select a file.");
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file, file.name);
    
      const response = await userAPI.updateProfile(formData);
  
      if (response && response.data && response.data.data) {
        localStorage.setItem("ProfilePic", response.data.data);
        setOpenDialog(false);
      } else {
        throw new Error("Invalid response from the server.");
      }
    } catch (error) {
      console.error("Profile picture not updated", error);
      alert("An error occurred while updating the profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : null;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Avatar
          alt={name}
          src={localStorage.getItem("ProfilePic")}
          onClick={(event)=> setAnchorEl(event.currentTarget)}
          className={classes.avatar}
        />
      </div>
      <Popover
        style={{ top: "5%" }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={()=>     setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <Typography className={classes.typography}>
          <div className="mainprofle">
            <div style={{ justifyContent: "center", display: "flex", top: "3%" }}>
              <Badge
                overlap="circle"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                badgeContent={
                  <CameraAltIcon
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                    onClick={()=> setOpenDialog(true)}
                  />
                }
              >
                <Avatar
                  alt={name}
                  src={localStorage.getItem("ProfilePic")}
                  className={classes.avatar}
                />
              </Badge>
            </div>
            <div style={{ justifyContent: "center", display: "flex", top: "3%" }}>
              <b>{name}</b>
            </div>
            <div style={{ justifyContent: "center", display: "flex", top: "2%", padding: "2%" }}>
              {email}
            </div>
            <div className="profileaccount" style={{ backgroundColor: "#e0e0e0", padding: "3%", paddingBottom: "3%", borderRadius: "10px" }}>
              Manage Your Fundoo Account
            </div>
            <Divider />
            <div style={{ justifyContent: "center", display: "flex", padding: "9%" }}>
              <Button variant="contained" color="white" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
            <Divider />
            <div className="profilefooter">Privacy Policy . Terms of Service</div>
          </div>
        </Typography>
      </Popover>

      <Dialog open={openDialog} onClose={()=> setOpenDialog(false)} aria-labelledby="changeProfile">
        <DialogTitle
          id="max-width-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 'x-large',
            fontFamily: 'monospace',
            fontStyle: 'unset'
          }}
        >Change Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className={classes.dialogContent}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TextField type="file" onChange={(e)=> setFile(e.target.files[0])}></TextField>
              </div>
              <div className={classes.dialogButtons}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleFileSubmitChange}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? <CircularProgress size={24} className={classes.loader} /> : "Upload"}
                </Button>
                <Button variant="contained" color="primary" onClick={()=> setOpenDialog(false) } disabled={loading}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

    </div>
  );
}
