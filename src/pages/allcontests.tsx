import React, { useEffect, useState } from 'react';

import { Table } from '../components';
import { AccessWrapper, PageProps, AlertPrompt } from './utils';
import { WebAppClient, ContestResponse} from '../api/client';

export const AllContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("Admin")(({ user }) => {
    const [contests, setContests] = useState<Array<ContestResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    useEffect(() => {
        if (contests === undefined) {
            WebAppClient.getAllContests(response => {
                setContests(response);
            }, error => {
                setError(error.response?.data);
            });
        }
    });

    return (
        <div>
            <div>All Contests</div>
            <Table 
                keys={[['id', 'Id'], ['title', 'Title'], ['startDate', 'Start'], ['endDate', 'End'], ['secret', 'Secret'], ['userId', 'Created By'], ['createdAt', 'Created At']]}
                elements={contests || []}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});