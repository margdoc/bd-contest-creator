import React, { useEffect, useState } from 'react';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, buildError } from '../utils';
import { WebAppClient, Model } from '../../api';

export const AllContestsPage: React.FunctionComponent<PageProps> = AccessWrapper("Admin")(({ user }) => {
    const [contests, setContests] = useState<Array<Model.ContestResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    useEffect(() => {
        WebAppClient.getAllContests({ sorting }, response => {
            setContests(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ sorting ]);

    return (
        <div>
            <Table 
                keys={[['id', 'Id'], ['title', 'Title'], ['startDate', 'Start'], ['endDate', 'End'], ['secret', 'Secret'], ['displayName', 'Created By'], ['createdAt', 'Created At']]}
                elements={contests ? contests.map(contest => ({
                    ...contest,
                    displayName: contest.user.displayName,
                    startDate: dateToString(contest.startDate),
                    endDate: dateToString(contest.endDate),
                    createdAt: dateToString(contest.createdAt)
                })) : []}
                setSorting={setTableSorting}
                sorting={sorting}
                toDelete={contests && contests.map(contest => () =>
                    WebAppClient.deleteContest({ id: parseInt(contest.id) }, () => {
                        setContests(contests.filter(  _contest => _contest.id !== contest.id ));
                    }, error =>
                        setError(buildError(error))
                    )
                )}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});