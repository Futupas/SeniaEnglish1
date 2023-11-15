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
    window.mistakes = [];
    next();
}


initialize();
window.onhashchange = () => { initialize(); }

let afterBlurClose = undefined;

function next() {
    //todo divide into 'Check previos' and 'Prepare next'
    const input = document.getElementById('input').value.trim().toLowerCase();
    if (window.current !== -1 && !input?.length) {
        return;
    }

    const next = window.current + 1;
    window.current = next;

    if (next !== window.dataset.length) {
        const showingQuestion = window.dataset[next];
        document.getElementById('main').innerText = showingQuestion.reverse ? 
            showingQuestion.ukrainian : 
            showingQuestion.english;
        document.getElementById('input').value = '';
        document.getElementById('input').setAttribute('placeholder', (showingQuestion.reverse ? 'English...' : 'Українська'));
    }


    if (next === 0) return;

    const question = window.dataset[next - 1];

    const correctAnswer1 = question.reverse ? question.english : question.ukrainian;
    const correctAnswer2 = question.reverse ? question.english : question.russian;

    function checkLast() {
        if (next === window.dataset.length - 1) {
            document.getElementById('btn-next').innerText = 'Finish';
        } else if (next === window.dataset.length) {
            infoDiv.innerText = generateFinishingText();
            sendMessageToBot(generateTgBotText());
            window.finished = true;
            blurDiv.style.backgroundColor = 'rgba(0, 0, 255, .1)';
            blurDiv.classList.remove('hidden');
            document.getElementById('main').classList.add('hidden');
            return;
        }
    }

    if (correctAnswer1 === input || correctAnswer2 === input) {
        infoDiv.innerText = 'Correct!';
        blurDiv.style.backgroundColor = 'rgba(0, 255, 0, .1)';
        blurDiv.classList.remove('hidden');
        setTimeout(() => {
            blurDiv.classList.add('hidden');
            checkLast();
        }, 500);
    } else {
        infoDiv.innerText =  correctAnswer1 === correctAnswer2 ? 
            `Incorrect(\n\nCorrect answer is "${correctAnswer1}"` :
            `Incorrect(\n\nCorrect answer is "${correctAnswer1}" or "${correctAnswer2}"`;
        blurDiv.style.backgroundColor = 'rgba(255, 0, 0, .1)';
        blurDiv.classList.remove('hidden');
        window.mistakes.push({ ...question, answer: input});
        afterBlurClose = () => {
            checkLast();
        }
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
    if (afterBlurClose) afterBlurClose();
}
window.onkeyup = e => {
    if (!blurDiv.classList.contains('hidden') && (e.code === 'Enter' || e.code === 'Space')) {
        blurDiv.classList.add('hidden');
        if (afterBlurClose) afterBlurClose();
    }
}

function generateFinishingText() {
    const count = window.dataset.length;
    const mistakes = window.mistakes.length;
    const correct = count - mistakes;
    const percentage = Math.round(correct / count * 100 * 100) / 100;
    
    let text = `Your score is ${correct}/${count} (${percentage}%)`;

    if (mistakes) {
        text += '\n\nMistakes:'
        for (const mistake of window.mistakes) {
            const word = mistake.reverse ? mistake.ukrainian : mistake.english;
            const answer = mistake.answer;
            const correct = mistake.reverse ? mistake.english : mistake.ukrainian;
            text += `\n${word} → ${answer}. Correct is \"${correct}\"`;
        }
    } else {
        text += '\n\nCongratulations!'
    }

    return text;
}
function generateTgBotText() {
    const count = window.dataset.length;
    const mistakes = window.mistakes.length;
    const correct = count - mistakes;
    const percentage = Math.round(correct / count * 100 * 100) / 100;
    
    const datasetName = document.getElementById('dataset-name').innerText;
    const all = window.hashExplained.all ? 
        'all' :
        `${window.hashExplained.starting}-${window.hashExplained.ending}`;

    let text = `Senia finished English test (${datasetName} - ${all})`;
    text += `\nThe score is ${correct}/${count} (${percentage}%)`;

    if (mistakes) {
        text += '\n\nMistakes:'
        for (const mistake of window.mistakes) {
            const word = mistake.reverse ? mistake.ukrainian : mistake.english;
            const answer = mistake.answer;
            const correct = mistake.reverse ? mistake.english : mistake.ukrainian;
            text += `\n${word} → ${answer}. (${correct})`;
        }
    } else {
        text += '\nVery good!'
    }

    return text;
}

const BOT_TOKEN = '1375310609:AAFs1LGHjV8l_zgm0B1uy_0HV7ZFYoukjKg';
const MY_TG_ID = '387489833';

async function sendMessageToBot(message) {
	const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_TG_ID}&text=${encodeURI(message).replaceAll('+', '%2b')}&parse_mode=html`;
	const req = await fetch(url, { mode: 'cors' });
	const res = await req.json();
    if (res.error_code === 429) { // 429 Too Many Requests
        const timeToSleep = (res.parameters?.retry_after || (Math.random() * 5 + 5)) * 1000;
        await sleep(timeToSleep);
        return sendMessageToBot(message);
    }
	return res.ok === true;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

