import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import { Table } from '../../components';
import { AccessWrapper, PageProps, AlertPrompt, buildError } from '../utils';
import { WebAppClient, Model} from '../../api';

export const CommissionsSolutionsPage: React.FunctionComponent<PageProps> = AccessWrapper("LoggedIn")(({ user }) => {
    const [solutions, setSolution] = useState<Array<Model.SolutionResponse> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);
    const [filter, setFilter] = useState<boolean | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    const match = useRouteMatch<{ id: string }>();
    const [ id ] = useState(match.params.id);

    useEffect(() => {
        WebAppClient.getContestSolutions({ id: parseInt(id), sorting, filter }, response => {
            setSolution(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ id, sorting, filter ]);

    return (
        <div>
        <br />
            <ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={(value) => 
                setFilter(value === 0 ? undefined : (value === 1 ? true : false))
            }>
                <ToggleButton value={0}>All</ToggleButton>
                <ToggleButton value={1}>With Mark</ToggleButton>
                <ToggleButton value={2}>Without Mark</ToggleButton>
            </ToggleButtonGroup>
            <br />
            <br />
            <Table 
                keys={[['id', 'Id'], ['taskId', 'Task Id'], ['text', 'Content']]}
                elements={solutions ? solutions.map(solution => ({
                    ...solution
                })) : []}
                onClick={solutions ? solutions.map(solution => (
                    () => window.location.href = `/contest/${id}/task/${solution.taskId}/solution/${solution.id}`
                )) : []}
                sorting={sorting}
                setSorting={setTableSorting}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});