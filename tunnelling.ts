import { writeFileSync } from 'fs';
import localtunnel from 'localtunnel';

await (async () => {
    const backend = await localtunnel({ port: 3000 });
    const frontend = await localtunnel({ port: 3006 });

    writeFileSync('./config.json', {
        'urls': {
            'backend': backend.url,
            'frontend': frontend.url
        }
    });
})();
