import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AllProjects from "./components/AllProjects";
import CreateProject from "./components/CreateProject";
import StoryboardViewer from "./components/StoryboardViewer";
import ScriptInput from "./components/ScriptInput";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import ProjectDetail from "./components/ProjectDetail";
import { initializeTheme } from "./utils/theme";
import "./components/Header.css";
import "./components/Dashboard.css";
import "./components/CreateProject.css";
import "./components/StoryboardViewer.css";

export default function App() {
  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Router>
      <Sidebar />
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/script" element={<ScriptInput />} />
          <Route path="/script/:projectId" element={<ScriptInput />} />
          <Route path="/storyboard/:storyboardId" element={<StoryboardViewer />} />
        </Routes>
      </div>
    </Router>
  );
}
