import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    Route,
    Link
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, URL } from '../utils';
import { WebAppClient, ContestResponse, TaskResponse } from '../../api/client';

export const ContestController: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [contest, setContest] = useState<ContestResponse | undefined>(undefined);
    const [tasks, setTasks] = useState<Array<TaskResponse> | undefined>(undefined);
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
                        keys={[['startDate', 'Start'], ['endDate', 'End'], ['secret', 'Secret'], ['createdAt', 'Created At']]}
                        elements={[contest].map(contest => ({
                            ...contest,
                            startDate: dateToString(contest.startDate),
                            endDate: dateToString(contest.endDate),
                            createdAt: dateToString(contest.createdAt)
                        })) } 
                    />
                    <Form>
                        <Form.Group>
                            <Form.Label>Join contest link</Form.Label>
                            <Form.Control type="text" value={`${URL}/join-contest/${contest.secret}`} readOnly />
                        </Form.Group>
                    </Form>
                    <div>Tasks</div>
                    {tasks
                    ? <>
                        <Table keys={[['id', 'Id'], ['text', 'Content']]} elements={tasks} />
                    </>
                    : <>Loading...</>
                    }
                    <Button as={Link} to={`/contest-controller/${id}/create-task`}>Add new task</Button>
                </>
                : <>Loading...</>
            }
        <AlertPrompt text={errorMessage} />
        </div>;
});
