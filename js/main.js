import { GAME_STATUS, PAIRS_COUNT } from './constants.js';
import { getRandomColorPairs } from './utils.js';
import {getColorElementList,
    getColorListElement,
    getInActiveColorList,
    getPlayAgainButton,
    getTimerElement} from './selectors.js';

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
    const shouldBlockClick = [GAME_STATUS.BLOCKING,GAME_STATUS.FINISHED].includes(gameState)
    const isClicked = cell.classList.contains('active')
    if(!cell || shouldBlockClick || isClicked) return
    cell.classList.add('active')

    //save clicked cell to selections
    selections.push(cell)
    if(selections.length < 2) return
    gameState = GAME_STATUS.BLOCKING;

    // check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;


    var isMatch = firstColor === secondColor;
    if(isMatch) {
        
      //check win
      const isWin = getInActiveColorList().length === 0;
      if(isWin) {
        //show replay
        showPlayAgainBtn()
        // show you win
        setTimerText('YOU WIN')
        gameState = GAME_STATUS.FINISHED
        return
      }else{
        gameState = GAME_STATUS.PLAYING
        selections = [];
        return 
      }
    }

      setTimeout(() => {
          selections[0].classList.remove('active')
          selections[1].classList.remove('active')
          selections = []
          if(gameState !== GAME_STATUS.PLAYING){
              
              gameState = GAME_STATUS.PLAYING
          }
      },500)
}

function showPlayAgainBtn() {
    const btn = getPlayAgainButton()
    btn.classList.add('show')
}

function hidePlayAgainButton() {
    const btn = getPlayAgainButton()
    btn.classList.remove('show')
}

function initColors() {
    // random 8 pairs of color
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    // bind to li > div.overlay
    const liList = getColorElementList()
    liList.forEach((liEle, index) => {
        liEle.dataset.color = colorList[index
        ]
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

function handlePlayAgainClick() {
    const liList = getColorElementList()
    if(!liList) return

    liList.forEach(liEle => {
        liEle.classList.remove('active');
    })
    //set global variables
    gameState = GAME_STATUS.PLAYING
    selections = []

    hidePlayAgainButton()
    setTimerText('')
    initColors()
    startTimer()
}

function setTimerText(text) {
    const timerElement = getTimerElement();
    if(timerElement) timerElement.textContent = text;
}

function initPlayAgainBtn() {
    const btn = getPlayAgainButton()
    if(!btn) return
    btn.addEventListener('click', (event) => {
        handlePlayAgainClick()
    })
}

function startTimer() {
    let i = 30;
    const timer = setInterval(() => {
        if(gameState === GAME_STATUS.FINISHED) {
            clearInterval(timer)
            
        }else {
            setTimerText(i)
            i--
            if(i < 0) {
                setTimerText('YOU LOSE!')
                gameState = GAME_STATUS.FINISHED
                showPlayAgainBtn()
                clearInterval(timer)
            }
        }
        

    },1000)
}

(() => {
    initColors()

    attachEvetnForColorList()

    initPlayAgainBtn()

    startTimer()
})()
