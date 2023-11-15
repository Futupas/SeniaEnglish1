'use strict';

const FILE = `english,transcription,pronunciation,russian,ukrainian
car,/kɑːr/,кар,автомобиль,автомобіль
house,/haʊs/,хаус,дом,дім
tree,/triː/,три,дерево,дерево
book,/bʊk/,бук,книга,книга
computer,/kəmˈpjuːtər/,компьютер,компьютер,комп'ютер
sun,/sʌn/,сан,солнце,сонце
flower,/ˈflaʊər/,флауэр,цветок,квітка
water,/ˈwɔːtər/,вотэр,вода,вода
sky,/skaɪ/,скай,небо,небо
dog,/dɒɡ/,дог,собака,пес
`;

async function initialize() {
    const hash = parseHash();
    if (!hash.ok) {
        alert('Error: ' + hash.reason);
        return;
    }

    //todo real dataset

    let dataset = FILE.split('\n').filter(x => x.length && x.length > 3);
    dataset.shift();

    dataset = dataset.map(x => {
        x = x.replace('\r', '');
        const splitted = x.split(',');
        return {
            english:       splitted[0],
            transcription: splitted[1],
            pronunciation: splitted[2],
            russian:       splitted[3],
            ukrainian:     splitted[4],
        };
    })

    if (!hash.all) {
        if (hash.starting < 1 || hash.ending > dataset.length) {
            alert('Error: Wrong start or end number');
            return;
        }

        dataset = dataset.slice(hash.starting - 1, hash.ending);
    }

    dataset = dataset.map(x => { return { ...x, reverse: false }; });
    const reverseDataset = dataset.map(x => { return { ...x, reverse: true }; });
    dataset.push(...reverseDataset);

    window.dataset = dataset;
    window.current = -1;
    window.hashExplained = hash;
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

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
        const dataset = parts[0];

        return {
            ok: true,
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

function next() {
    const next = window.current + 1;
    window.current = next;

    if (next === window.dataset.length - 1) {
        document.getElementById('btn-next').innerText = 'Finish';
    } else if (next === window.dataset.length) {
        console.log('Finished.');
        document.getElementById('main').innerText = 'Finished';
        return;
    }

    document.getElementById('main').innerText = JSON.stringify(window.dataset[next]);

}

document.getElementById('btn-next').onclick = () => { next(); };


