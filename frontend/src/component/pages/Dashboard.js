import React, { useCallback, useEffect } from "react";
import "../../Cssfile/Dashboard.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import keeplogo from "../../image/keeplogo.png";
import keep1 from "../../image/1.svg";
import gridview from "../../image/gridview.svg";
import SearchIcon from "@material-ui/icons/Search";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import Profile from "../../component/Profile";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import MyDrawer from ".././MyDrawer";
import TextField from "@material-ui/core/TextField";
import { Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {  notesAPI,labelsAPI } from ".././Service";
import { debounce } from 'lodash'; 
import { ALL_LABELS, ALL_NOTES, TOGGLE_VIEW } from "../../Redux/actionType";

const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paper: {
        top: "13%"
      }
    },
    PersistentDrawerLeft: {
      drawer: {
        width: "0px"
      }
    }
  }
});

const Dashboard = (props) => {
  const view = useSelector(state => state.view);
  const dispatch = useDispatch();

  const getAllData = async () => {
    try {
      const [labelResponse, noteResponse] = await Promise.all([labelsAPI.get(), notesAPI.get()]);
      dispatch({ type: ALL_LABELS, payload: labelResponse.data.data });
      dispatch({ type: ALL_NOTES, payload: noteResponse.data.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };;
 
  useEffect(() => { 
   
    getAllData(); 
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced search function
  const debouncedSearchNote = useCallback(
    debounce(async (value) => {
      try {
        let response = await notesAPI.search(value);
        props.history.push({
          pathname: "/dashboard/search",
          state: { allNote: response.data.data }
        });
      } catch (error) {
        console.error("Error searching notes:", error);
      }
    }, 300),
    []
  );

  const handleSearchChange = (event) => {debouncedSearchNote(event.target.value)};

  const handleLabelClick = (label) =>  props.history.push({  pathname: "/dashboard/label/" + label.label_title,  state: { label: label } });

  return (
    <div className="mainDashboard">
      <MuiThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar className="toolbar" style={{ backgroundColor: "white" }}>
            <div className="keepAndLogo">
              <div>
                <MyDrawer handleLabelClick={handleLabelClick} history={props.history} />
              </div>
              <img src={keeplogo} width="50px" height="50px" alt="Fundoo Logo"></img>
              <Typography className="keep" variant="h6" color="inherit" noWrap>
                <b style={{ marginLeft: "2%" }}>Fundoo</b>
              </Typography>
            </div>

            <div className="dashboardSearch">
              <div className="dashboardsearchicon">
                <SearchIcon onClick={(handleSearchChange)} />
              </div>
              <div style={{ width: "90%" }}>
                <TextField
                  color="white"
                  placeholder="Search…"
                  onChange={handleSearchChange}
                  id="standard-full-width"
                  multiline
                  fullWidth
                  margin="normal"
                  InputProps={{ disableUnderline: true  }}
                />
              </div>
            </div>

            <div className="logokeep1">
              <RefreshOutlinedIcon />
              <Tooltip title="Grid view ">
                <img
                  src={view ? keep1 : gridview}
                  width="22px"
                  height="22px"
                  alt="Grid View"
                  onClick={() => dispatch({ type: TOGGLE_VIEW })}
                />
              </Tooltip>
              <SettingsOutlinedIcon />
            </div>
              <Profile PropsDashboard={props} />
          </Toolbar>
        </AppBar>
      </MuiThemeProvider>
    </div>
  );
};

export default Dashboard;
