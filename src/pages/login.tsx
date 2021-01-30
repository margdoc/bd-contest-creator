import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { WebAppClient } from "../api";
import { setAuthToken } from "../api/auth";
import { AccessWrapper, PageProps, AlertPrompt, FormWrapper } from './utils';
import { signInWithPopup, GoogleProvider } from '../api/firebase';

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
        });
    };

    const loginWithGoogle = (event: React.FormEvent) => {
        event.preventDefault();

        signInWithPopup(
            GoogleProvider,
            async (user) => {
                if (!user) {
                    setError('XD');
                }
                else {
                    setAuthToken(await user.getIdToken());
                    window.location.href = '/';
                }
            },
            (error) => {
                setError(error.message);
            }
        )
    };

    return (
        <FormWrapper>
            <Form>
                <Form.Control id="login-email" type="text" placeholder="email" />
                <Form.Control id="login-password" type="password" placeholder="password" />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button type="submit" onClick={login}>Login</Button>
                    <Button type="submit" variant='light' onClick={loginWithGoogle}>With Google</Button>
                </div>                
            </Form>
            <AlertPrompt text={errorMessage} />
        </FormWrapper>
    );
});