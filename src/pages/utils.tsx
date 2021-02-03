import React from 'react';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import styled from 'styled-components';

import { Model } from '../api';
import { AxiosError } from 'axios';

import Config from '../config.json';

export const URL = Config.urls.frontend;

export const buildError = (error: AxiosError | string) => {
    if (typeof error === 'string') {
        return error;
    }

    const errors = error.response?.data.errors;
    return (typeof errors === 'string' || errors instanceof String) ? errors : errors.message;
}

export type AccessType = "All" | "LoggedIn" | "LoggedOut" | "Admin" | "ContestCreator";

const Prompt: React.FunctionComponent<{ text?: string }> = ({ text }) => {
    if (text === "") {
        return <></>;
    }
    
    return <Alert key={"0"} variant={'danger'}>{text}</Alert>;
};

export {Prompt as AlertPrompt};

export const InfoPrompt: React.FunctionComponent<{ text?: string }> = ({ text }) => {
    if (text === "") {
        return <></>;
    }
    
    return <Alert key={"0"} variant={'info'}>{text}</Alert>;
};

export interface PageProps {
    user?: Model.User | null;
}

export const AccessWrapper = (access: AccessType) =>
    (Component: React.FunctionComponent<PageProps>) => 
        ({ user }: PageProps) => {
            if (access === "All") {
                return <Component user={user} />;
            }

            if (access === "LoggedOut") {
                if (user) {
                    return <Prompt text={`You are already logged in as ${user.displayName}`} />;
                }
                else {
                    return <Component user={user} />;
                }
            }

            if (!user) {
                return <Prompt text={`You have to be logged in`} />;
            }
            
            if (access === "Admin" &&
                user.accessLevel < 3
            ) {
                return <Prompt text={`You need admin access`} />;
            }

            if (access === "ContestCreator" &&
                user.accessLevel < 2
            ) {
                return <Prompt text={'You need contest creator access'} />;
            }

            return <Component user={user} />;
        };


export const dateToString = (date: string) => {
    return moment(date).format('lll');
};

export const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    margin-top: 5%;
`;