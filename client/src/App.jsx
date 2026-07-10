import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseTemple from './pages/BrowseTemple';

function App() {

  return (
    <>
      <Routes>
        <Route path='' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signin' element={<Register />} />
        <Route path='/temples' element={<BrowseTemple />} />
      </Routes>
    </>
  )
}

export default App