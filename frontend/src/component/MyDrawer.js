import React, { useState } from "react";
import { IconButton, Drawer, createMuiTheme, List, ListItem, ListItemIcon } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { MuiThemeProvider } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";
import AddAlertOutlinedIcon from "@material-ui/icons/AddAlertOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import ArchiveOutlinedIcon from "@material-ui/icons/ArchiveOutlined";
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import EditLabel from "./EditLabel";
import "../Cssfile/Drawer.css";
import { useDispatch, useSelector } from "react-redux";
import { DRAWER } from "../Redux/actionType";

const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paper: {
        marginTop: "70px",
        width: "20%"
      }
    }
  }
});

const MyDrawer = ({ history }) => {
  const [open, setOpen] = useState(false);
  const { allLabels } = useSelector(state => state);
  const dispatch = useDispatch();  

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <IconButton onClick={() => {
          dispatch({ type: DRAWER })
          setOpen(!open)
        }}>
          <MenuIcon />
        </IconButton>
        <div style={{ textAlign: "initial" }}>
          <Drawer variant="persistent" anchor="left" open={open}>
            <List>
              <ListItem onClick={() => history.push("/dashboard/note")} button>
                <ListItemIcon><EmojiObjectsOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Notes" />
              </ListItem>
              <ListItem onClick={() => history.push("/dashboard/reminder")} button>
                <ListItemIcon><AddAlertOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Reminder" />
              </ListItem>
            </List>
            <List>
              {allLabels?.map(label => (
                <ListItem onClick={() => history.push(`/dashboard/label/${label._id}`, { label: label })} button key={label._id}>
                  <ListItemIcon><LabelOutlinedIcon /></ListItemIcon>
                  <ListItemText primary={label.label_title} />
                </ListItem>
              ))}
              <ListItem>
                <ListItemIcon><EditOutlinedIcon /></ListItemIcon>
                <EditLabel/>
              </ListItem>
            </List>
            <List>
              <ListItem onClick={() => history.push("/dashboard/archive")} button>
                <ListItemIcon><ArchiveOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Archive" />
              </ListItem>
              <ListItem onClick={() => history.push("/dashboard/trash")} button>
                <ListItemIcon><DeleteOutlineOutlinedIcon /></ListItemIcon>
                <ListItemText primary="Trash" />
              </ListItem>
            </List>
          </Drawer>
        </div>
      </MuiThemeProvider>
    </div>
  );
};


export default MyDrawer;
