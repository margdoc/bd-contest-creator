import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    Link
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString, URL, buildError } from '../utils';
import { WebAppClient, Model } from '../../api';

export const ContestController: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [contest, setContest] = useState<Model.ContestResponse | undefined>(undefined);
    const [tasks, setTasks] = useState<Array<Model.TaskResponse> | undefined>(undefined);
    const [commission, setCommission] = useState<Array<Model.CommissionResponse> | undefined>(undefined);
    const [participation, setParticipation] = useState<Array<Model.ParticipationResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [errorMessageCommission, setErrorCommission] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    const match = useRouteMatch<{ id: string }>();
    const [ id ] = useState(match.params.id);

    useEffect(() => {
        WebAppClient.getContest({ id: parseInt(id) }, response => {
            setContest(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id ]);

    useEffect(() => {
        WebAppClient.getCommission({ id: parseInt(id) }, response => {
            setCommission(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id ]);

    useEffect(() => {
        WebAppClient.getParticipation({ id: parseInt(id) }, response => {
            setParticipation(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id ]);

    useEffect(() => {
        if (contest) {
            WebAppClient.getContestTasks({ id: parseInt(id), sorting }, response => {
                setTasks(response);
            }, error => {
                setError(buildError(error));
            });
        }
    }, [ id, sorting, contest ]);

    const addToCommission = (event: React.FormEvent) => {
        event.preventDefault();

        if (!commission) {
            return;
        }
    
        const userId: string = (document.getElementById("add-to-commission")  as HTMLInputElement).value;

       WebAppClient.postCommission({ contestId: parseInt(id), userId: parseInt(userId) }, response => {
            setCommission([...commission, response]);
        }, error => {
            setErrorCommission(buildError(error));
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
                        <Table keys={[['id', 'Id'], ['displayName', 'Name']]} elements={
                                commission.map(comm => ({
                                    id: comm.userId,
                                    displayName: comm.user.displayName
                                }))
                            } 
                            toDelete={commission.map(comm => () => WebAppClient.deleteCommission(
                                { id: comm.id }, () => {
                                    setCommission(commission.filter(_comm => _comm.id !== comm.id));
                                }, error => {
                                    setError(buildError(error));
                                })
                            )}
                        />
                    </>
                    : <>Loading...</>
                    }
                    <div>
                        <Form>
                            <Form.Group style={{ width: '172px' }} >
                                <Form.Control type="text" id="add-to-commission" placeholder="user id" />
                                <Button type="submit" onClick={addToCommission}>Add to commission</Button>
                            </Form.Group>
                        </Form>
                        <AlertPrompt text={errorMessageCommission} />
                    </div>
                    <br/>
                    <br/>
                    <div>Tasks</div>
                    {tasks
                    ? <>
                        <Table 
                            keys={[['id', 'Id'], ['title', 'Title'], ['text', 'Content']]} elements={tasks}
                            setSorting={setTableSorting}
                            sorting={sorting}
                            toDelete={tasks.map(task => () => 
                                WebAppClient.deleteTask({ id: task.id }, () => {
                                    setTasks(tasks.filter(  _task => _task.id !== task.id ));
                                },
                                error => {
                                    setError(buildError(error));
                                })
                            )}
                        />
                        {new Date() < new Date(Date.parse(contest.startDate))
                            ? <Button as={Link} to={`/contest-controller/${id}/create-task`}>Add new task</Button>
                            : <></>
                        }
                    </>
                    : <>Loading...</>
                    }
                    <br/>
                    <br/>
                    <div>Participants</div>
                    {participation
                    ? <>
                        <Table keys={[['id', 'Id'], ['displayName', 'Name']]} elements={
                                participation.map(part => ({
                                    id: part.userId,
                                    displayName: part.user.displayName
                                }))
                            } 
                            toDelete={participation.map(part => () => WebAppClient.deleteParticipation(
                                { id: part.id }, () => {
                                    setCommission(participation.filter(_part => _part.id !== part.id));
                                }, error => {
                                    setError(buildError(error));
                                })
                            )}
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
