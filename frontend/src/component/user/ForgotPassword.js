import React, { useState } from 'react';
import '../../Cssfile/ForgotPassword.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {  userAPI } from '../Service';
import { titleData } from "../../utils/util";
import { toast } from 'react-toastify';

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(null); // Resetting error message when email is changed
  };

  const handleForgotPassword = async() => {
    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(email)) {
      setError("Your email address is invalid");
      return; // Stop further execution if email is invalid
    }

    try {

      let response= await  userAPI.forgotPassword(email);
      toast.success(response.data.message);
      
    } 
    catch (error) {

      toast.error(error.response.data.message);

      
    }
  }
   
     

  return (
    <div className="userForgotPassword">
      <div className="fundooLogin">
        {titleData.map(({ title, color }, index) =>  <span key={index} style={{ color }}>{title}</span> )}
      </div>
      <div className="ForgotPasswordtitle">Forgot Password</div>

      <div className="emailtext">
        <TextField
          id="outlined-search"
          margin="dense"
          size="small"
          label="Enter the Email id"
          type="search"
          variant="outlined"
          name="email"
          value={email}
          onChange={handleEmailChange}
          error={!!error}
          helperText={error}
        />
      </div>
      <div className="forgotbutton">
        <Button variant="contained" color="primary" onClick={handleForgotPassword}>
          Submit
        </Button>
        <Button variant="contained" color="secondary" onClick={()=> history.push("/") }>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
