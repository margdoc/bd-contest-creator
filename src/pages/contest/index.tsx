import React, { useState, useEffect } from 'react';
import {
    useRouteMatch
} from "react-router-dom";

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, buildError } from '../utils';
import { WebAppClient, Model } from '../../api';

export const ContestPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [contest, setContest] = useState<Model.ContestResponse | undefined>(undefined);
    const [tasks, setTasks] = useState<Array<Model.TaskResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    const match = useRouteMatch<{ id: string }>();
    const { id } = match.params;

    useEffect(() => {
        WebAppClient.getContest({ id: parseInt(id) }, response => {
            setContest(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id ]);

    useEffect(() => {
        if (contest) {
            WebAppClient.getContestTasks({ id: parseInt(id) }, response => {
                setTasks(response);
            }, error => {
                setError(buildError(error));
            });
        }
    }, [ id, contest ]);

    useEffect(() => {
        if (contest) {
            WebAppClient.getContestTasks({ id: parseInt(id), sorting }, response => {
                setTasks(response);
            }, error => {
                setError(buildError(error));
            });
        }
    }, [ id, sorting, contest ]);

    const started = contest && new Date(Date.parse(contest.startDate)) < new Date();

    return <div>
            {contest
                ? <>
                    <h3>{contest.title}</h3>
                    <Table 
                        keys={[['startDate', 'Start'], ['endDate', 'End']]}
                        elements={[contest].map(contest => ({
                            ...contest,
                            startDate: dateToString(contest.startDate),
                            endDate: dateToString(contest.endDate),
                            createdAt: dateToString(contest.createdAt)
                        })) } 
                    />
                    <div>Tasks</div>
                    {tasks
                    ? <>
                        <Table keys={[['id', 'Id'], ['title', 'Title'], ['text', 'Content']]} elements={tasks} onClick={started ? tasks.map(task =>
                                () => {
                                    window.location.href = `/contest/${id}/task/${task.id}`;
                                }
                            ) : undefined} 
                            setSorting={setTableSorting}
                            sorting={sorting}
                        />
                    </>
                    : <>Loading...</>
                    }
                </>
                : <>Loading...</>
            }
        <AlertPrompt text={errorMessage} />
        </div>;
});
