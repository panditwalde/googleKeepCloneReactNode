import React, { useState } from "react";
import "../../Cssfile/Displaynotes.css";
import "../../Cssfile/TrashNote.css";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCardMessage, Notes, NoteDialog } from ".././NoteCard";
import SnackbarMessage from ".././SnackbarMessage";
import { ALL_NOTES } from "../../Redux/actionType";

const ArchiveNotes = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteToUpdate, setNoteToUpdate] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const dispatch = useDispatch();
  const { openDrawer, allNotes } = useSelector(state => state);


  const filteredNotes = allNotes.filter(note => note.archive && !note.pin);
  const pinnedNotes = allNotes.filter(note => note.archive && note.pin);

  return (
    <div className={openDrawer ? "draweropen" : "drawerclose"} style={{ marginTop: "9%" }}>

      <EmptyCardMessage
        archive={true}
        message="Your archived notes appear here"
        allNote={filteredNotes}
        pinUnpinArray={pinnedNotes}
      />

      <Notes
        handleDialogOpen={(note) => (setDialogOpen(!dialogOpen), setNoteToUpdate(note))}
        pin={true}
        archive={true}
        trash={false}
        isReminder={false}
      />

      <Notes
        handleDialogOpen={(note) => (setDialogOpen(!dialogOpen), setNoteToUpdate(note))}
        pin={false}
        archive={true}
        trash={false}
        isReminder={false}
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

      <SnackbarMessage
        message={snackbarMsg}
        openSnackbar={openSnackbar}
        setOpenSnackbar={() => setOpenSnackbar(false)}
      />
    </div>
  );
};

export default ArchiveNotes;
