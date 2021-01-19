import React from 'react';
import Alert from 'react-bootstrap/Alert';
import moment, { Moment } from 'moment';

import { User } from '../api/user';

export type AccessType = "All" | "LoggedIn" | "LoggedOut" | "Admin" | "ContestCreator";

const Prompt: React.FunctionComponent<{ text?: string }> = ({ text }) => {
    if (text === "") {
        return <></>;
    }
    
    return <Alert key={"0"} variant={'danger'}>{text}</Alert>;
};

export {Prompt as AlertPrompt};

export interface PageProps {
    user?: User;
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
} 