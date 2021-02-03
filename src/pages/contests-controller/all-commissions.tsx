import React, { useEffect, useState } from 'react';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, buildError } from '../utils';
import { WebAppClient, Model} from '../../api';

export const CommissionsContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [contests, setContests] = useState<Array<Model.ContestResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    useEffect(() => {
        WebAppClient.getCommissionContests({ sorting }, response => {
            setContests(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ sorting ]);

    return (
        <div>
            <Table 
                keys={[['id', 'Id'], ['title', 'Title'], ['startDate', 'Start'], ['endDate', 'End'], ['secret', 'Secret'], ['createdAt', 'Created At']]}
                elements={contests ? contests.map(contest => ({
                    ...contest,
                    startDate: dateToString(contest.startDate),
                    endDate: dateToString(contest.endDate),
                    createdAt: dateToString(contest.createdAt)
                })) : []}
                onClick={contests ? contests.map(contest => (
                    () => window.location.href = `/commissions/${contest.id}`
                )) : []}
                sorting={sorting}
                setSorting={setTableSorting}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});