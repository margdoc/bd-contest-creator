import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { WebAppClient } from "../../api/client";
import { AccessWrapper, PageProps, AlertPrompt, FormWrapper } from '../utils';

export const CreateContestPage: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [errorMessage, setError] = useState<string>("");

    const create = (event: React.FormEvent) => {
        event.preventDefault();
        
        const title: string = (document.getElementById("contest-title")  as HTMLInputElement).value;
        const startDate = (document.getElementById("contest-start-date")  as HTMLInputElement).value;
        const startTime = (document.getElementById("contest-start-time")  as HTMLInputElement).value;
        const endDate = (document.getElementById("contest-end-date")  as HTMLInputElement).value;
        const endTime = (document.getElementById("contest-end-time")  as HTMLInputElement).value;
        console.log();

       WebAppClient.postCreateContest({ title, 
            startDate: `"${new Date(Date.parse(startDate + ' ' + startTime)).toJSON()}"`, 
            endDate: `"${new Date(Date.parse(endDate + ' ' + endTime)).toJSON()}"` 
        }, response => {
            window.location.href = '/contests-controller/my';
        }, error => {
            const errors = error.response?.data.errors;
            setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            console.log(error);
        });
    };

    return (
        <>
            <FormWrapper>
            <h4>Create Contest</h4>
                <Form>
                    <Form.Group>
                        <Form.Label>Title</Form.Label><br/>
                        <Form.Control id="contest-title" type="text" placeholder="title" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Start</Form.Label><br/>
                        <Form.Control id="contest-start-date" type="date"  />
                        <Form.Control id="contest-start-time" type="time" value="09:00" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>End</Form.Label><br/>
                        <Form.Control id="contest-end-date" type="date"  />
                        <Form.Control id="contest-end-time" type="time" value="14:00" />
                    </Form.Group>
                    <Button type="submit" onClick={create}>Create</Button>
                </Form>
                <AlertPrompt text={errorMessage} />
            </FormWrapper>
        </>
    );
});