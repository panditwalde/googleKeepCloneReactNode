import React from "react";
import { useSelector } from 'react-redux';
import { EmptyCardMessage, Notes } from "../NoteCard";

const TrashNote = () => {
  const { openDrawer, allNotes } = useSelector(state => state);
  const filteredNotes = allNotes.filter(note => note.trash && !note.pin);
  const pinnedNotes = allNotes.filter(note => note.trash && note.pin);

  return (
    <div className={openDrawer ? "draweropen" : "drawerclose"} style={{ marginTop: "9%" }}>
      <EmptyCardMessage trash={true} allNote={filteredNotes} pinUnpinArray={pinnedNotes} />
      <Notes trash={true} />
    </div>
  );
};

export default TrashNote;
