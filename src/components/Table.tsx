import React from 'react';
import { Table as BSTable } from 'react-bootstrap';

const Row: React.FunctionComponent<{ values: Array<string> }> = ({ values }) => {
    return <tr>
            {values.map(value => 
                <td>
                    {value}
                </td>
            )}
        </tr>;
};

interface Props {
    keys: Array<[string, string]>;
    elements: Array<any>;
}

export const Table: React.FunctionComponent<Props> = ({ keys, elements }) => {
    return <BSTable striped bordered>
        <thead>
            <tr>
                {keys.map(([_, keyText]) => 
                    <th>
                        {keyText}
                    </th>
                )}
            </tr>
            {elements.map(element => 
                <Row  values={keys.map(([keyValue, _]) => element[keyValue])} />
            )}
        </thead>
    </BSTable>;
};