'use strict';

const settingsOrderInput = document.getElementById('order-input');
const settingsHideEngInput = document.getElementById('hide-eng-input');
const settingsHideSlavInput = document.getElementById('hide-slav-input');

async function initialize() {
    settingsOrderInput.checked = !!+localStorage['order'];
    settingsHideEngInput.checked = !!+localStorage['hideEng'];
    settingsHideSlavInput.checked = !!+localStorage['hideSlav'];
    const hash = parseHash();
    if (!hash.ok) {
        alert('Error: ' + hash.reason);
        return;
    }

    const dataset = await getDataset(hash);
    if (dataset === false) {
        return;
    }

    document.getElementById('dataset-name').innerText = dataset.name;

    window.dataset = dataset.dataset;
    window.current = -1;
    window.hashExplained = hash;
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

settingsOrderInput.oninput = () => {
    localStorage['order'] = settingsOrderInput.checked ? 1 : 0;
}
settingsHideEngInput.oninput = () => {
    localStorage['hideEng'] = settingsHideEngInput.checked ? 1 : 0;
    if (settingsHideEngInput.checked) {
        document.querySelector('#card > div.all-eng').classList.add('hidden');
    } else {
        document.querySelector('#card > div.all-eng').classList.remove('hidden');
    }

    if (settingsHideEngInput.checked && settingsHideSlavInput.checked) {
        settingsHideSlavInput.checked = 0;
        settingsHideSlavInput.oninput();
    }
}
settingsHideSlavInput.oninput = () => {
    localStorage['hideSlav'] = settingsHideSlavInput.checked ? 1 : 0;
    if (settingsHideSlavInput.checked) {
        document.querySelector('#card > div.all-slav').classList.add('hidden');
    } else {
        document.querySelector('#card > div.all-slav').classList.remove('hidden');
    }

    if (settingsHideEngInput.checked && settingsHideSlavInput.checked) {
        settingsHideEngInput.checked = 0;
        settingsHideEngInput.oninput();
    }
}

function next() {
    if (!window.hashExplained.all && (window.hashExplained.starting === window.hashExplained.ending)) {
        window.current = 0;
    } else {
        const next = settingsOrderInput.checked ? 
        ((window.current + 1) % window.dataset.length) : 
        nextRandomInt(0, window.dataset.length, window.current);
        window.current = next;
    }

    const question = window.dataset[window.current]
    document.querySelector('#main > #card .english').innerText =       question.english;
    document.querySelector('#main > #card .transcription').innerText = question.transcription;
    document.querySelector('#main > #card .pronunciation').innerText = question.pronunciation;
    document.querySelector('#main > #card .russian').innerText =       question.russian;
    document.querySelector('#main > #card .ukrainian').innerText =     question.ukrainian;

    if (settingsHideEngInput.checked) {
        document.querySelector('#card > div.all-eng').classList.add('hidden');
    } else {
        document.querySelector('#card > div.all-eng').classList.remove('hidden');
    }
    if (settingsHideSlavInput.checked) {
        document.querySelector('#card > div.all-slav').classList.add('hidden');
    } else {
        document.querySelector('#card > div.all-slav').classList.remove('hidden');
    }
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

document.querySelector('#card > div.all-eng').onclick = e => {
    const hideEng = !!settingsHideEngInput.checked;
    if (!hideEng) return;

    document.querySelector('#card > div.all-eng').classList.remove('hidden');
}
document.querySelector('#card > div.all-slav').onclick = e => {
    const hideSlav = !!settingsHideSlavInput.checked;
    if (!hideSlav) return;

    document.querySelector('#card > div.all-slav').classList.remove('hidden');
}

Array.from(document.querySelectorAll('input')).forEach(x => {
    x.onkeyup = e => {
        e.preventDefault();
    };
})
