import React from 'react';

import { AccessWrapper, PageProps } from './utils';


export const HomePage: React.FunctionComponent<PageProps> = AccessWrapper("All")(({ user }) => {
    return (
        <div>
            {user 
            ?   <div>Hello {user.displayName}!</div>
            :   <></>
            }
        </div>
    );
});