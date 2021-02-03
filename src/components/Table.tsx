import React from 'react';
import BSTable from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import styled from 'styled-components';

import ArrowDown  from './assets/arrow-down.png';
import ArrowUp  from './assets/arrow-up.png';

import { Model } from '../api';

const Th = styled.th`
    cursor: pointer;

    :hover {
        background-color: rgb(240, 240, 240);
    }
`;

const Row: React.FunctionComponent<{ values: Array<string>, onClick?: () => void, toDelete?: () => void, customElement?: JSX.Element }> = ({ values, onClick, toDelete, customElement }) => {
    return <tr onClick={onClick} style={{
        ...(onClick !== undefined ? { cursor: 'pointer' } : {})
    }}>
            {values.map((value, i) => 
                <td key={i}>
                    {value}
                </td>
            )}
            {toDelete
                ? <td><Button variant="danger" onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    toDelete();
                }}>Delete</Button></td>
                : <></>
            }
            {customElement
                ? <td>{customElement}</td>
                : <></>
            }
        </tr>;
};

interface Props {
    keys: Array<[string, string]>;
    elements: Array<any>;
    onClick?: Array<(() => void)>;
    toDelete?: Array<(() => void)>;
    setSorting?: (sorting?: Model.Sorting) => void;
    sorting?: Model.Sorting;
    customElements?: Array<JSX.Element>;
}

export const Table: React.FunctionComponent<Props> = ({ keys, elements, onClick, toDelete, setSorting, sorting, customElements }) => {
    return <BSTable striped bordered hover>
        <thead>
            <tr>
                {keys.map(([keyValue, keyText]) => 
                    <Th key={keyValue} onClick={setSorting 
                        ? (() => {
                            if (!sorting || sorting.by !== keyValue) {
                                setSorting({ by: keyValue, how: 'ASC' });
                            }
                            else {
                                if (sorting.how === 'DESC') {
                                    setSorting(undefined);
                                }
                                else {
                                    setSorting({ ...sorting, how: 'DESC' });
                                }
                            }
                        })
                        : (() => {})
                    }>
                        <div style={{ display: "flex" }} >
                            {keyText}
                            <div style={{ height: "20px", width: "20px" }}>
                                {sorting && sorting.by === keyValue
                                    ? sorting.how === 'ASC' ? <Image src={ArrowDown} fluid /> : <Image src={ArrowUp} fluid />
                                    : <></>
                                }
                            </div>
                        </div>
                    </Th>
                )}
                {toDelete
                    ? <th></th>
                    : <></>
                }
            </tr>
        </thead>
        <tbody>
            {elements.map((element, i) => 
                <Row
                    key={i}
                    values={keys.map(([keyValue, _]) => element[keyValue])} 
                    onClick={onClick && onClick[i]}
                    toDelete={toDelete && toDelete[i]}
                    customElement={customElements && customElements[i]}
                 />
            )}
        </tbody>
    </BSTable>;
};