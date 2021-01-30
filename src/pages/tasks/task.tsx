import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt } from '../utils';
import { WebAppClient, Model } from '../../api';

export const TaskPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [task, setTask] = useState<Model.TaskResponse | undefined>(undefined);
    const [solution, setSolution] = useState<Model.SolutionResponse | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ contestId: string, id: string }>();
    const { contestId, id } = match.params;

    useEffect(() => {
        if (task === undefined) {
            WebAppClient.getTask({ id: parseInt(id), contestId: parseInt(contestId) }, response => {
                setTask(response);

                WebAppClient.getSolution({ id: parseInt(id), contestId: parseInt(contestId) }, response => {
                    setSolution(response);
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

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const text: string = (document.getElementById("solution-text")  as HTMLInputElement).value;

        WebAppClient.postAddSolution({ taskId: parseInt(id), text }, response => {
            setSolution(response);
        }, error => {
            const errors = error.response?.data.errors;
            setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
        });
    }

    return (
        <div>
            {task
                ? <>
                    <h3>Task {id}</h3>
                    <br/>
                    <h4>Content</h4>
                    <div>{task?.text}</div>
                    <br/>
                    <br/>
                    <br/>
                    <h4>Solution</h4>
                    {solution
                        ? <>{solution.text}</>
                        : <Form>
                        <Form.Group>
                            <Form.Control as={"textarea"} id="solution-text"  />
                        </Form.Group>
                        <Button type="submit" onClick={create}>Send</Button>
                    </Form>
                    }
                </>
                : <>Loading</>
            }
            <AlertPrompt text={errorMessage} />
        </div>
    );
});