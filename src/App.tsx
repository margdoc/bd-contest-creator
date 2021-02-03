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
//import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';

import * as Page from './pages';
import { getAuthToken, removeAuthToken } from './api/auth';
import { WebAppClient, Model } from './api';


export const App: React.FunctionComponent = ()=> {
    const [user, setUser] = useState<Model.User | undefined | null>(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const isLoggedIn = getAuthToken() != null;
    
        if (user === undefined) {
            if (isLoggedIn) {
                WebAppClient.getMe(response => {
                    setUser({...response});
                }, error => {
                    // removeAuthToken();
                    setUser(null);
                });
            } else {
                setUser(null);
            }
        }
    });

    if (user === undefined) {
        return <div>Loading...</div>;
        /*return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <Spinner animation="grow" variant="primary" style={{ width: "10vw", height: "10vw" }} />
        </div>;*/
    }

    return (
        <Router>
                <div>
                    <Navbar bg="primary" variant="dark" >
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
                                        <Nav.Link  as={Link} to="/contests-controller/my">Contests Controller</Nav.Link>
                                    </Nav.Item>
                                </>
                                : <></>
                            }
                            <Nav.Item>
                                <Nav.Link as={Link} to="/contests">Contests</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/commissions">My Commissions</Nav.Link>
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
                                        {user.photoURL
                                            ?<Nav.Item style={{ width: "40px", height: "40px" }} ><Image src={user.photoURL} roundedCircle fluid /></Nav.Item>
                                            : <Nav.Item><Nav.Link disabled>{user.displayName}</Nav.Link></Nav.Item>
                                        }
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
                            <Page.HomePage user={user} />
                        </Route>

                        <Route path="/users"  exact>
                            <Page.UsersPage user={user} />
                        </Route>

                        <Route path="/login" exact>
                            <Page.LoginPage user={user} />
                        </Route>
                        <Route path="/register" exact>
                            <Page.RegisterPage user={user} />
                        </Route>

                        <Route path="/contests-controller" >
                            <Page.ContestsController user={user}/>
                        </Route>

                        <Route path="/contest-controller/:id/create-task" exact>
                            <Page.CreateTaskPage user={user} />
                        </Route>

                        <Route path="/contest-controller/:contestId/task/:id" exact>
                            <Page.TaskControllerPage user={user} />
                        </Route>

                        <Route path="/contest-controller/:id" exact>
                            <Page.ContestController user={user} />
                        </Route>

                        <Route path="/contests" exact>
                            <Page.MyContestsPage user={user} />
                        </Route>

                        <Route path="/contest/:contestId/task/:id" exact>
                            <Page.TaskPage user={user} />
                        </Route>

                        <Route path="/contest/:contestId/task-controller/:id" exact>
                            <Page.TaskControllerPage user={user} />
                        </Route>

                        <Route path="/contest/:id" exact>
                            <Page.ContestPage user={user} />
                        </Route>

                        <Route path="/join-contest/:contest_secret" exact>
                            <Page.AddParticipantController user={user} />
                        </Route>

                        <Route path="/commissions" exact>
                            <Page.CommissionsContestsPage user={user} />
                        </Route>

                        <Route path="/commissions/:id" exact>
                            <Page.CommissionsSolutionsPage user={user} />
                        </Route>
                        
                        <Route path="/contest/:contestId/task/:taskId/solution/:id" exact>
                            <Page.CommissionsSolutionPage user={user} />
                        </Route>

                        <Route path="/XD" exact>
                            <Page.HelloThere />
                        </Route>

                        <Route>
                            <div>404 Page not found</div>
                        </Route>

                    </Switch>
                </div>
            </Router>
        );
};
