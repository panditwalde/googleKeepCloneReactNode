import React, { useState } from "react";
import "../../Cssfile/Register.css";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
import fundoo from "../../image/account.svg";
import { userAPI } from "../Service";
import { titleData } from "../../utils/util";
import { toast } from "react-toastify";

const Register = ({ history }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    confPassword: "",
  });
  const [error, setError] = useState({});

  const alreadyRegister = () => {
    history.push("/");
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "firstName":
        return value.trim() ? "" : "First name is required";
      case "lastName":
        return value.trim() ? "" : "Last name is required";
      case "email":
        return /^\S+@\S+\.\S+$/.test(value) ? "" : "Your email address is invalid";
      case "phoneNumber":
        return /^\d{10}$/.test(value) ? "" : "Mobile number should be 10 digits";
      case "password":
        return value ? "" : "Password is required";
      case "confPassword":
        return value === formData.password ? "" : "Confirm password should match password";
      default:
        return "";
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newError = {};

    Object.entries(formData).forEach(([fieldName, value]) => {
      const errorMessage = validateField(fieldName, value);
      newError[fieldName] = errorMessage;
      if (errorMessage) {
        isValid = false;
      }
    });

    setError(newError);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {   
  
        const { firstName, lastName, email, password, phoneNumber } = formData;
  
        const response = await userAPI.register({firstName,lastName,email,password, phoneNumber});
    
        // Alert user with registration success message
        toast.success(response.data.message);
  
        // Clear form data after successful registration
        setFormData({email: "", password: "", firstName: "", lastName: "", phoneNumber: "", confPassword: "" });
  
        // Navigate user to the home page
        history.push("/");
      } catch (error) {
        toast.error(error.response.data.message);

       
      } 
    }
  };
  

  const handleDataChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });
  

  return (
    <div className="userregister">
      <div className="userfundoo">
      {
          titleData.map(({title,color},index)=>
          <span key={index} style={{ color: `${color}` }}>{title}</span>          
          )
        }
      </div>
      <div className="userSignUp">SignUp</div>
      <div className="main" style={{ flexDirection: "row" }}>
        <div>
          <div className="userfirstlastname">
            <TextField
              margin="dense"
              size="small"
              name="firstName"
              id="outlined"
              label="First Name"
              variant="outlined"
              style={{ width: "44%" }}
              onChange={handleDataChange}
              error={!!error.firstName}
              helperText={error.firstName}
            />
            <TextField
              margin="dense"
              size="small"
              name="lastName"
              required
              id="outlined"
              label="Last Name"
              variant="outlined"
              style={{ width: "44%" }}
              onChange={handleDataChange}
              error={!!error.lastName}
              helperText={error.lastName}
            />
          </div>
          <div className="useremail1">
            <TextField
              margin="dense"
              size="small"
              name="email"
              id="outlined"
              label="Email"
              variant="outlined"
              onChange={handleDataChange}
              error={!!error.email}
              helperText={error.email}
            />
          </div>
          <div className="phoneNumber">
            <TextField
              margin="dense"
              size="small"
              className="phoneNumber"
              name="phoneNumber"
              id="outlined"
              label="Phone Number"
              variant="outlined"
              onChange={handleDataChange}
              error={!!error.phoneNumber}
              helperText={error.phoneNumber}
            />
          </div>
          <div className="userPassword">
            <TextField
              size="small"
              id="outlined-adornment-password"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              label="password"
              margin="dense"
              style={{ width: "44%" }}
              onChange={handleDataChange}
              error={!!error.password}
              helperText={error.password}
            />
            <TextField
              size="small"
              margin="dense"
              name="confPassword"
              id="outlined-adornment-password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              label=" confirm "
              value={formData.confPassword}
              style={{ width: "44%" }}
              onChange={handleDataChange}
              error={!!error.confPassword}
              helperText={error.confPassword}
            />
            <IconButton aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>

          <div className="userbutton">

            <Button margin="dense" size="small" variant="contained" color="primary" onClick={handleRegister}  >
              Submit
            </Button>

            <Button onClick={alreadyRegister}>
              Already Registered?
            </Button>

          </div>
        </div>

        <div className="img1">
          <img src={fundoo} width="80%" height="60%" alt="hello"/>
          <p style={{ alignItems: "center" }}> One account. All of Fundoo working for you </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
