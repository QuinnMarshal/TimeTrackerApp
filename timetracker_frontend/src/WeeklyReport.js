import { Navbar, Container, Row, Card, Col } from 'react-bootstrap';
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

    // Save the projectEntries, projectHours, and lastProcessedIndex states to localStorage
    useEffect(() => {
        console.log('projectEntries:', projectEntries);
        console.log('projectHours:', projectHours);
        console.log('lastProcessedIndex:', lastProcessedIndex);

        localStorage.setItem('projectEntries', JSON.stringify(projectEntries));
        localStorage.setItem('projectHours', JSON.stringify(projectHours));
        localStorage.setItem('lastProcessedIndex', JSON.stringify(lastProcessedIndex));
    }, [projectEntries, projectHours, lastProcessedIndex]);

    // Group the time entries by project
    // This will allow us to display the time entries by project
    const groupedEntries = timeEntries.reduce((grouped, entry) => {
        const key = entry.project;
        if (grouped[key]) {
            grouped[key].push(entry);
        } else {
            grouped[key] = [entry];
        }
        return grouped;
    }, {});

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
            <Container className="center">
                <Row className="mb-4">
                    <Col style={{ padding: '5rem' }}>
                        <h1>Weekly Entries</h1>
                        {Object.entries(groupedEntries).map(([key, entries], index) => {
                            const [project] = key.split('-');
                            return (
                                <Card key={index} className="mb-3">
                                    <Card.Header as="h2">Project: {project}</Card.Header>
                                    <Card.Body>
                                        {entries.map((entry, i) => (
                                            <Card.Text key={i}>
                                                Hours Worked: {entry.hours_worked}
                                                <br />
                                                Time: {new Date(entry.entry_timestamp).toLocaleString()}
                                            </Card.Text>
                                        ))}
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Total Weekly Hours</h1>
                        {Object.entries(groupedEntries).map(([key, entries], index) => {
                            const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours_worked), 0);
                            return (
                                <Card key={index} className="mb-3">
                                    <Card.Header as="h2">Project: {key}</Card.Header>
                                    <Card.Body>
                                        <Card.Text>Hours Worked: {totalHours}</Card.Text>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default WeeklyReport;