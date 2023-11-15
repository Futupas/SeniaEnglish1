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

const orderInput = document.getElementById('order-input');

async function initialize() {
    orderInput.checked = !!+localStorage['order'];
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

    window.dataset = dataset;
    window.current = 0;
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

orderInput.oninput = () => {
    localStorage['order'] = orderInput.checked ? 1 : 0;
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
    const next = orderInput.checked ? 
        ((window.current + 1) % window.dataset.length) : 
        nextRandomInt(0, window.dataset.length, window.current);
    window.current = next;

    document.getElementById('main').innerText = JSON.stringify(window.dataset[next]);

}

document.getElementById('btn-next').onclick = () => { next(); };

function nextRandomInt(min, max, current = null) {
    // Ensure that min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
    // Generate a random number within the specified range
    const next = Math.floor(Math.random() * (max - min)) + min;

    if (current === next) {
        return nextRandomInt(min, max, current);
    } else {
        return next;
    }
}

