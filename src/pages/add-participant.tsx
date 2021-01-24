import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    Route,
    Link
} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { AccessWrapper, PageProps, AlertPrompt } from './utils';
import { WebAppClient } from '../api/client';

export const AddParticipantController: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ contest_secret: string }>();
    const { contest_secret } = match.params;

    useEffect(() => {
        WebAppClient.postParticipation({ contest_secret }, response => {
            window.location.href = `/contest/${response.contestId}`;
        }, error => {
            const errors = error.response?.data.errors;
            setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
        });
    });

    return <div>
        <>Loading...</>
        <AlertPrompt text={errorMessage} />
    </div>;
});
