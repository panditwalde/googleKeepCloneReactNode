import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import { Card,InputBase,  Tooltip,  Button,  Divider,  IconButton,  Dialog,  Typography,  TextField,  Chip,  Input,  InputAdornment,  FormControl,  Checkbox,  Popover } from "@material-ui/core";
import {
  Clear as ClearIcon,
  AccountCircle as AccountCircleIcon,
  EmojiObjectsOutlined as EmojiObjectsOutlinedIcon,
  DeleteForever as DeleteForeverIcon,
  LabelOutlined as LabelOutlinedIcon,
  ArchiveOutlined as ArchiveOutlinedIcon,
  AddAlertOutlined as AddAlertOutlinedIcon,
  RestoreFromTrash as RestoreFromTrashIcon,
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
  EditOutlined as EditOutlinedIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  Search as SearchIcon,
  AddRounded as AddRoundedIcon,
  MoreVertOutlined as MoreVertOutlinedIcon
} from "@material-ui/icons";
import {  labelWithNoteAPI, labelsAPI, notesAPI } from "./Service";
import {  ALL_LABELS,  ALL_NOTES } from "../Redux/actionType";
import SnackbarMessage from "./SnackbarMessage";
import Reminder from "./Reminder";
import { Menu } from "@material-ui/core";
import PaletteOutlinedIcon from "@material-ui/icons/PaletteOutlined";
import { colorsPallete } from "../utils/util";


export  const NoteCard = ({ note,allNotes, handleDialogOpen, setOpensnackbar, setSnackbarmsg,  pinNote, trash , edit, onClose, handleUpdate}) => {
 
  const { _id, color, reminder, listOfLabels, collabrators } = note;
  const dispatch = useDispatch();  

 return (
        <Card  style={{ boxShadow: " 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)", borderRadius: "11px", backgroundColor: color, padding: "12px" }}>
       {!trash &&  <PinUnpinSection pin={pinNote} id={_id} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg} />}
        <TextFieldSection handleDialogOpen={handleDialogOpen} note={note} handleUpdate={handleUpdate} edit={edit} />

        <div style={{ justifyContent: 'start', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {reminder && <ReminderSection reminder={reminder}  id={_id} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg}/>}
          {listOfLabels?.map(label => <LabelsSection key={label._id} title={label.label_title} noteId={_id} labelId={label._id} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg} /> )}
          {collabrators?.map(collabrator =>  <CollabratorsSection key={collabrator._id} collabrator={collabrator} />)}
        </div>

        <div className="footerarea">
           <FooterArea note={note}   edit={edit} onClose={onClose} trash={trash} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg} />
        </div>
      </Card>
  );
};

export const Notes = ({ handleDialogOpen, pin, archive, trash, isReminder, isLabel, allNote }) => {

  const [opensnackbar, setOpensnackbar] = useState(false);
  const [Snackbarmsg, setSnackbarmsg] = useState('');
  const { view, allNotes } = useSelector(state => ({
    view: state.view,
    allNotes: isLabel ? allNote : state.allNotes
  }));

  const getFilteredNotes = () => {
    if (isReminder) {
      return allNotes.filter(note => note.isReminder === isReminder && !note.trash);
    } else if (isLabel) {
      return allNotes.filter(note => note.trash === trash);
    } else if (trash) {
      return allNotes.filter(note => note.trash);
    } else {
      return allNotes.filter(note => note.archive === archive && note.pin === pin && note.trash === trash);
    }
  };

  const filteredNotes = getFilteredNotes();

  return (
    <>
      {filteredNotes.length !== 0 && <ShowMessage view={view} message={pin ? "PINNED" : "OTHERS"} isReminder={isReminder} isLabel={isLabel} trash={trash} />}
      <div className={view ? "card-grid-container" : "gridview"}>
        {filteredNotes.map(note => (
          <div className="trashnoted" key={note._id}>
            <NoteCard
              pinNote={note.pin}
              note={note}
              view={view}
              handleDialogOpen={handleDialogOpen}
              trash={trash}
              allNotes={allNotes}
              setOpensnackbar={setOpensnackbar}
              setSnackbarmsg={setSnackbarmsg}
            />
          </div>
        ))}
        <SnackbarMessage message={Snackbarmsg} openSnackbar={opensnackbar} setOpenSnackbar={() => setOpensnackbar(false)} />
      </div>
    </>
  );
};

export const NoteDialog = ({ open, onClose, note,setDialogOpen, handleUpdate, setOpensnackbar, setSnackbarmsg, dispatchData }) => {
  const { view, allNotes } = useSelector(state => state);
  
  const handleClose = async () => {
    try {
      const noteId = note._id;
      if (noteId) {
        await notesAPI.update(note, noteId);
        dispatchData();
        setOpensnackbar(true);
        setSnackbarmsg("Note updated successfully");    
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      setOpensnackbar(true);
      setSnackbarmsg("Failed to update note");    
    } finally {
      setDialogOpen(false);
    }
  };


  return (
    <>
      <Dialog open={open} onClose={onClose} aria-labelledby="simple-dialog-title">
        {note && (
          <div className="trashnoted">
          <NoteCard
            pinNote={note.pin}
            note={note}
            view={view}
            edit={true}
            onClose={handleClose}
            handleUpdate={handleUpdate}
            allNotes={allNotes}
            setOpensnackbar={(value) => setOpensnackbar(value)}
            setSnackbarmsg={(message) => setSnackbarmsg(message)}
          />
          </div>
        )}
      </Dialog>
    </>
  );
}

export const EmptyCardMessage = ({ allNote, pinUnpinArray, note, reminder, archive, label, trash }) => {
  if (allNote?.length !== 0 || pinUnpinArray.length !== 0) return null;

  const renderMessage = (icon, message) => (
    <>
      {icon}
      <b>{message}</b>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: ".3",
        width: "800px",
        alignItems: "center",
        paddingTop: "19%"
      }}
    >
      {note && renderMessage(<EmojiObjectsOutlinedIcon style={{ fontSize: "7.5rem" }} />, "Your notes appear here")}
      {reminder && renderMessage(<AddAlertOutlinedIcon style={{ fontSize: "7.5rem" }} />, "Notes with upcoming reminders appear here")}
      {archive && renderMessage(<ArchiveOutlinedIcon style={{ fontSize: "7.5rem" }} />, "Your archived notes appear here")}
      {label && renderMessage(<LabelOutlinedIcon style={{ fontSize: "7.5rem" }} />, "No notes with this label yet")}
      {trash && renderMessage(<DeleteForeverIcon style={{ fontSize: "7.5rem" }} />, "No notes in Trash")}
    </div>
  );
};

export const ShowMessage = ({ message, isReminder, isLabel, trash, view }) => <div className="message" style={{marginLeft: !view && "0px"}}>{!isReminder && !isLabel && !trash && message}</div>

export const ReminderSection = ({ reminder, id, allNotes,dispatch, setOpensnackbar, setSnackbarmsg,create,setNote }) => {

  const handleRemoveReminder = async () => {
    if (!create) {

      try {
        await notesAPI.update({reminder:null, isReminder:false},  id);
        dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === id ? { ...note, reminder:null, isReminder:false} : note) });
        setOpensnackbar(true);
        setSnackbarmsg("Remove reminder");
      } catch (error) {
        console.error("Error removing reminder:", error);
      }
      
    } else {
      setNote({reminder:null, isReminder:false})
    }

  };

  return (
          <Chip label={reminder}  onDelete={() => handleRemoveReminder()}  variant="outlined"  avatar={<AccessTimeIcon />}/>
  )

}

export const LabelsSection = ({title,  labelId, noteId, allNotes,dispatch, setOpensnackbar, setSnackbarmsg,create,setNote,labelarray }) => {

  const handleDeleteLabel = async () => {
    if (!create) {

      try {
        await labelWithNoteAPI.update(labelId,noteId, false);
        setOpensnackbar(true);
        setSnackbarmsg('Label removed');
        dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === noteId ? { ...note, listOfLabels:note.listOfLabels.filter((label)=>label._id!==labelId)} : note) });
  
      } catch (error) {
        console.error("Error removing label:", error);
      }
      
    } else {
      setNote({labelarray:labelarray.filter((label)=>label._id!==labelId)})
      
    }
  
  };


  return (
    <div style={{ paddingLeft: '5%', paddingBottom: '3%' }} className="hoverChip">
      <Chip size="small" label={title} style={{ width: "fit-content" }} icon={
        <div className="clearButton">
          <Tooltip title=" Remove label">
            <ClearIcon onClick={() => handleDeleteLabel()} fontSize="small" />
          </Tooltip>
        </div>
      } clickable={true} />
    </div>
  )

}

export const CollabratorsSection = ({collabrator}) => {

  return (
    <div style={{ paddingLeft: '5%', paddingBottom: '3%' }}>
    <Tooltip title={collabrator}>
      <AccountCircleIcon />
    </Tooltip>
  </div>
  )

}

export const PinUnpinSection = ({pin, id, allNotes,dispatch, setOpensnackbar, setSnackbarmsg, create, setPin})=>{

  const handlepinunpin = async (id, pin) => {
    if (create) {
      setPin( !pin);     
    }
    else{

      try {
        await notesAPI.update({ pin: !pin }, id);
        let updatednotes =allNotes.map(note => note._id === id ? { ...note, pin: !pin} : note)
        dispatch({ type: ALL_NOTES, payload: updatednotes});
        setOpensnackbar(true);
        setSnackbarmsg("Pin changed");
      } catch (error) {
        console.error("Error changing pin:", error);
      }

    }
  
  };

  return(
    <div style={{display:'flex', justifyContent:"flex-end"}}>
    <Tooltip title={pin ? "unpin note " : "pin note"}  onClick={() => handlepinunpin(id, pin)} >
      {
        pin ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="#000" d="M17 4a2 2 0 0 0-2-2H9c-1.1 0-2 .9-2 2v7l-2 3v2h6v5l1 1 1-1v-5h6v-2l-2-3V4z" />
          </svg>
          :

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
            <path fill="none" d="M0 0h24v24H0z" />
            <path fill="#000" d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
          </svg>
      }

    </Tooltip>
  </div>
  )

}

export const TextFieldSection = ({ handleDialogOpen, note, trash, edit, handleUpdate }) => {
  const { title, description } = note;

  const renderTextField = (name, value) => (
    <TextField
      id={name}
      name={name}
      style={{ margin: 8 }}
      value={value}
      multiline
      fullWidth
      margin="normal"
      InputProps={{ disableUnderline: true }}
      onChange={ edit && handleUpdate}
    />
  );

  return (
    <div onClick={() => !trash && !edit && handleDialogOpen(note)}>
     
            {renderTextField('title', title)}
            {renderTextField('description', description)}        
    </div>
  );
};

export const RestoreTrash = ({ noteId,allNotes, dispatch, setOpensnackbar, setSnackbarmsg }) => {

  const handleRestoreNoteChange = async () => {
    setOpensnackbar(true);
    setSnackbarmsg("");
    try {
      await notesAPI.update({ trash: false }, noteId);
      setSnackbarmsg("Note restored successfully");
      dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === noteId ? { ...note, trash: false } : note) });

    } catch (error) {
      setSnackbarmsg("Failed to restore note");
    }
  };

  return(
  <div>
    <Tooltip title="Restore">
      <RestoreFromTrashIcon style={{ paddingLeft: "22px" }} onClick={() => handleRestoreNoteChange()} />
    </Tooltip>
  </div>)
};

export const DeleteNotePermanent = ({ noteId,allNotes, dispatch, setOpensnackbar, setSnackbarmsg  }) => {

  const handleDeleteNoteChange = async () => {
    setOpensnackbar(true);
    setSnackbarmsg("");
    try {
      await notesAPI.update(noteId);
      setSnackbarmsg("Note deleted successfully");
      dispatch({ type: ALL_NOTES, payload: allNotes.filter((note)=> note._id!==noteId)});
    } catch (error) {
      setSnackbarmsg("Failed to delete note");
    }
  };

 return( 
 <div>
    <Tooltip title="Delete Forever">
      <DeleteForeverIcon onClick={() => handleDeleteNoteChange()} />
    </Tooltip>
  </div>)
};

export const ClearIconWithTooltip = ({ onClick }) => (
  <Tooltip title="Cancel">
    <ClearIcon style={{ paddingTop: "10px" }} onClick={onClick} />
  </Tooltip>
);

export const CheckIconWithTooltip = ({ onClick }) => (
  <Tooltip title="Create label">
    <CheckIcon style={{ paddingLeft: "5%", paddingTop: "10px" }} onClick={onClick} />
  </Tooltip>
);

export const LabelDeleteIcon = ({ label, handleDeleteChange, setOpenDeleteTooltip, openDeleteTooltip }) => (
  <span>
    <div onMouseOver={() => setOpenDeleteTooltip(true)} onMouseLeave={() => setOpenDeleteTooltip(false)}>
      <Typography>
        <div style={{lineHeight:'3.7'}}>
          {!openDeleteTooltip ? (
            <LabelIcon style={{ paddingTop: "5%" }} />
          ) : (
            <Tooltip title="Delete Label">
              <DeleteIcon
                style={{ paddingTop: "5%" }}
                onClick={() => handleDeleteChange(label._id)}
              />
            </Tooltip>
          )}
        </div>
      </Typography>
    </div>
  </span>
);

export const LabelRow = ({ label, editMode, editLabelValue, setEditLabelValue, setEditLabelId, handleDeleteChange, handleToggleEditMode, setOpenDeleteTooltip, openDeleteTooltip }) => (
  <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "5%" }}>
    <LabelDeleteIcon label={label} handleDeleteChange={handleDeleteChange} setOpenDeleteTooltip={setOpenDeleteTooltip} openDeleteTooltip={openDeleteTooltip} />
    <EditableLabelField label={label} editLabelValue={editLabelValue} setEditLabelValue={setEditLabelValue} setEditLabelId={setEditLabelId} />
    <EditIconWithTooltip label={label}  editMode={editMode} handleToggleEditMode={handleToggleEditMode} setEditLabelId={setEditLabelId} />
  </div>
);

export const EditableLabelField = ({ label, setEditLabelValue, setEditLabelId }) => (

  <span onClick={() => setEditLabelId(label._id)}>
    <TextField
      id="standard-full-width"
      style={{ margin: 8 }}
      defaultValue={label.label_title}
      multiline
      fullWidth
      margin="normal"
      InputProps={{ disableUnderline: true }}
      onChange={(event) => setEditLabelValue(event.target.value)}
    />
  </span>
);

export const EditIconWithTooltip = ({ editMode, handleToggleEditMode, setEditLabelId, label }) => (
  <Tooltip title={editMode ? "Save changes" : "Rename label"}>
    {editMode ? (
      <CheckIcon style={{ paddingLeft: "5%", paddingTop: "10px" }} onClick={handleToggleEditMode} />
    ) : (
      <EditOutlinedIcon style={{ paddingTop: "5%" }} onClick={()=>{
        handleToggleEditMode()
        setEditLabelId(label._id)

      }
       } 
        />
    )}
  </Tooltip>
);

export const AddLabel = ({ noteId, create, labelArray, setNote }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [labelValue, setLabelValue] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { allLabels } = useSelector(state => state);

  const handleAddLabel = async (label) => {
    try {
      if (!create) {
        await labelWithNoteAPI.update(label._id, noteId, true);
        setOpenSnackbar(true);
        let notes =  await notesAPI.get();
        dispatch({ type: ALL_NOTES, payload: notes.data.data});
      } else {
        setNote({ labelArray: [...labelArray, label] });
      }
      setLabelValue("");
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  const handleLabelAddChange = async () => {
    try {
      const labelBody = {
        label_title: labelValue,
        noteid: noteId
      };
      await labelWithNoteAPI.add(labelBody);
      dispatch({ type: ALL_LABELS, payload: await labelsAPI.get() });
      dispatch({ type: ALL_NOTES, payload: await notesAPI.get() });
      setOpenSnackbar(true);
      setLabelValue("");
    } catch (error) {
      console.error("Error adding label with note:", error);
    }
  };

  return (
    <div>
      <div
        aria-owns={anchorEl ? "simple-popper" : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        style={{ paddingRight: "12px" }}
      >
        Add label
      </div>
      <Popover
        id="simple-popper"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div style={{ padding: "4.5%" }}>
          <div>Label note</div>
          <div>
            <FormControl>
              <Input
                placeholder="Enter label name"
                onChange={(event) => setLabelValue(event.target.value)}
                value={labelValue}
                fullWidth
                margin="normal"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </div>
          <div>
            {allLabels.map(label => (
              <div key={label._id}>
                <Checkbox onClick={() => handleAddLabel(label)} />
                {label.label_title}
              </div>
            ))}
          </div>
          <Divider />
          {labelValue && (
            <div>
              <IconButton onClick={handleLabelAddChange}>
                <AddRoundedIcon />
              </IconButton>
              Create <b>{labelValue}</b>
            </div>
          )}
        </div>
      </Popover>

      <SnackbarMessage
        message={"New label created"}
        openSnackbar={openSnackbar}
        setOpenSnackbar={() => setOpenSnackbar(false)}
      />
    </div>
  );
};

export const ShowMoreOptions = ({ noteId, onSelectLabel, create, labelArray, setNote }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [opensnackbar, setOpensnackbar] = useState(false);
  const dispatch = useDispatch();
  const { allNotes } = useSelector(state => state);

  const handleDeletenoteChange = async () => {
    try {
      await notesAPI.update({ trash: true }, noteId);
      setOpensnackbar(true);
      dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === noteId ? { ...note, trash: true } : note) });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className={"footerpadding"}>
      <Tooltip title="More">
        <MoreVertOutlinedIcon onClick={(event) => setAnchorEl(event.currentTarget)} />
      </Tooltip>

      <Popover
        style={{ top: "18px", left: "40px", width: "150px" }}
        id="simple-popper"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Typography  style={{ display: "flex", justifyContent: "start", flexDirection: "column", width: "91px", margin:"5px" }}>
          {!create && <div onClick={handleDeletenoteChange} style={{ paddingBottom: "10%", cursor: 'pointer' }}>Delete note</div>}
          <AddLabel noteId={noteId} onSelectLabel={onSelectLabel} create={create} labelArray={labelArray} setNote={setNote} />
        </Typography>
      </Popover>

      <SnackbarMessage message={"Note added to trash"} openSnackbar={opensnackbar} setOpenSnackbar={() => setOpensnackbar(false)} />
    </div>
  );
};

export const  FooterArea=({ note, handleReminder, onClose, edit, trash, dispatch, allNotes, setOpensnackbar, setSnackbarmsg, create, setNote })=> {
  const renderFooterOptions = () => {
    if (!trash) {
      return (
        <div style={{ justifyContent: "space-between", display: "flex", paddingTop: "13px", paddingBottom: "13px" }}>
          <Reminder noteId={note?._id} onSelectReminder={handleReminder} create={create} setNote={setNote} />
          <Collaborator noteId={note?._id} collbrators={note?.collabrators} create={create} setNote={setNote} />
          <SetColor noteId={note?._id} setNote={setNote} create={create} />
          <Archive noteId={note?._id} archive={note?.archive} setNote={setNote} create={create} />
          <Tooltip title="More">
            <ShowMoreOptions noteId={note?._id} labelarray={note?.labelarray} create={create} setNote={setNote} />
          </Tooltip>
          {(edit || create) && <Button onClick={onClose}>Close</Button>}
        </div>
      );
    } else {
      return (
        <div style={{ justifyContent: "space-start", display: "flex", padding: "12px", paddingBottom: "13px" }}>
          <DeleteNotePermanent noteId={note._id} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg} />
          <RestoreTrash noteId={note._id} dispatch={dispatch} allNotes={allNotes} setOpensnackbar={setOpensnackbar} setSnackbarmsg={setSnackbarmsg} />
        </div>
      );
    }
  };

  return renderFooterOptions();
}

export const Archive = ({ noteId, archive, create, setNote }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const {  allNotes } = useSelector(state => state);

  
  const handleArchiveChange = async () => {
    if (create) {
      setNote({ archive: !archive })
    }
    else
    {
      try {
        await notesAPI.update({ archive: !archive }, noteId);
        dispatch({ type: ALL_NOTES, payload:  allNotes.map(note => note._id === noteId ? { ...note, archive: !archive} : note) });
        setOpenSnackbar(true);
      } catch (error) {
        console.log("error", error.message);
      }
    }      
  };

  return (

    <div className={"footerpadding"}>
      <Tooltip title={!archive ? "Archive" : "UnArchive"}>
        <ArchiveOutlinedIcon onClick={handleArchiveChange} />
      </Tooltip>

      <SnackbarMessage
        message={!archive ? "Note Archived" : "Note UnArchived"}
        openSnackbar={openSnackbar}
        setOpenSnackbar={() => setOpenSnackbar(false)}
      />
    </div>
  );
};

export const SetColor = ({ noteId, create, setNote }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { allNotes } = useSelector(state => state);

  const handleColorChange = async (usercolor) => {
    if (!create) {

      try {
        await notesAPI.update({ color: usercolor.colorCode }, noteId);
        dispatch({ type: ALL_NOTES, payload:  allNotes.map(note => note._id === noteId ? { ...note, color: usercolor.colorCode } : note) });
      
      } catch (error) {
        console.error("Error occurred while changing color:", error);
      }
      
    } else {
      setNote({ color: usercolor.colorCode })
    }
   
  };

  return (
    <div >
      <Tooltip title="Change color">
        <PaletteOutlinedIcon onClick={(event)=> setAnchorEl(event.currentTarget)} />
      </Tooltip>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={()=> setAnchorEl(null)}
        style={{ borderRadius: '10%',top:'4%' }}
      >
        <div
          style={{
            position: "relative",
            width: "120px",
            margin: "auto",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row"
          }}
        >
          {colorsPallete.map((usercolor, index) => (
            <div key={index} style={{ padding: "3px" }}>
              <IconButton
                onClick={()=>handleColorChange(usercolor) }
                style={{ backgroundColor: usercolor.colorName }}
              ></IconButton>
            </div>
          ))}
        </div>
      </Menu>
    </div>
  );
};

export const Collaborator = ({noteId, collbrators,create,setNote}) => {
  const [newColaborator, setNewColaborator] = useState("");
  const [opensnackbar, setOpenSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const {  allNotes } = useSelector(state => state);

  const handleRemoveCollaborator = async (colId) => {
    if (!create) {
      try {
        await notesAPI.collaborator(colId, noteId, false );
        dispatch({ type: ALL_NOTES, payload: allNotes.map(note => note._id === noteId ? { ...note, collabrators:note.collabrators.filter((collabrator)=>collabrator!==colId)} : note) });
        setOpenSnackbar(true);
        setMessage('Collaborator removed');
      } catch (error) {
        console.log("not remove");
      }
      
    } else {

      setNote({collabrators: collbrators.filter((collabrator)=>collabrator!==colId)})

    }
 
  };

  const handleAddCollaborator = async () => {

    if (!create) {

      try {
        await notesAPI.collaborator(newColaborator, noteId,true);
        setOpenSnackbar(true);
        dispatch({ type: ALL_NOTES, payload:  allNotes.map(note => note._id === noteId ? { ...note, collabrators: [...collbrators,newColaborator] } : note) });
  
        setMessage('New collaborator created');
        setNewColaborator("");
      } catch (error) {
        console.log("not add collaborator");
      }
      
    } else {
      setNote({collabrators: [...collbrators,newColaborator]})
      setNewColaborator("");


      
    }
   
  };

  return (
    <React.Fragment>
      <div className={"footerpadding"}>
        <Tooltip title="Collaborator" onClick={() => setOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#000"
          >
            <path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H3v-.99C3.2 16.29 6.3 15 9 15s5.8 1.29 6 2v1zm3-4v-3h-3V9h3V6h2v3h3v2h-3v3h-2z" />
          </svg>
        </Tooltip>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="max-width-dialog-title"
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "600px",
            flexDirection: "column"
          }}
        >
          <span style={{ padding: "2%", fontSize: "large", fontFamily: "inherit", fontStyle: "unset" }}>
            <b>Collaborators</b>
          </span>
          <Divider />
          <div style={{ padding: '2%', display: 'flex', flexDirection: 'column', rowGap: '17px' }}>
            <div style={{ display: 'flex' }}>

              <Avatar
                alt={localStorage.getItem("Name")}
                src={localStorage.getItem("ProfilePic")}
              />

              <span style={{ lineHeight: '2.5', marginLeft: "13px" }} >
                <b>{localStorage.getItem("Name")}(Owner)</b>
                <i>{localStorage.getItem("email")}</i>
              </span>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', rowGap: '8px'}}>
              {
                collbrators?.map((collbrator, i) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between'}} key={i}>
                    <div style={{ display: 'flex' }}><Avatar /> <b style={{ lineHeight: '2.5', marginLeft: "13px" }}>  {collbrator}</b></div>

                    <Tooltip title="delete">
                      <ClearIcon onClick={() => handleRemoveCollaborator(collbrator)} />
                    </Tooltip>

                  </div>
                ))
              }
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex' }}>
                <Avatar>
                  <PersonAddIcon />
                </Avatar>
                <div style={{ lineHeight: '2.5', marginLeft: "13px" }} >
                  <InputBase id="standard-basic" placeholder="Person or email to share with" value={newColaborator} onChange={(event) => setNewColaborator(event.target.value)} />
                </div>
              </div>
              {newColaborator && <DoneOutlinedIcon onClick={handleAddCollaborator} />}

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end " ,backgroundColor:"rgba(0, 0, 0, .07)" }} >
              <span style={{ marginRight: "56px" }} onClick={() => setOpen(false)} >
                Cancel
              </span>
              <span onClick={() => setOpen(false)}>Save</span>
            </div>
          </div>

        </div>

      </Dialog>

      <SnackbarMessage message={message} openSnackbar={opensnackbar} setOpenSnackbar={() => setOpenSnackbar(false)} />

    </React.Fragment>
  );
}