import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt } from '../utils';
import { WebAppClient, Model} from '../../api';

export const TaskControllerPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [task, setTask] = useState<Model.TaskResponse | undefined>(undefined);
    const [solutions] = useState<Array<Model.SolutionResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ id: string }>();
    const { id } = match.params;

    useEffect(() => {
        WebAppClient.getTask({ id: parseInt(id) }, response => {
            setTask(response);

        }, error => {
            setError(error.response?.data);
        });
    }, [ id ]);

    return (
        <div>
            {task
                ? <>
                    <h3>Task {id}</h3>
                    <br/>
                    <h4>Content</h4>
                    <div>{task.text}</div>
                    <br/>
                    <br/>
                    <br/>
                    {solutions
                    ? <>
                        <Table keys={[['id', 'Id'], ['text', 'Solution'], ['comment', 'Comment'], ['mark', 'Mark']]} elements={solutions} />
                    </>
                    : <>Loading...</>
                    }
                </>
                : <>Loading</>
            }
            <AlertPrompt text={errorMessage} />
        </div>
    );
});