import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import { AccessWrapper, PageProps } from './utils';

export const HelloThere = () => {
    const [helloThere, setHelloThere] = useState<boolean>(false);
    const [generalKenobi, setGeneralKenobi] = useState<boolean>(false);

    return <div style={{ width: "560px" }}>
        <Alert variant={"success"} onClick={() => setHelloThere(!helloThere)} >Hello There</Alert>
        {helloThere
            ? <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/eaEMSKzqGAg" 
                title="HelloThere"
            ></iframe>
            : <></>
        }
        <Alert variant={"dark"} onClick={() => setGeneralKenobi(!generalKenobi)}  >General Kenobi</Alert>
        {generalKenobi
            ? <iframe 
                width="560" 
                height="315" 
                src="https://www.youtube.com/embed/qLAQCYSi1_4" 
                title="HelloThere"
            ></iframe>
            : <></>
        }
    </div>;
}

export const HomePage: React.FunctionComponent<PageProps> = AccessWrapper("All")(({ user }) => {
    return (
        <div>
            Time to learn some math! <br/>
            <br/>
            This is a FREE website that you can write mathematical contests on! <br/>
            Here are some basic rules:  <br/>
            <ol>
                <li>You can be added to a contest through a special link.</li>
                <li>To create a contest, you need to have special permission. You can get one from admin. Feel free to contact us.</li>
                <li>When you are writing a contest, you will see how much time is left. Remember to submit your solutions before the end of contest.</li>
            </ol>
        </div>
    );
});