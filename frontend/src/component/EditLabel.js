import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Typography, TextField, Divider } from "@material-ui/core";
import { ALL_LABELS } from "../Redux/actionType";
import { labelsAPI } from "./Service";
import { CheckIconWithTooltip, ClearIconWithTooltip, LabelRow } from "./NoteCard";

const EditLabel = () => {
  const [createLabel, setCreateLabel] = useState("");
  const [editLabelValue, setEditLabelValue] = useState("");
  const [editLabelId, setEditLabelId] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openDeleteTooltip, setOpenDeleteTooltip] = useState(false);
  const { allLabels } = useSelector(state => state);
  const dispatch = useDispatch();
  const handleDeleteChange = async (labelId) => {
    try {
      await labelsAPI.delete(labelId);
      dispatch({ type: ALL_LABELS, payload: allLabels.filter(label => label._id !== labelId) });
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    labelsAPI.edit({ label_title: editLabelValue }, editLabelId)
      .then(() => {
        dispatch({ type: ALL_LABELS, payload: allLabels.map(label => label._id === editLabelId ? { ...label, label_title: editLabelValue } : label) });
        setEditLabelId("")
      })
      .catch((err) => {
        console.error("Error editing label:", err);
      });
  };

  const handleClickCreateLabel = () => {
    labelsAPI.create({ label_title: createLabel })
      .then((response) => {
        dispatch({ type: ALL_LABELS, payload: [...allLabels, response.data.data] });
        setCreateLabel("");
      })
      .catch((err) => {
        console.error("Error creating label:", err);
      });
  };

  return (
    <div>
      <div variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Edit labels
      </div>
      <Dialog open={open} onClose={handleClose}>
        <Typography>
          <div style={{ display: "flex", justifyContent: "space-around", flexDirection: "column", width: "120%" }}>
            <div style={{ padding: "5%" }}>
              <b>Edit Labels</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-evenly", flexDirection: "row" }}>
              <ClearIconWithTooltip onClick={() => setCreateLabel("")} />
              <TextField
                id="standard-dense"
                placeholder="Create new label"
                margin="dense"
                style={{ paddingLeft: "5%" }}
                onChange={(event) => setCreateLabel(event.target.value)}
                value={createLabel}
              />
              <CheckIconWithTooltip onClick={handleClickCreateLabel} />
            </div>
            <div>
              {allLabels.map((label) => (
                <LabelRow
                  key={label._id}
                  label={label}
                  editMode={editLabelId === label._id && editMode ? true : false}
                  editLabelValue={editLabelValue}
                  setEditLabelValue={setEditLabelValue}
                  setEditLabelId={setEditLabelId}
                  handleDeleteChange={handleDeleteChange}
                  handleToggleEditMode={()=> setEditMode(!editMode)}
                  setOpenDeleteTooltip={setOpenDeleteTooltip}
                  openDeleteTooltip={openDeleteTooltip}
                />
              ))}
            </div>
            <Divider />
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "5%", paddingBottom: "5%" }} onClick={handleClose}>
              Done
            </div>
          </div>
        </Typography>
      </Dialog>
    </div>
  );
};



export default EditLabel;
