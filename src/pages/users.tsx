import React, { useEffect, useState } from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';

import { Table } from '../components';
import { AccessWrapper, PageProps, AlertPrompt, buildError } from './utils';
import { WebAppClient, Model } from '../api';

export const UsersPage: React.FunctionComponent<PageProps> = AccessWrapper("Admin")(({ user }) => {
    if (!user) {
        return <div>Something went wrong :(</div>;
    }

    const [users, setUsers] = useState<Array<Model.User> | undefined>(undefined);
    const [errorMessage, setError] = useState<string>("");
    const [sorting, setSorting] = useState<Model.Sorting | undefined>(undefined);
    const [accessLevel, setAccessLevel] = useState<1 | 2 | 3 | undefined>(undefined);
    const [filter, setFilter] = useState<boolean | undefined>(undefined);

    const setTableSorting = (tableSorting?: Model.Sorting) => {
        setSorting(tableSorting);
    }

    useEffect(() => {
        WebAppClient.getAllUsers({ accessLevel, sorting, filter }, response => {
            setUsers(response);
        }, error => {
            setError(buildError(error));
        });
    }, [ sorting, accessLevel, filter ]);

    return (
        <div>
            <br />
            <ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={(value) => 
                setFilter(value === 0 ? undefined : (value === 1 ? true : false))
            }>
                <ToggleButton value={0}>All</ToggleButton>
                <ToggleButton value={1}>Non blocked</ToggleButton>
                <ToggleButton value={2}>Blocked</ToggleButton>
            </ToggleButtonGroup>
            <br />
            <br />
            <ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={(value) => 
                setAccessLevel( value === 0 ? undefined : value )
            }>
                <ToggleButton value={0}>All</ToggleButton>
                <ToggleButton value={3}>3</ToggleButton>
                <ToggleButton value={2}>2</ToggleButton>
                <ToggleButton value={1}>1</ToggleButton>
            </ToggleButtonGroup>
            <br />
            <br />
            <Table 
                keys={[['id', 'Id'], ['displayName', 'Display Name'], ['email', 'Email'], ['accessLevel', 'Access']]}
                elements={users || []}
                sorting={sorting}
                setSorting={setTableSorting}
                customElements={users && users.map(_user =>
                    _user.accessLevel < 3
                    ? <>
                        <Button variant="warning" onClick={() => 
                            WebAppClient.blockUser({ userId: parseInt(_user.id), block: !_user.disabled }, () => {
                                setUsers(users.map(__user => _user.id === __user.id ? {
                                    ..._user, disabled: !_user.disabled
                                } : __user))
                            }, error => {
                                setError(buildError(error));
                            })
                        } >{_user.disabled ? "Enable" : "Disable"}</Button>
                        </>
                    : <div></div>
                )}
            />
            <AlertPrompt text={errorMessage} />
        </div>
    );
});