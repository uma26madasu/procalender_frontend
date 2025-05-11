import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import MeetingViewer from './pages/MeetingViewer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-link" element={<CreateLink />} />
        <Route path="/schedule/:linkId" element={<PublicScheduler />} />
        <Route path="/view/:meetingId" element={<MeetingViewer />} />
      </Routes>
    </Router>
  );
}

export default App;