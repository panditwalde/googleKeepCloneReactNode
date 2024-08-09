import React, { useState } from "react";
import "../../Cssfile/ResetPassword.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { userAPI } from "../Service";
import { titleData } from "../../utils/util";
import { toast } from "react-toastify";

const ResetPassword = ({history}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async() => {
    if (validateForm()) {
      const token = new URLSearchParams(window.location.search).get('token');    

      try {

        let response=  await  userAPI.setNewPassword( {newPassword:password}, token)
        toast.success(response.data.message);

        history.push("/");
        
      } catch (error) {
        toast.error(error.response.data.message);
       
      }    
       
    }
  };

  return (
    <div className="resetPassword">
      <div className="fundoo1">
        {titleData.map(({ title, color }, index) => (
          <span key={index} style={{ color }}>
            {title}
          </span>
        ))}
      </div>
      <div className="resetPasswordtitle">
        <h2>
          <b>resetpassword</b>
        </h2>
      </div>

      <div className="resetpassword1">
        <TextField
          size="small"
          id="outlined-adornment-password"
          variant="outlined"
          name="password"
          type={showPassword ? "text" : "password"}
          label="password"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sytle={{ width: "1px" }}></InputAdornment>
            ),
          }}
          value={password}
          onChange={handlePasswordChange}
          error={!!errors.password}
          helperText={errors.password}
        />
      </div>

      <div className="password2">
        <TextField
          size="small"
          margin="dense"
          name="confirmPassword"
          id="outlined-adornment-password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          label=" confirm "
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sytle={{ width: "1px" }}>
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="Resetbutton">
        <Button variant="contained" color="primary" onClick={handleResetPassword}>
          Submit
        </Button>
        <Button variant="contained" color="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
