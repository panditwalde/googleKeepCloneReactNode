import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Tooltip } from "@material-ui/core";
import AddAlertOutlinedIcon from "@material-ui/icons/AddAlertOutlined";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import { notesAPI } from "./Service";
import { useDispatch, useSelector } from "react-redux";
import { ALL_NOTES } from "../Redux/actionType";
import SnackbarMessage from "./SnackbarMessage";
import { format } from 'date-fns'
import "../Cssfile/addReminder.css";

const theme = createMuiTheme({
  overrides: {
    MuiPopover: {
      paper: {
        width: "16%",
      },
    },
  },
});

const styles = theme => ({
  typography: {
    margin: theme.spacing.unit * 2
  }
});

const Reminder = ({ noteId,create,setNote }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [opensnackbar, setOpensnackbar] = useState(false);
  const [isDateTimer, setIsDateTimer] = useState(false);
  const {  allNotes } = useSelector(state => state);

  const dispatch = useDispatch(); 
  const handleDateChange = (date) => {
    setSelectedReminder(date);
    setCurrentDate(date);
  };

  const handleSaveReminder = () => updateNote(format(selectedReminder, "MMM d, h:mma"));

  const handleQuickReminder = (hours, daysToAdd = 0) => {
    let reminderDate = new Date();
    reminderDate.setHours(hours, 0, 0, 0);
    reminderDate.setDate(reminderDate.getDate() + daysToAdd);
    updateNote(format(reminderDate, "MMM d, h:mma"));

  };

const updateNote =async(formattedDate)=>{

  if (!create) {
    
    notesAPI.update({ reminder: formattedDate, isReminder: true }, noteId)
    .then(() => {
      dispatch({ type: ALL_NOTES, payload:  allNotes.map(note => note._id === noteId ? { ...note,  reminder: formattedDate, isReminder: true} : note) });
      setOpensnackbar(true);
      setAnchorEl(null);

    })
    .catch((error) => {
      console.error("Error adding reminder:", error);
    });
  } else {
    setNote({reminder: formattedDate, isReminder: true })
    setAnchorEl(null);    
  }   

  }

  return (
    <div>
      <Tooltip title="Remind me">
        <AddAlertOutlinedIcon onClick={event => setAnchorEl(event.currentTarget)} />
      </Tooltip>

      <Popover
        id="simple-popper"
        open={Boolean(anchorEl)}
        onClose={()=> setAnchorEl(null)}

        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        style={{ top: "20px", left: "110px" }}
      >
        <div className="main">
          {!isDateTimer ? (
            <>
              <div className="today" style={{ fontSize: "20px" }} >
                Reminder :
              </div>
              <div className="today" onClick={() => handleQuickReminder(20, 0)}>
                <div> Later today</div>
                <div>8:00 PM</div>
              </div>

              <div className="today" onClick={() => handleQuickReminder(20, 1)}>
                <div>Tomorrow</div>
                <div>8:00 PM</div>
              </div>

              <div className="today" onClick={() => handleQuickReminder(20, 7)}>
                <div>Next week</div>
                <div>Mon, 8:00 PM</div>
              </div>
              <div className="today" style={{ display: 'flex', justifyContent: 'start' }} onClick={() => setIsDateTimer(prev=> !prev)}>
                <div><AccessTimeIcon /></div>
                <div style={{ marginLeft: '4%' }}>Pick date & time</div>
              </div>
            </>
          ) : (
            <>
              <div onClick={() =>  setIsDateTimer(prev=> !prev)} className="today" style={{ display: 'flex', justifyContent: 'start' }}  >
                <div><ArrowBackIcon /></div>
                <div>Pick date & time</div>
              </div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MuiThemeProvider theme={theme}>
                  <DatePicker margin="normal" label="Date picker" value={currentDate} onChange={handleDateChange} />
                  <TimePicker margin="normal" label="Time picker" value={currentDate} onChange={handleDateChange} />
                </MuiThemeProvider>
              </MuiPickersUtilsProvider>
              <div style={{ display: 'flex', justifyContent: 'end' }} onClick={handleSaveReminder}>Save</div>
            </>
          )}
        </div>
      </Popover>

      <SnackbarMessage
        message={"Add Reminder"}
        openSnackbar={opensnackbar}
        setOpenSnackbar={() => setOpensnackbar(false)}
      />
    </div>
  );
};

export default withStyles(styles)(Reminder);
