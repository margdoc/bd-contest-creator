import React, { useState, useEffect } from 'react';
import {
    useRouteMatch,
    Route,
    Link
} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, dateToString } from '../utils';
import { WebAppClient, ContestResponse } from '../../api/client';

export const ContestController: React.FunctionComponent<PageProps> = AccessWrapper("ContestCreator")(({ user }) => {
    const [contest, setContest] = useState<ContestResponse | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");

    const match = useRouteMatch<{ id: string }>();
    const { id } = match.params;

    useEffect(() => {
        if (contest === undefined) {
            WebAppClient.getContest({ id: parseInt(id) }, response => {
                setContest(response);
            }, error => {
                const errors = error.response?.data.errors;
                setError((typeof errors === 'string' || errors instanceof String) ? errors : errors.message);
            });
        }
    });

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
                </>
                : <>Loading...</>
            }
        <AlertPrompt text={errorMessage} />
        </div>;
});
