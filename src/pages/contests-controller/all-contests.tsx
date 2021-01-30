import React, { useEffect, useState } from 'react';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, Model } from '../../api';

export const AllContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("Admin")(({ user }) => {
    const [contests, setContests] = useState<Array<Model.ContestResponse> | undefined>(undefined);
    const [users, setUsers] = useState<Array<Model.User> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    useEffect(() => {
        if (contests === undefined) {
            WebAppClient.getAllContests(response => {
                setContests(response);
            }, error => {
                setError(error.response?.data);
            });
        }

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
                keys={[['id', 'Id'], ['title', 'Title'], ['startDate', 'Start'], ['endDate', 'End'], ['secret', 'Secret'], ['userId', 'Created By'], ['createdAt', 'Created At']]}
                elements={contests ? contests.map(contest => ({
                    ...contest,
                    userId: users === undefined ? contest.userId : users.find(user => parseInt(user.id) === contest.userId)?.displayName,
                    startDate: dateToString(contest.startDate),
                    endDate: dateToString(contest.endDate),
                    createdAt: dateToString(contest.createdAt)
                })) : []}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});