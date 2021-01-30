import React, { useState } from 'react';
import BSTable from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import styled from 'styled-components';

import ArrowDown  from './assets/arrow-down.png';
import ArrowUp  from './assets/arrow-up.png';

const Th = styled.th`
    cursor: pointer;

    :hover {
        background-color: rgb(240, 240, 240);
    }
`;

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
    // [key, 1 if ascending else -1]
    const [cmp, setCmp] = useState<[string, number] | undefined>(undefined);

    const sort = cmp && ((a: any, b: any) => (a[cmp[0]] > b[cmp[0]]) ? cmp[1] : -cmp[1]);

    return <BSTable striped bordered hover>
        <thead>
            <tr>
                {keys.map(([keyValue, keyText]) => 
                    <Th onClick={() => {
                        if (cmp === undefined || cmp[0] !== keyValue) {
                            setCmp([keyValue, 1]);
                        }
                        else {
                            if (cmp[1] === -1) {
                                setCmp(undefined);
                            }
                            else {
                                setCmp([keyValue, -cmp[1]]);
                            }
                        }
                    }}>
                        <div style={{ display: "flex" }} >
                            {keyText}
                            <div style={{ height: "20px", width: "20px" }}>
                                {cmp && cmp[0] === keyValue
                                    ? cmp[1] === 1 ? <Image src={ArrowDown} fluid /> : <Image src={ArrowUp} fluid />
                                    : <></>
                                }
                            </div>
                        </div>
                    </Th>
                )}
            </tr>
        </thead>
        <tbody>
            {[...elements].sort(sort).map((element, i) => 
                <Row  values={keys.map(([keyValue, _]) => element[keyValue])} onClick={onClick && onClick[i]} />
            )}
        </tbody>
    </BSTable>;
};