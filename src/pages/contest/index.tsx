import React, { useState, useEffect } from 'react';
import {
    useRouteMatch
} from "react-router-dom";

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, Model } from '../../api';

export const ContestPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [contest, setContest] = useState<Model.ContestResponse | undefined>(undefined);
    const [tasks, setTasks] = useState<Array<Model.TaskResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ id: string }>();
    const { id } = match.params;

    useEffect(() => {
        if (contest === undefined) {
            WebAppClient.getContest({ id: parseInt(id) }, response => {
                setContest(response);

                WebAppClient.getContestTasks({ id: parseInt(id) }, response => {
                    setTasks(response);
                }, error => {
                    const errors = error.response?.data.errors;
                    setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
                });
            }, error => {
                const errors = error.response?.data.errors;
                setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            });
        }
    });

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
                        <Table keys={[['id', 'Id'], ['text', 'Content']]} elements={tasks} onClick={tasks.map(task =>
                            () => {
                                window.location.href = `/contest/${id}/task/${task.id}`;
                            }
                        )} />
                    </>
                    : <>Loading...</>
                    }
                </>
                : <>Loading...</>
            }
        <AlertPrompt text={errorMessage} />
        </div>;
});
