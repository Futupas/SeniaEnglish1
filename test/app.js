'use strict';

async function initialize() {
    const hash = parseHash();
    if (!hash.ok) {
        alert('Error: ' + hash.reason);
        return;
    }

    let dataset = await getDataset(hash);
    if (dataset === false) {
        return;
    }

    document.getElementById('dataset-name').innerText = dataset.name;

    dataset = dataset.dataset.map(x => { return { ...x, reverse: false }; });
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
