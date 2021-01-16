import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

import { HomePage, LoginPage, RegisterPage, UsersPage } from './pages';
import { getAuthToken, removeAuthToken } from './api/auth';
import { WebAppClient } from './api/client';
import { User } from './api/user';


export const App: React.FunctionComponent = ()=> {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const isLoggedIn = getAuthToken() != null;
    
        if (isLoggedIn && user === undefined) {
            WebAppClient.getMe(response => {
                setUser({...response});
            });
        }
    });

    return (
        <Router>
            <div>
                <Navbar>
                    <Nav>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/">Home Page</Nav.Link>
                        </Nav.Item>
                        {user?.accessLevel === 3
                            ? <>
                                <Nav.Item>
                                    <Nav.Link  as={Link} to="/users">All Users</Nav.Link>
                                </Nav.Item>
                            </>
                            : <></>
                        }
                        <Nav.Item>
                            <Nav.Link as={Link} to="/contests">Contests</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/my-contests">My Contests</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {user 
                                ? <>
                                    <Nav.Item>
                                        <Nav.Link onClick={() => {
                                            removeAuthToken();
                                            window.location.reload();
                                        }}>Logout</Nav.Link>
                                    </Nav.Item>
                                </>
                                :  <>
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                    </Nav.Item>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch>

                    <Route path="/" exact>
                        <HomePage user={user} />
                    </Route>

                    <Route path="/users" >
                        <UsersPage user={user} />
                    </Route>

                    <Route path="/login">
                        <LoginPage user={user} />
                    </Route>
                    <Route path="/register">
                        <RegisterPage user={user} />
                    </Route>

                </Switch>
            </div>
        </Router>
    );
};
