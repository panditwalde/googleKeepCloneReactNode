import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, InputBase, Card, TextField } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { notesAPI } from "./Service";
import SnackbarMessage from "./SnackbarMessage";
import { ALL_NOTES } from "../Redux/actionType";
import { CollabratorsSection, FooterArea, LabelsSection, PinUnpinSection, ReminderSection } from "./NoteCard";

const CreateNote = ({ allNote }) => {
  const [open, setOpen] = useState(false);
  const [opensnackbar, setOpensnackbar] = useState(false);
  const [creatednote, setCreatednote] = useState({
    title: "",
    description: "",
    color: "",
    pin: false,
    reminder: "",
    archive: false,
    collabrators: [],
    labelarray: []
  });

  const dispatch = useDispatch();
  const { view } = useSelector((state) => state);


  const getAllNotes = async () => {
    try {
      const response = await notesAPI.displayAllNotes();
      dispatch({ type: ALL_NOTES, payload: response.data.data });
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleOnClickAwayChange = async () => {
    setOpen(false);
  
    try {

      await  notesAPI.create(creatednote);
      setOpensnackbar(true);
      getAllNotes();
      setCreatednote({ title: "", description: "", color: "", pin: false, reminder: "", archive: false, collabrators: [], labelarray: [] });
    } catch (err) {
      console.log("Note not created:", err);
    }
  };
  return (
    <ClickAwayListener >
      <div className="createnote" style={{ marginTop: !view ? `${allNote.length > 0 ? "19%" : "13%"}` : `${allNote.length > 0 ? "8%" : "13%"}` }}>
        <Paper style={{ width: "550px", position: "relative", margin: "auto" }}>
          {!open ? 
            <Card>
              <div style={{ justifyContent: "space-around", display: "flex", paddingTop: "6px", paddingBottom: "6px", overflow: 'hidden', boxShadow: "0 0 0 1px rgba(0, 0, 0, .125)" }}>
                <InputBase color="white" placeholder="Take a note..." onClick={() => setOpen(!open)} />
                <CheckBoxOutlinedIcon />
                <CreateOutlinedIcon />
                <ImageOutlinedIcon />
              </div>
            </Card>
           : 
            <Card style={{ boxShadow: " 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)", borderRadius: "11px", backgroundColor: creatednote.color, padding: "12px" }}>
              <PinUnpinSection pin={creatednote.pin} create={true} setPin={(pin) => setCreatednote({ ...creatednote, pin: pin })} />
              <TextFieldSection  creatednote ={creatednote}  setCreatednote={(value)=> setCreatednote({...creatednote, ...value})}/>

              <div style={{ justifyContent: 'start', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
               
                {creatednote.reminder && <ReminderSection reminder={creatednote.reminder} create={true} setNote={(value) => setCreatednote({ ...creatednote, ...value })}  />}
               
                {creatednote.labelarray?.map((label, i) => <LabelsSection create={true} key={i} labelId={label._id} title={label.label_title} labelarray={creatednote.labelarray} setNote={(value) => setCreatednote({ ...creatednote, ...value })} /> )}

                {creatednote.collabrators?.map((collabrator, i) => <CollabratorsSection create={true} setNote={(value) => setCreatednote({ ...creatednote, ...value })} key={i} collabrator={collabrator} collabrators={creatednote.collabrators} />  )}

              </div>
              <FooterArea create={true} note={creatednote} setNote={(value) => setCreatednote({ ...creatednote, ...value })} onClose={() => handleOnClickAwayChange()} />
            </Card>
          }
        </Paper>

        <SnackbarMessage message={"Note Created"} openSnackbar={opensnackbar} setOpenSnackbar={() => setOpensnackbar(false)} />

      </div>
    </ClickAwayListener>
  );
};

export default CreateNote;



export const TextFieldSection = ({ setCreatednote }) => {
 
  return (
   <>
   
            <div style={{ justifyContent: "space-between", display: "flex", padding: "3%" }}>
                <TextField
                  id="standard-full-width"
                  style={{ margin: 8 }}
                  color="white"
                  placeholder="Title"
                  name="title"
                  multiline
                  fullWidth
                  margin="normal"
                  InputProps={{ disableUnderline: true }}
                  onChange={(event) => setCreatednote({  title: event.target.value })}
                />
              </div>

              <div style={{ justifyContent: "space-between", display: "flex", paddingLeft: "3%" }}>
                <TextField
                  id="standard-full-width"
                  style={{ margin: 8 }}
                  multiline
                  fullWidth
                  margin="normal"
                  InputProps={{ disableUnderline: true }}
                  color="white"
                  placeholder="Take a Note..."
                  name="takeanote"
                  onChange={(event) => setCreatednote({description: event.target.value })}
                />
              </div>
   </>
  );
};