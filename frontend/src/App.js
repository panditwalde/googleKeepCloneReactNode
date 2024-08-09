import React from "react";
import { Provider } from 'react-redux';
import store from './Redux/Store';
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// Importing Components
import Login from './component/user/Login';
import ForgotPassword from './component/user/ForgotPassword';
import ResetPassword from './component/user/ResetPassword';
import Register from './component/user/Register';
import Dashboard from './component/pages/Dashboard';
import TrashNote from './component/pages/TrashNote';
import DisplayAllReminder from './component/pages/Displayallreminder';
import ArchiveNotes from './component/pages/ArchiveNotes';
import SearchUserNote from './component/pages/SearchUserNote';
import DisplayNoteWithLabel from './component/pages/DisplayNoteWithLabel';
import DisplayNotes from './component/pages/DisplayNotes';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
         <Routes/>
      </div>
    </Provider>
  );
}

export default App;


const isAuthenticated = () => {

  return localStorage.getItem("Token") ? true :false
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
 return (
   <Route
     {...rest}
     render={(props) =>
       isAuthenticated() ? (
         <Component {...props} />
       ) : (
         <Redirect to="/login" />
       )
     }
   />
 );
};

function Routes() {
 return (
   <Router>
     <Route path="/" exact component={Login} />
     <Route path="/login" exact component={Login} />
     <Route path="/register" component={Register} />
     <Route path="/forgot-password" component={ForgotPassword} />
     <Route path="/reset-password" component={ResetPassword} />

     <ProtectedRoute path="/Dashboard" component={Dashboard} />
     <ProtectedRoute path="/Dashboard/note" component={DisplayNotes} />
     <ProtectedRoute path="/Dashboard/reminder"   component={DisplayAllReminder} />
     <ProtectedRoute path="/Dashboard/trash" component={TrashNote} />
     <ProtectedRoute path="/Dashboard/archive" component={ArchiveNotes} />
     <ProtectedRoute path="/Dashboard/search" component={SearchUserNote} />
     <ProtectedRoute path="/Dashboard/label/:label" component={DisplayNoteWithLabel} />
   </Router>
 );
}