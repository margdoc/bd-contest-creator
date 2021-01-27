import React from 'react';
import {
    useRouteMatch,
    Route,
    Link
} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { AllContestsPage } from './all-contests';
import { MyContestsPage } from './my-contests';
import { CreateContestPage } from './create-contest';
import { AccessWrapper, PageProps } from '../utils';

export const ContestsController: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const match = useRouteMatch();

    return <div>
            <Navbar bg="primary" variant="dark">
                <Nav>
                    { user?.accessLevel === 3
                        ? <>
                            <Nav.Item>
                                <Nav.Link as={Link} to={`${match.url}/all`}>All Contests</Nav.Link>
                            </Nav.Item>
                        </>
                        : <></>
                    }
                    <Nav.Item>
                        <Nav.Link as={Link} to={`${match.url}/my`}>My Contests</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to={`${match.url}/create`}>Create Contests</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>

            <Route path={`${match.url}/all`} exact>
                <AllContestsPage user={user} />
            </Route>
            <Route path={`${match.url}/create`} exact>
                <CreateContestPage user={user} />
            </Route>
            <Route path={`${match.url}/my`} exact>
                <MyContestsPage user={user} />
            </Route>
        </div>;
});