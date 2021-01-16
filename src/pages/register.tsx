import React, { useState } from 'react';

import { WebAppClient } from "../api/client";
import { setAuthToken } from "../api/auth";
import { AccessWrapper, PageProps } from './utils';


export const RegisterPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedOut")(({ user }) => {
    const [errorMessage, setError] = useState("");

    const register = (event: React.FormEvent) => {
        event.preventDefault();
        
        const displayName: string = (document.getElementById("login-displayName")  as HTMLInputElement).value;
        const email: string = (document.getElementById("login-email")  as HTMLInputElement).value;
        const password: string = (document.getElementById("login-password")  as HTMLInputElement).value;
        const retypePassword: string = (document.getElementById("login-retype-password")  as HTMLInputElement).value;

        if (password !== retypePassword) {
            setError("Typed passwords are different");

            return;
        }

        WebAppClient.postRegister({ displayName, email, password }, 
        response => {
            setAuthToken(response.token);
            window.location.href = '/';
        }, error => {
            setError(error.response?.data.errors);
        });
    };

    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={register}>
                <input id="login-displayName" type="text" placeholder="display name" />
                <input id="login-email" type="text" placeholder="email" />
                <input id="login-password" type="password" placeholder="password" />
                <input id="login-retype-password" type="password" placeholder="retype password" />
                <button type="submit">Register</button>
            </form>
            {errorMessage !== ""
                ? <div>{errorMessage}</div>
                : <></>
            }
        </div>
    );
});