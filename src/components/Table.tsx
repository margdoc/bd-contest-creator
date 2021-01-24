import React from 'react';
import BSTable from 'react-bootstrap/Table';

const Row: React.FunctionComponent<{ values: Array<string>, onClick?: () => void }> = ({ values, onClick }) => {
    return <tr onClick={onClick} style={{
        ...(onClick !== undefined ? { cursor: 'pointer' } : {})
    }}>
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
    onClick?: Array<(() => void)>
}

export const Table: React.FunctionComponent<Props> = ({ keys, elements, onClick }) => {
    return <BSTable striped bordered hover>
        <thead>
            <tr>
                {keys.map(([_, keyText]) => 
                    <th>
                        {keyText}
                    </th>
                )}
            </tr>
        </thead>
        <tbody>
            {elements.map((element, i) => 
                <Row  values={keys.map(([keyValue, _]) => element[keyValue])} onClick={onClick && onClick[i]} />
            )}
        </tbody>
    </BSTable>;
};