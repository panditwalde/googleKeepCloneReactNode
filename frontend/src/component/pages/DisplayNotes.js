import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import CreateNote from ".././CreateNote";
import SnackbarMessage from ".././SnackbarMessage";
import { EmptyCardMessage, Notes, NoteDialog } from "../NoteCard";
import { ALL_NOTES } from "../../Redux/actionType";
import "../../Cssfile/Displaynotes.css";
import "../../Cssfile/TrashNote.css";

const DisplayNotes = () => {
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notearr, setNotearr] = useState(null);
  const [opensnackbar, setOpensnackbar] = useState(false);
  const [Snackbarmsg, setSnackbarmsg] = useState('');
  const dispatch = useDispatch();
  const { openDrawer, allNotes } = useSelector(state => state); 

  return (
    <div className={openDrawer ? "draweropen" : "drawerclose"}>

      <CreateNote  allNote={allNotes.filter(note => !note.archive && !note.trash )} />
      <EmptyCardMessage note={true}  allNote={allNotes.filter(note => !note.archive && !note.trash && !note.pin)} pinUnpinArray={allNotes.filter(note => !note.archive && !note.trash && note.pin)} />
    
      <Notes
        handleDialogOpen={(note)=> (setDialogOpen(!dialogOpen), setNotearr(note) )}     
        archive={false}
        pin={true}
        trash={false}
      />

      <Notes
        handleDialogOpen={(note)=> (setDialogOpen(!dialogOpen), setNotearr(note) )}     
        archive={false}
        pin={false}
        trash={false}
      />

      <NoteDialog
        open={dialogOpen}
        note={notearr}
        handleUpdate={(event)=> setNotearr({ ...notearr, [event.target.name]: event.target.value })}   
        setDialogOpen={setDialogOpen} 
        setOpensnackbar={setOpensnackbar} 
        setSnackbarmsg={setSnackbarmsg} 
        dispatchData={()=> dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === notearr._id ? { ...notearr} : note) })}
      />     

      <SnackbarMessage message={Snackbarmsg} openSnackbar={opensnackbar} setOpenSnackbar={()=>setOpensnackbar(false)}  />

    </div>
  );
};

export default DisplayNotes;
