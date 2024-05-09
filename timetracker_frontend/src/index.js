import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TimeEntryContext } from './TimeEntryContext';
import { useState } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Main() {

  const [timeEntries, setTimeEntries] = useState([]);

  return (
    <React.StrictMode>
      <Router>
        <TimeEntryContext.Provider value={{ timeEntries, setTimeEntries }}>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </TimeEntryContext.Provider>
      </Router>
    </React.StrictMode>
  );
}

root.render(<Main />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
