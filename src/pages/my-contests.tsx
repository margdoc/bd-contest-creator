import React, { useEffect, useState } from 'react';

import { Table } from '../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from './utils';
import { WebAppClient, ContestResponse} from '../api/client';

export const MyContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [contests, setContests] = useState<Array<ContestResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    useEffect(() => {
        if (contests === undefined) {
            WebAppClient.getUserContests(response => {
                setContests(response);
            }, error => {
                const errors = error.response?.data.errors;
                setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            });
        }
    });

    return (
        <div>
            <Table 
                keys={[['title', 'Title'], ['startDate', 'Start'], ['endDate', 'End']]}
                elements={contests ? contests.map(contest => ({
                    ...contest,
                    startDate: dateToString(contest.startDate),
                    endDate: dateToString(contest.endDate)
                })) : []}
                onClick={contests ? contests.map(contest => (
                    () => window.location.href = `/contest/${contest.id}`
                )) : []}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});