import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { setAuthToken } from "../api/auth";
import { AccessWrapper, PageProps, AlertPrompt, FormWrapper } from './utils';
import { signInWithPopup, GoogleProvider, register as registerWithFirebase } from '../api/firebase';

export const RegisterPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedOut")(({ user }) => {
    const [errorMessage, setError] = useState("");

    const register = (event: React.FormEvent) => {
        event.preventDefault();
        
        const displayName: string = (document.getElementById("register-displayName")  as HTMLInputElement).value;
        const email: string = (document.getElementById("register-email")  as HTMLInputElement).value;
        const password: string = (document.getElementById("register-password")  as HTMLInputElement).value;
        const retypePassword: string = (document.getElementById("register-retype-password")  as HTMLInputElement).value;

        if (password !== retypePassword) {
            setError("Typed passwords are different");

            return;
        }

        registerWithFirebase({ displayName, email, password }, 
        async (response) => {
            if (!response) {
                setError('Firebase returned null');
            }
            else {
                setAuthToken(await response.getIdToken());
                window.location.href = '/';
            }
        }, error => {
            setError(error.message);
        });
    };

    const registerWithGoogle = (event: React.FormEvent) => {
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
                <Form.Control id="register-displayName" type="text" placeholder="username" />
                <Form.Control id="register-email" type="text" placeholder="email@example.com" />
                <Form.Control id="register-password" type="password" placeholder="password" />
                <Form.Control id="register-retype-password" type="password" placeholder="retype password" />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button type="submit" onClick={register}>Register</Button>
                    <Button type="submit" variant='light' onClick={registerWithGoogle}>With Google</Button>
                </div>
            </Form>
            <AlertPrompt text={errorMessage} />
        </FormWrapper>
    );
});