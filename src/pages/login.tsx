import React, { useState } from 'react';

import { WebAppClient } from "../api/client";
import { setAuthToken } from "../api/auth";
import { AccessWrapper, PageProps, AlertPrompt } from './utils';


export const LoginPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedOut")(({ user }) => {
    const [errorMessage, setError] = useState("");

    const login = (event: React.FormEvent) => {
        event.preventDefault();
        
        const email: string = (document.getElementById("login-email")  as HTMLInputElement).value;
        const password: string = (document.getElementById("login-password")  as HTMLInputElement).value;

        WebAppClient.postLogin({ email, password }, 
        response => {
            setAuthToken(response.token);
            window.location.href = '/';
        }, error => {
            setError(error.response?.data.errors);
            console.log(error);
        });
    };

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={login}>
                <input id="login-email" type="text" placeholder="email" />
                <input id="login-password" type="password" placeholder="password" />
                <button type="submit">Login</button>
            </form>
            <AlertPrompt text={errorMessage} />
        </div>
    );
});