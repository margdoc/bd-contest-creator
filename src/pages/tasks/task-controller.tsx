import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, Model} from '../../api';

export const TaskControllerPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [task, setTask] = useState<Model.TaskResponse | undefined>(undefined);
    const [solutions, setSolutions] = useState<Array<Model.SolutionResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ contestId: string, id: string }>();
    const { contestId, id } = match.params;

    useEffect(() => {
        if (task === undefined) {
            WebAppClient.getTask({ id: parseInt(id), contestId: parseInt(contestId) }, response => {
                setTask(response);

            }, error => {
                setError(error.response?.data);
            });
        }
    });

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