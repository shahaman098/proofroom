import React from 'react';
import {createRoot} from 'react-dom/client';
import Walkthrough from './Walkthrough';
import Demo from './Demo';
import './style.css';
import './story.css';
function App(){return <main><Walkthrough/><Demo/></main>;}
createRoot(document.getElementById('root')).render(<App/>);
