'use strict';

async function getDatasetText(key) {
    try {
        const resp = await fetch(`../data/${key}.csv`);
        const text = await resp.text();
        return text;
    }
    catch(ex) {
        console.error(ex);
        return false;
    }    
}

function parseHash() {
    const hash = window.location.hash;

    if (!hash?.length) {
        return {
            ok: false,
            reason: 'Hash is empty',
        };
    }

    const parts = hash.replace('#', '').split('-').filter(x => x.length);

    if (parts.length === 1) {
        return {
            ok: true,
            key: parts[0],
            all: true,
        };
    } else if (parts.length === 3) {
        const dataset = parts[0];
        const starting = +parts[1];
        const ending = +parts[2];

        if (isNaN(starting) || isNaN(ending)) {
            return {
                ok: false,
                reason: 'Wrong hash: starting or ending param',
            };
        }

        return {
            ok: true,
            key: parts[0],
            all: false,
            starting,
            ending,
        };
    }

    return {
        ok: false,
        reason: 'Wrong hash',
    };
}

async function getDataset(hash) {
    const datasetText = await getDatasetText(hash.key);
    if (datasetText === false) {
        alert('Wrong dataset or HTTP error');
        return false;
    }

    let dataset = datasetText.split('\n').filter(x => x.length && x.length > 3);
    dataset.shift();

    dataset = dataset.map(x => {
        x = x.replace('\r', '');
        const splitted = x.split(',');
        return {
            english:       splitted[0].trim().toLowerCase(),
            transcription: splitted[1],
            pronunciation: splitted[2],
            russian:       splitted[3].trim().toLowerCase(),
            ukrainian:     splitted[4].trim().toLowerCase(),
        };
    });

    if (!hash.all) {
        if (hash.starting < 1 || hash.ending > dataset.length) {
            alert('Error: Wrong start or end number');
            return false;
        }

        dataset = dataset.slice(hash.starting - 1, hash.ending);
    }

    return dataset;
}
