import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/index';
import About from './pages/about';
import Projects from './pages/projects';
import Certificates from './pages/certificates';
import Contact from './pages/contact';
import Admin from './pages/admin';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

function App() {
    return ( <
        Router >
        <
        div className = "App" >
        <
        Navbar / >
        <
        main >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        /> <
        Route path = "/about"
        element = { < About / > }
        /> <
        Route path = "/projects"
        element = { < Projects / > }
        /> <
        Route path = "/projects/:id"
        element = { < ProjectDetail / > }
        /> <
        Route path = "/certificates"
        element = { < Certificates / > }
        /> <
        Route path = "/contact"
        element = { < Contact / > }
        /> <
        Route path = "/admin"
        element = { < Admin / > }
        /> <
        /Routes> <
        /main> <
        Footer / >
        <
        /div> <
        /Router>
    );
}

export default App;