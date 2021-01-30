import React, { useEffect, useState } from 'react';

import { Table } from '../components';
import { AccessWrapper, PageProps, AlertPrompt } from './utils';
import { WebAppClient, Model } from '../api';

export const UsersPage: React.FunctionComponent<PageProps> = AccessWrapper("Admin")(({ user }) => {
    const [users, setUsers] = useState<Array<Model.User> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    useEffect(() => {
        if (users === undefined) {
            WebAppClient.getAllUsers(response => {
                setUsers(response);
            }, error => {
                setError(error.response?.data);
            });
        }
    });

    return (
        <div>
            <Table 
                keys={[['id', 'Id'], ['displayName', 'Display Name'], ['email', 'Email'], ['accessLevel', 'Access']]}
                elements={users || []}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});