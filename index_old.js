'use strict'
// DOM
const game = document.querySelector('.game')

// game data
const colors = [
  {
    name: 'Yellow',
    color: '#e6e600',
  },
  {
    name: 'Green',
    color: '#009933',
  },
  {
    name: 'Red',
    color: '#ff0000',
  },
  {
    name: 'Blue',
    color: '#0000ff',
  },
  {
    name: 'Purple',
    color: '#ff00ff',
  },
]
const states = {
  'not-compatible': {},
  'mic-block': {},
  'enable-mic': {},
  play: {},
  gameplay: {},
  'game-over': {},
}

let currentState = null
const renderState = () => {
  game.innerHTML = document.querySelector(`.${currentState}`).innerHTML
}

let recognition = null
let isPlaying = false
const handleRecognitionResult = (e) => {
  if (!isPlaying) return
  console.log(e.results)
}
const handleRecognitionEnd = (e) => {
  if (!isPlaying) return
  recognition.start()
  console.log('rec restarted')
}
const initRecognition = () => {
  recognition = new window.SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = false
  recognition.interimResults = false
  recognition.maxAlternatives = 3
  recognition.addEventListener('result', handleRecognitionResult)
  recognition.addEventListener('end', handleRecognitionEnd)
}
// initialize game:
// - check compatibility (webkitSpeechRecognition)
// - show the rules
// - ask for microphone
const initGame = () => {
  if (!window.webkitSpeechRecognition) {
    currentState = 'not-compatible'
    renderState()
    return
  }
  window.SpeechRecognition = window.webkitSpeechRecognition
  initRecognition()

  currentState = 'play'
  renderState()
}
initGame()

const startGame = (e) => {
  recognition.start()
  currentState = 'gameplay'
  renderState()
}

game.addEventListener('click', (e) => {
  // play button clicked
  if (e.target.matches('.btn-green')) {
    startGame()
  }
})
