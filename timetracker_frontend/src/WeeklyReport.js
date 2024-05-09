import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function WeeklyReport() {

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