import React, { useEffect, useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, TaskResponse} from '../../api/client';

export const TaskControllerPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [task, setTask] = useState<TaskResponse | undefined>(undefined);
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
                    <h5>Task {id}</h5>
                    <div>{task?.text}</div>
                </>
                : <>Loading</>
            }
            <AlertPrompt text={errorMessage} />
        </div>
    );
});