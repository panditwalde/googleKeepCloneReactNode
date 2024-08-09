import React, { useState, useEffect } from "react";
import "../../Cssfile/Displaynotes.css";
import { labelWithNoteAPI } from "../../component/Service";
import "../../Cssfile/TrashNote.css";
import { useDispatch, useSelector } from "react-redux";
import SnackbarMessage from ".././SnackbarMessage";
import { EmptyCardMessage, Notes, NoteDialog } from "../NoteCard";
import { ALL_NOTES } from "../../Redux/actionType";

const DisplayNoteWithLabel = ({ match }) => {
  const [allNote, setAllNote] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notearr, setNotearr] = useState(null);
  const [opensnackbar, setOpensnackbar] = useState(false);
  const [Snackbarmsg, setSnackbarmsg] = useState('');
  const { openDrawer } = useSelector(state => state);
  const dispatch = useDispatch();

  const labelId = match.params.label;

  useEffect(() => 
  {
    labelWithNoteAPI.get(labelId).then(response => setAllNote(response.data.data))

  }, [labelId]); 


  return (
    <div className={openDrawer ? "draweropen" : "drawerclose"} style={{ marginTop: "9%" }}>
      <EmptyCardMessage label={true} allNote={allNote.filter(note => !note.trash && !note.pin)} pinUnpinArray={allNote.filter(note => !note.trash && note.pin)} />
    
      <Notes
        handleDialogOpen={(note)=> (setDialogOpen(!dialogOpen), setNotearr(note) )}     
        archive={false}
        pin={false}
        trash={false}
        isLabel={true}
        allNote={allNote}
      />

      <NoteDialog
        open={dialogOpen}
        note={notearr}
        handleUpdate={(event) => setNotearr({ ...notearr, [event.target.name]: event.target.value })}
        setDialogOpen={setDialogOpen}
        setOpensnackbar={setOpensnackbar}
        setSnackbarmsg={setSnackbarmsg}
        dispatchData={()=> dispatch({ type: ALL_NOTES, payload: allNote.map(note => note._id === notearr._id ? { ...notearr} : note) })}
      />

      <SnackbarMessage message={Snackbarmsg} openSnackbar={opensnackbar} setOpenSnackbar={() => setOpensnackbar(false)} />

    </div>
  );
};



export default DisplayNoteWithLabel;