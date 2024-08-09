import React from "react";
import CreateNote from "../CreateNote";
import { Notes } from "../NoteCard";
import DisplayNotes from "./DisplayNotes";

const SearchUserNote = (props) => {
  
  const { allNote } = props.location.state;
  if (!allNote) return <DisplayNotes />;
  return (
    <div>
        <CreateNote  allNote={allNote}/>
        <Notes  archive={false} pin={false}  trash={false} />

    </div>
  );
};

export default SearchUserNote;
