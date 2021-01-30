import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    Route,
    Link
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, URL, FormWrapper } from '../utils';
import { WebAppClient, Model } from '../../api';

export const ContestController: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [contest, setContest] = useState<Model.ContestResponse | undefined>(undefined);
    const [tasks, setTasks] = useState<Array<Model.TaskResponse> | undefined>(undefined);
    const [commission, setCommission] = useState<Array<Model.CommissionResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [errorMessageCommission, setErrorCommission] = useState<string>("");

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

        if (commission === undefined) {
            WebAppClient.getCommission({ id: parseInt(id) }, response => {
                setCommission(response);
            }, error => {
                const errors = error.response?.data.errors;
                setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            });
        }
    });

    const addToCommission = (event: React.FormEvent) => {
        event.preventDefault();
    
        const userId: string = (document.getElementById("add-to-commission")  as HTMLInputElement).value;

       WebAppClient.postCommission({ contestId: parseInt(id), userId: parseInt(userId) }, response => {
           
        }, error => {
            const errors = error.response?.data.errors;
            setErrorCommission((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            console.log(error);
        });
    };

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
                    <br/>
                    <br/>
                    <div>Commision</div>
                    {commission
                    ? <>
                        <Table keys={[['id', 'Id']/*, ['displayName', 'Name']*/]} elements={
                            commission.map(comm => ({
                                id: comm.userId
                            }))
                        } />
                    </>
                    : <>Loading...</>
                    }
                    <FormWrapper>
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" id="add-to-commission" placeholder="user id" />
                                <Button type="submit" onClick={addToCommission}>Add user to commission</Button>
                            </Form.Group>
                        </Form>
                        <AlertPrompt text={errorMessageCommission} />
                    </FormWrapper>
                    <br/>
                    <br/>
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
