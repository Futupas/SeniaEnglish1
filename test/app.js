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
            english:       splitted[0].trim().toLowerCase(),
            transcription: splitted[1],
            pronunciation: splitted[2],
            russian:       splitted[3].trim().toLowerCase(),
            ukrainian:     splitted[4].trim().toLowerCase(),
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
    shuffleArray(dataset);

    window.dataset = dataset;
    window.current = -1;
    window.hashExplained = hash;
    window.errors = [];
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
    const input = document.getElementById('input').value.trim().toLowerCase();
    if (window.current !== -1 && !input?.length) {
        return;
    }

    const next = window.current + 1;
    window.current = next;

    if (next === window.dataset.length - 1) {
        document.getElementById('btn-next').innerText = 'Finish';
    } else if (next === window.dataset.length) {
        console.log('Finished.');
        document.getElementById('main').innerText = 'Finished';
        console.log(window.errors);
        return;
    }

    document.getElementById('main').innerText = JSON.stringify(window.dataset[next]);


    if (next === 0) return;

    const question = window.dataset[next - 1];

    const correct = question.reverse ? 
        (input === question.english) :
        (input === question.ukrainian);

    if (correct) {
        console.log('Correct');
    } else {
        console.log('Incorrect', question);
        //todo somehow handle it
        window.errors.push({ ...question, answer: input});
    }

    document.getElementById('input').value = '';
}

document.getElementById('btn-next').onclick = () => { next(); };


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
}

