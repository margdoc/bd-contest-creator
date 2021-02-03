import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AccessWrapper, PageProps, AlertPrompt, buildError, InfoPrompt } from '../utils';
import { WebAppClient, Model } from '../../api';

export const TaskPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [contest, setContest] = useState<Model.ContestResponse | undefined>(undefined);
    const [task, setTask] = useState<Model.TaskResponse | undefined>(undefined);
    const [solution, setSolution] = useState<Model.SolutionResponse | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [infoMessage, setInfoMessage] = useState<string>("");

    const match = useRouteMatch<{ contestId: string, id: string }>();
    const { contestId, id } = match.params;

    useEffect(() => {
        WebAppClient.getContest({ id: parseInt(contestId) }, response => {
            setContest(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id, contestId ]);

    useEffect(() => {
        WebAppClient.getTask({ id: parseInt(id) }, response => {
            setTask(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id ]);

    useEffect(() => {
        if (task) {
            WebAppClient.getSolutionByTask({ id: parseInt(id) }, response => {
                setSolution(response);
            }, error => {
                setError(buildError(error));
            });
        }
    }, [ id, task ]);

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const text: string = (document.getElementById("solution-text")  as HTMLInputElement).value;

        WebAppClient.postAddSolution({ taskId: parseInt(id), text }, response => {
            setSolution(response);
            setInfoMessage("Solution successfully created.");
        }, error => {
            setError(buildError(error));
        });
    }

    const patch = (event: React.FormEvent) => {
        event.preventDefault();
        
        const text: string = (document.getElementById("solution-text")  as HTMLInputElement).value;

        if (solution) {
            WebAppClient.patchSolution({ taskId: solution.id, text }, response => {
                setSolution({ ...response, mark: solution.mark });
                setInfoMessage("Solution successfully updated.");
            }, error => {
                setError(buildError(error));
            });
        }
    }

    return (
        <div>
            {task && contest
                ? <>
                    <h3>Task {task.title}</h3>
                    <br/>
                    <h4>Content</h4>
                    <div>{task?.text}</div>
                    <br/>
                    <br/>
                    <br/>
                    <h4>Solution</h4>
                    {(new Date(Date.parse(contest.endDate)) < new Date()) && solution
                        ? <>{solution.text}</>
                        : <Form>
                        <Form.Group>
                            <Form.Control 
                                as={"textarea"} 
                                id="solution-text" 
                                defaultValue={solution ? solution.text : ""}
                                style={{ resize: 'both', width: "30%"}}
                            />
                        </Form.Group>
                        <Button type="submit" onClick={solution ? patch : create }>Send</Button>
                    </Form>
                    }
                    {solution && solution.mark
                        ? <>
                            <br/>
                            <br/>
                            <h4>Mark</h4>
                            <br/>
                            <div>Points</div>
                            <div>{solution.mark.value}</div>
                            <br/>
                            <br/>
                            <div>Comment</div>
                            <div>{solution.mark.comment}</div>
                        </>
                        : <></>
                    }
                </>
                : <>Loading</>
            }
            <InfoPrompt text={infoMessage} />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});