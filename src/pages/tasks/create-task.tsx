import React, { useState } from 'react';
import {
    useRouteMatch
} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { WebAppClient } from "../../api/client";
import { AccessWrapper, PageProps, AlertPrompt } from '../utils';

export const CreateTaskPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ id: string }>();
    const { id } = match.params;

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const content: string = (document.getElementById("task-content")  as HTMLInputElement).value;

       WebAppClient.postCreateTask({ contest_id: parseInt(id), text: content }, response => {
            window.location.href = `/contest-controller/${id}`;
        }, error => {
            const errors = error.response?.data.errors;
            setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            console.log(error);
        });
    };

    return (
        <div>
            <Form>
                <Form.Group>
                    <Form.Label>Content</Form.Label><br/>
                    <Form.Control id="task-content" type="textarea" />
                </Form.Group>
                <Button type="submit" onClick={create}>Create</Button>
            </Form>
            <AlertPrompt text={errorMessage} />
        </div>
    );
});