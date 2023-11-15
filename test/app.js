'use strict';

const blurDiv = document.getElementById('blur');
const infoDiv = document.querySelector('#blur > .info');

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
    shuffleArray(dataset);
    const reverseDataset = dataset.map(x => { return { ...x, reverse: true }; });
    shuffleArray(reverseDataset);
    dataset.push(...reverseDataset);

    window.dataset = dataset;
    window.current = -1;
    window.hashExplained = hash;
    window.errors = [];
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

function next() {
    //todo divide into 'Check previos' and 'Prepare next'
    const input = document.getElementById('input').value.trim().toLowerCase();
    if (window.current !== -1 && !input?.length) {
        return;
    }

    const next = window.current + 1;
    window.current = next;

    if (next === window.dataset.length - 1) {
        document.getElementById('btn-next').innerText = 'Finish';
    } else if (next === window.dataset.length) {
        console.log('Finished');
        console.log(window.errors);
        infoDiv.innerText = 'Finished ';
        window.finished = true;
        blurDiv.style.backgroundColor = 'rgba(0, 0, 255, .1)';
        blurDiv.classList.remove('hidden');
        document.getElementById('main').classList.add('disabled');
        document.getElementById('main').remove();
        return;
    }

    const showingQuestion = window.dataset[next];
    document.getElementById('main').innerText = showingQuestion.reverse ? 
        showingQuestion.ukrainian : 
        showingQuestion.english;

    document.getElementById('input').value = '';
    document.getElementById('input').setAttribute('placeholder', (showingQuestion.reverse ? 'English...' : 'Українська'));

    if (next === 0) return;

    const question = window.dataset[next - 1];

    const correctAnswer = question.reverse ? question.english : question.ukrainian;

    if (correctAnswer === input) {
        infoDiv.innerText = 'Correct!';
        blurDiv.style.backgroundColor = 'rgba(0, 255, 0, .1)';
        blurDiv.classList.remove('hidden');
        blurDiv.focus();
        setTimeout(() => {
            blurDiv.classList.add('hidden');
        }, 200);
    } else {
        infoDiv.innerText = 'Incorrect(\n\nCorrect answer is "' + correctAnswer + '"';
        blurDiv.style.backgroundColor = 'rgba(255, 0, 0, .1)';
        blurDiv.classList.remove('hidden');
        blurDiv.focus();
        window.errors.push({ ...question, answer: input});
    }
}

document.getElementById('btn-next').onclick = () => { next(); };


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap array[i] and array[j]
    }
}

document.getElementById('input').onkeydown = e => {
    if (!blurDiv.classList.contains('hidden')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
    }
}
document.getElementById('input').onkeyup = e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    if (e.code === 'Enter') {
        next();
    }
}

blurDiv.onclick = e => {
    if (window.finished) return;
    blurDiv.classList.add('hidden');
}
window.onkeyup = e => {
    if (!blurDiv.classList.contains('hidden') && (e.code === 'Enter' || e.code === 'Space')) {
        blurDiv.classList.add('hidden');
    }
}
