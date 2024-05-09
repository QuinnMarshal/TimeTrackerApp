
import './App.css';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Link from 'react-bootstrap/Link';

// axois configuration
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.withCredentials = true;

// create axios users
const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { Authorization: `Token ${localStorage.getItem('token')}` }
});

const registerClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/accounts/register/',
});

const loginClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

function App() {

  const [currentUser, setCurrentUser] = useState(false);
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      client.get('/accounts/user/'
      ).then(function (res) {
        setCurrentUser(true);
      }).catch(function (error) {
        setCurrentUser(false);
      })
    }
  }, []);

  function submitRegistration(e) {
    e.preventDefault();

    registerClient.post('/', {
      email: email,
      username: username,
      password: password
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
      console.log(res)
      // Create a new axios instance with the token from the registration response
      const client = axios.create({
        baseURL: 'http://127.0.0.1:8000/',
        headers: { Authorization: `Token ${res.data.token}` }
      });

      client.post('/accounts/login/', {
        email: email,
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' }
      }).then(function (res) {
        localStorage.setItem('token', res.data.token);
        setCurrentUser(true);
      })
    }).catch(function (error) {
      if (email === '' || username === '' || password === '') {
        alert('Please fill in all fields');
      } else if (password.length < 8) {
        alert('Password must be at least 8 characters long');
      } else if (email.exists) {
        alert('An account with this email already exists');
      } else {
        alert('An account with this username or email already exists');
      }
    })
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  function submitLogin(e) {
    e.preventDefault();

    const csrftoken = getCookie('csrftoken');

    loginClient.post('/accounts/login/', {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
      }
    }).then(function (res) {
      localStorage.setItem('token', res.data.token);
      setCurrentUser(true);
    }).catch(function (error) {
      alert('Invalid credentials');
    })
  }

  function submitLogout(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const csrftoken = getCookie('csrftoken');  // Get CSRF token from cookie
    client.post('/accounts/logout/', {}, {
      headers: {
        Authorization: `Token ${token}`,
        'X-CSRFToken': csrftoken
      }
    }).then(function (res) {
      localStorage.removeItem('token');
      localStorage.removeItem('timeEntries');
      setCurrentUser(false);
    })
  }

  function update_form_btn() {
    setRegistrationToggle(!registrationToggle);
  }

  if (currentUser) {

    return (
      <div>
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>TimeTracker App</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text style={{ padding: '1rem' }}>
                <Link to="/weekly-report" className="btn btn-dark">Weekly Report</Link>
              </Navbar.Text>
              <Navbar.Text>
                <Form onSubmit={e => submitLogout(e)}>
                  <Button type="submit" variant="dark">Log out</Button>
                </Form>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="center">
          <h2>You're logged in!</h2>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>TimeTracker App</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button id="form_btn" onClick={update_form_btn} variant="light">
                {registrationToggle ? "Login" : "Register"}
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {
        registrationToggle ? (
          <div className="center">
            <Form onSubmit={e => submitRegistration(e)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        ) : (
          <div className="center">
            <Form onSubmit={e => submitLogin(e)}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        )
      }
    </div>
  );
}

export default App;
