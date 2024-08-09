import React, { useState } from "react";
import "../../Cssfile/Displaynotes.css";
import CreateNote from ".././CreateNote";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCardMessage, Notes, NoteDialog } from "../NoteCard";
import SnackbarMessage from "../SnackbarMessage";
import { ALL_NOTES } from "../../Redux/actionType";

const DisplayNotes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const dispatch = useDispatch();
  const { openDrawer, allNotes } = useSelector(state => state);
  const filteredReminderNotes = allNotes.filter(note => note.isReminder && !note.trash);

  return (
    <div className={openDrawer ? "draweropen" : "drawerclose"}>

      <CreateNote allNote={filteredReminderNotes} />
      <EmptyCardMessage reminder={true} allNote={filteredReminderNotes} pinUnpinArray={filteredReminderNotes} />

      <Notes
        handleDialogOpen={(note) => (setDialogOpen(!dialogOpen), setNoteToUpdate(note))}
        archive={false}
        pin={false}
        trash={false}
        isReminder={true}
      />

      <NoteDialog
        open={dialogOpen}
        note={noteToUpdate}
        handleUpdate={(event) => setNoteToUpdate({ ...noteToUpdate, [event.target.name]: event.target.value })}
        setDialogOpen={setDialogOpen}
        setOpensnackbar={setOpenSnackbar}
        setSnackbarmsg={setSnackbarMsg}
        dispatchData={() => dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === noteToUpdate._id ? { ...noteToUpdate } : note) })}
      />

      <SnackbarMessage message={snackbarMsg} openSnackbar={openSnackbar} setOpenSnackbar={() => setOpenSnackbar(false)} />

    </div>
  );
}

export default DisplayNotes;
