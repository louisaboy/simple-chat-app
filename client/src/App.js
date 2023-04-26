// LIBRARIES
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// COMPONENTS
import LoginComponent from './Login';
import RegisterComponent from './Register';
import ChatFrameComponent from './ChatFrame';
// import ChatHistory from '../components/ChatHistory';
// import ContactList from '../components/ContactList';
// import ChatPreviewList from '../components/ChatPreviewList';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    console.log(`user here: ${user.username}`);
    setUser(user)
  }
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element= {<LoginComponent onLogin={handleLogin}/>} /> 
          <Route path="/register" element= {<RegisterComponent/>} /> 
          <Route path="/chat" element={user ? <ChatFrameComponent user={user} />: <Navigate to="/"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
