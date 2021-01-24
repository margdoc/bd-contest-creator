import React, { useEffect, useState } from 'react';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, ContestResponse} from '../../api/client';

export const MyContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [contests, setContests] = useState<Array<ContestResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    useEffect(() => {
        if (contests === undefined) {
            WebAppClient.getAdminContests(response => {
                setContests(response);
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
                    startDate: dateToString(contest.startDate),
                    endDate: dateToString(contest.endDate),
                    createdAt: dateToString(contest.createdAt)
                })) : []}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});