import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useState, useCallback } from 'react';
import { TimeEntryContext } from './TimeEntryContext';
import React, { useEffect } from 'react';


function WeeklyReport() {

    // set the context
    const { timeEntries } = useContext(TimeEntryContext);

    // Initialize projectEntries and projectHours state
    const [projectEntries, setProjectEntries] = useState(() => {
        const savedProjectEntries = localStorage.getItem('projectEntries');
        return savedProjectEntries ? JSON.parse(savedProjectEntries) : {};
    });

    const [projectHours, setProjectHours] = useState(() => {
        const savedProjectHours = localStorage.getItem('projectHours');
        return savedProjectHours ? JSON.parse(savedProjectHours) : {};
    });

    // Initialize lastProcessedIndex state
    const [lastProcessedIndex, setLastProcessedIndex] = useState(() => {
        const savedLastProcessedIndex = localStorage.getItem('lastProcessedIndex');
        return savedLastProcessedIndex ? JSON.parse(savedLastProcessedIndex) : 0;
    });

    // Calculate the new state using the timeEntries, lastProcessedIndex, projectEntries, and projectHours
    // This function is memoized using useCallback to prevent unnecessary re-renders
    const calculateNewState = useCallback((timeEntries, lastProcessedIndex, projectEntries, projectHours) => {
        let newEntries = { ...projectEntries };
        let newHours = { ...projectHours };
        let newLastProcessedIndex = lastProcessedIndex;

        for (let i = newLastProcessedIndex; i < timeEntries.length; i++) {
            const entry = timeEntries[i];
            const key = entry.project; 

            if (newEntries[key]) {
                newEntries[key].push({ hours_worked: Number(entry.hours_worked), entry_timestamp: entry.entry_timestamp });
            } else {
                newEntries[key] = [{ hours_worked: Number(entry.hours_worked), entry_timestamp: entry.entry_timestamp }];
            }

            if (newHours[key]) {
                newHours[key] += Number(entry.hours_worked);
            } else {
                newHours[key] = Number(entry.hours_worked);
            }

            newLastProcessedIndex = i + 1;
        }

        return { newEntries, newHours, newLastProcessedIndex };
    }, []);

    // Update the projectEntries, projectHours, and lastProcessedIndex states
    // when the timeEntries or lastProcessedIndex change
    useEffect(() => {
        const { newEntries, newHours, newLastProcessedIndex } = calculateNewState(timeEntries, lastProcessedIndex, projectEntries, projectHours);

        setProjectEntries(newEntries);
        setProjectHours(newHours);
        setLastProcessedIndex(newLastProcessedIndex);

        // we can disable the eslint warning for the next line because we want to update the state
        // and not projjectEntries or projectHours
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeEntries, lastProcessedIndex, calculateNewState]);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>TimeTracker App</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Link to="/" className="btn btn-dark">Back to Home</Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default WeeklyReport;