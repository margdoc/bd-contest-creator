import React from 'react';

import { AccessWrapper, PageProps } from './utils';


export const HomePage: React.FunctionComponent<PageProps> = AccessWrapper("All")(({ user }) => {
    return (
        <div>
            <div>Home Page</div>
            {user 
            ?   <div>Hello {user.displayName}!</div>
            :   <></>
            }
        </div>
    );
});