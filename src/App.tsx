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

import { HomePage, LoginPage, RegisterPage, UsersPage, ContestsController, ContestController, MyContestsPage, ContestPage, TaskControllerPage, TaskPage, CreateTaskPage } from './pages';
import { getAuthToken, removeAuthToken } from './api/auth';
import { WebAppClient } from './api/client';
import { User } from './api/user';
import { AddParticipantController } from './pages/add-participant';


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
                    <Navbar bg="primary" variant="dark">
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
                            {user && (user?.accessLevel >= 2)
                                ? <>
                                    <Nav.Item>
                                        <Nav.Link  as={Link} to="/contests-controller">Contests Controller</Nav.Link>
                                    </Nav.Item>
                                </>
                                : <></>
                            }
                            <Nav.Item>
                                <Nav.Link as={Link} to="/contests">Contests</Nav.Link>
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

                        <Route path="/contests-controller">
                            <ContestsController user={user}/>
                        </Route>

                        <Route path="/contest-controller/:id/create-task">
                            <CreateTaskPage user={user} />
                        </Route>

                        <Route path="/contest-controller/:contestId/task/:id">
                            <TaskControllerPage user={user} />
                        </Route>

                        <Route path="/contest-controller/:id">
                            <ContestController user={user} />
                        </Route>

                        <Route path="/contests">
                            <MyContestsPage user={user} />
                        </Route>

                        <Route path="/contest/:contestId/task/:id">
                            <TaskPage user={user} />
                        </Route>

                        <Route path="/contest/:id">
                            <ContestPage user={user} />
                        </Route>

                        <Route path="/join-contest/:contest_secret">
                            <AddParticipantController user={user} />
                        </Route>

                    </Switch>
                </div>
            </Router>
        );
};
