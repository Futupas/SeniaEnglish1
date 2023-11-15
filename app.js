'use strict';

const DATASETS = [
    { name: 'Basic', key: 'basic', size: 108 },
    { name: 'Family and friends', key: 'family', size: 67 },
    { name: 'Food', key: 'food', size: 67 },
    { name: 'Weather', key: 'weather', size: 54 },
];
const COUNT_PER_ONE = 3;

const mainDiv = document.getElementById('main');

for (const dataset of DATASETS) {
    const div = createElement('div', 'dataset');
    const nameDiv = createElement('div', 'name');
    nameDiv.innerText = dataset.name;
    div.appendChild(nameDiv);
    
    {
        const learnDiv = createElement('div', 'buttons');
        const learnNameDiv = createElement('div', 'name');
        learnNameDiv.innerText = 'Learn';
        learnDiv.appendChild(learnNameDiv);
    
        for(let i = 0; i < Math.ceil(dataset.size / COUNT_PER_ONE); i++) {
            const link = createElement('a');
            const key = dataset.key;
            const min = i * COUNT_PER_ONE + 1;
            const max = Math.min(i * COUNT_PER_ONE + COUNT_PER_ONE, dataset.size);
            link.href = `./learn/index.html#${key}-${min}-${max}`;
            link.innerText = `Part ${(i + 1)}`;
            learnDiv.appendChild(link);
        }
        {
            const link = createElement('a');
            link.href = `./learn/index.html#${dataset.key}`;
            link.innerText = `All`;
            learnDiv.appendChild(link);
        }
        div.appendChild(learnDiv);
    }

    {
        const testDiv = createElement('div', 'buttons');
        const testNameDiv = createElement('div', 'name');
        testNameDiv.innerText = 'Test';
        testDiv.appendChild(testNameDiv);
    
        for(let i = 0; i < Math.ceil(dataset.size / COUNT_PER_ONE); i++) {
            const link = createElement('a');
            const key = dataset.key;
            const min = i * COUNT_PER_ONE + 1;
            const max = Math.min(i * COUNT_PER_ONE + COUNT_PER_ONE, dataset.size);
            link.href = `./test/index.html#${key}-${min}-${max}`;
            link.innerText = `Part ${(i + 1)}`;
            testDiv.appendChild(link);
        }
        {
            const link = createElement('a');
            link.href = `./test/index.html#${dataset.key}`;
            link.innerText = `All`;
            testDiv.appendChild(link);
        }
        div.appendChild(testDiv);
    }

    mainDiv.appendChild(div);

}

/** @returns {HTMLElement} */
function createElement(tagName, ...classes) {
    const element = document.createElement(tagName);
    element.classList.add(...classes);
    return element;
}
