import { GAME_STATUS, PAIRS_COUNT } from './constants.js';
import { getRandomColorPairs } from './utils.js';
import {getColorElementList,
    getColorListElement} from './selectors.js';

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColoClick(cell) {
    if(!cell) return
    cell.classList.add('active')
}

function initColors() {
    // random 8 pairs of color
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    // bind to li > div.overlay
    const liList = getColorElementList()
    liList.forEach((liEle, index) => {
        const overlayElement = liEle.querySelector('.overlay')
        if(overlayElement) overlayElement.style.backgroundColor = colorList[index]
    })
}

function attachEvetnForColorList() {
    const ulElement = getColorListElement()
    if(!ulElement) return

    ulElement.addEventListener('click', (event) => {
        if(event.target.tagName !== 'LI') return
        handleColoClick(event.target)
    })
}

(() => {
    initColors()

    attachEvetnForColorList()
})()
