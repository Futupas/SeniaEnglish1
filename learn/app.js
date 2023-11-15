'use strict';

const orderInput = document.getElementById('order-input');

async function initialize() {
    orderInput.checked = !!+localStorage['order'];
    const hash = parseHash();
    if (!hash.ok) {
        alert('Error: ' + hash.reason);
        return;
    }

    const dataset = await getDataset(hash);
    if (dataset === false) {
        return;
    }

    window.dataset = dataset;
    window.current = -1;
    window.hashExplained = hash;
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

orderInput.oninput = () => {
    localStorage['order'] = orderInput.checked ? 1 : 0;
}

function next() {
    if (window.hashExplained.starting === window.hashExplained.ending) {
        window.current = 0;
    } else {
        const next = orderInput.checked ? 
        ((window.current + 1) % window.dataset.length) : 
        nextRandomInt(0, window.dataset.length, window.current);
        window.current = next;
    }

    const question = window.dataset[window.current]
    document.querySelector('#main > #card > .english').innerText =       question.english;
    document.querySelector('#main > #card > .transcription').innerText = question.transcription;
    document.querySelector('#main > #card > .pronunciation').innerText = question.pronunciation;
    document.querySelector('#main > #card > .russian').innerText =       question.russian;
    document.querySelector('#main > #card > .ukrainian').innerText =     question.ukrainian;
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

window.onkeyup = e => {
    if (e.code === 'Enter' || e.code === 'Space') {
        next();
    }
}
