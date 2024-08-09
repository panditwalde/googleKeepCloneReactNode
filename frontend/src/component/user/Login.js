import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { userAPI } from "../Service";
import "../../Cssfile/Login.css";
import { titleData } from "../../utils/util";
import { toast } from 'react-toastify';

const Login = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "userName") setUserName(value);
    if (name === "userPassword") setUserPassword(value);
    setErrors({ ...errors, [name]: "" }); 
  };

  const handleValid = () => {
    const errors = {};
    let isValid = true;

    if (!userName.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!userPassword.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleLogin =async () => {
    if (handleValid()) {
      try {
        let response = await userAPI.login({ email: userName, password: userPassword })

        const { firstname, lastname, email, profile } = response.data.data.user;

        localStorage.setItem("Name", `${firstname} ${lastname}`);
        localStorage.setItem("Email", email);
        localStorage.setItem("ProfilePic", profile);
        localStorage.setItem("Token", response.data.data.accessToken);
        history.push("/Dashboard/note");
        
      } catch (error) {

        console.error("User login failed:", error.response.data.message);
        toast.error(error.response.data.message);
        
      }
    }
  };

  return (
    <div className="login">
      <div className="fundooLogin">
        {titleData.map(({ title, color }, index) => (
          <span key={index} style={{ color }}>{title}</span>
        ))}
      </div>
      <div className="signInLogin">
        <span>Sign in</span>
      </div>

      <div className="usernameLogin">
        <TextField
          margin="dense"
          size="small"
          name="userName"
          id="outlined-required"
          label="Username"
          variant="outlined"
          value={userName}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
      </div>
      <div className="passwordLogin">
        <TextField
          style={{ width: "100%" }}
          name="userPassword"
          margin="dense"
          size="small"
          id="outlined-adornment-password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={userPassword}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </div>

      <div className="buttonLogin">
        <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        <Button variant="contained" color="secondary" onClick={() => history.push("/register")}>Register</Button>
      </div>

      <div className="Forgotpassword">
        <Button onClick={() => history.push("/forgot-password")} style={{ textTransform: 'lowercase', color: '#0423ce' }}>Forgot Password?</Button>
      </div>
    </div>
  );
};

export default Login;
