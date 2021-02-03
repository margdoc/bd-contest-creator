import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { AccessWrapper, PageProps, AlertPrompt, buildError, InfoPrompt } from '../utils';
import { WebAppClient, Model } from '../../api';

export const CommissionsSolutionPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [task, setTask] = useState<Model.TaskResponse | undefined>(undefined);
    const [solution, setSolution] = useState<Model.SolutionResponse | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [infoMessage, setInfoMessage] = useState<string>("");

    const match = useRouteMatch<{ taskId: string, id: string }>();
    const { taskId, id } = match.params;

    useEffect(() => {
        WebAppClient.getTask({ id: parseInt(taskId) }, response => {
            setTask(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id, taskId ]);

    useEffect(() => {
        if (task) {
            WebAppClient.getSolution({ id: parseInt(id) }, response => {
                setSolution(response);
            }, error => {
                setError(buildError(error));
            });
        }
    }, [ id, task ]);

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const value: number = parseInt((document.getElementById("mark-value")  as HTMLSelectElement).value);
        const comment: string = (document.getElementById("mark-comment")  as HTMLInputElement).value;

        if (solution) {
            WebAppClient.postAddMark({ id: parseInt(id), value, comment }, response => {
                setSolution({ ...solution, mark: response });
                setInfoMessage("Mark successfully created.");
            }, error => {
                setError(buildError(error));
            });
        }
    }

    const patch = (event: React.FormEvent) => {
        event.preventDefault();
        
        const value: number = parseInt((document.getElementById("mark-value")  as HTMLSelectElement).value);
        const comment: string = (document.getElementById("mark-comment")  as HTMLInputElement).value;

        if (solution && solution.mark) {
            WebAppClient.patchMark({ id: solution.mark.id, value, comment }, response => {
                setSolution({ ...solution, mark: response });
                setInfoMessage("Mark successfully updated.");
            }, error => {
                setError(buildError(error));
            });
        }
    }

    return (
        <div>
            {task && solution
                ? <>
                    <h3>Task {task.title}</h3>
                    <br/>
                    <h4>Content</h4>
                    <div>{task?.text}</div>
                    <br/>
                    <br/>
                    <br/>
                    <h4>Solution</h4>
                    <div>{solution.text}</div>
                    <br/>
                    <br/>
                    <br/>
                    <h4>Mark</h4>
                    <Form style={{ width: "30%" }}>
                        <Form.Group>
                            <Form.Label>Points</Form.Label>
                            <Form.Control 
                                as={"select"}
                                id="mark-value"
                                defaultValue={solution.mark ? solution.mark.value : undefined}
                                style={{ width: '50px' }}
                            >
                                <option></option>
                                <option>6</option>
                                <option>5</option>
                                <option>2</option>
                                <option>0</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                                as={"textarea"} 
                                id="mark-comment" 
                                defaultValue={solution.mark ? solution.mark.comment : ""}
                                style={{ resize: 'both' }}
                            />
                        </Form.Group>
                        <Button type="submit" onClick={solution.mark ? patch : create }>Send</Button>
                    </Form>
                </>
                : <>Loading...</>
            }
            <InfoPrompt text={infoMessage} />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});