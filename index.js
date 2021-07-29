'use strict'
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
const grammar =
  '#JSGF V1.0; grammar colors; public <color> = ' +
  colors.map((color) => color.name.toLowerCase()).join(' | ') +
  ' ;'
window.SpeechRecognition = window.webkitSpeechRecognition
window.SpeechGrammarList = window.webkitSpeechGrammarList
const STATES = ['state-start', 'state-game', 'state-unsupported'].map(
  (state) => ({
    name: state,
    dom: document.querySelectorAll(`.${state}`),
  })
)
const stateDomAll = document.querySelectorAll('.state')
const playfield = document.querySelector('.playfield')

// renders needed logical state
const switchState = (state) => {
  if (!STATES.map((stateItem) => stateItem.name).includes(state)) {
    console.warn(
      `${state} is not in the list of awailable states: ${STATES.join(', ')}`
    )
    return
  }
  stateDomAll.forEach((stateDom) => stateDom.classList.remove('active'))
  STATES.find((stateItem) => stateItem.name === state).dom.forEach((stateDom) =>
    stateDom.classList.add('active')
  )
}

// forms a HTML string & array of words for the game
const formWords = (amount = 30) => {
  let wordsHtml = ''
  let wordsArray = []
  const n = colors.length
  for (let i = 0; i < amount; i += 1) {
    const word = colors[Math.floor(n * Math.random())].name
    const colorIndex = Math.floor(n * Math.random())
    const { name: colorName, color: colorHex } = colors[colorIndex]

    wordsHtml += `<span data-answer="${colorName.toLowerCase()}" style="color: ${colorHex};">${word}</span>`
    wordsArray.push(colorName.toLowerCase())
  }
  return {
    wordsHtml,
    wordsArray,
  }
}

// init speech recognition
const recognition = new window.SpeechRecognition()
const recognitionList = new window.SpeechGrammarList()
recognitionList.addFromString(grammar, 1)
recognition.lang = 'en-US'
let isPlaying = false

const hits = document.querySelector('.hits')
const misses = document.querySelector('.misses')
const total = document.querySelector('.total')

const startGame = () => {
  console.log('game restarted')
  isPlaying = true

  // make words
  const { wordsHtml, wordsArray } = formWords(10)
  playfield.innerHTML = wordsHtml
  console.log(wordsArray)

  // show state to the player
  switchState('state-game')

  let currentWordIndex = 0
  const wordsDom = playfield.querySelectorAll('span')
  let hitsCount = 0
  let missesCount = 0
  hits.textContent = hitsCount
  misses.textContent = missesCount
  total.textContent = currentWordIndex

  const handleSpeechResult = (e) => {
    const checkDone = () => {
      if (currentWordIndex >= wordsDom.length) {
        recognition.removeEventListener('result', handleSpeechResult)
        isPlaying = false
        return true
      }
    }
    // check if we're done
    checkDone()

    // recognize result
    const tryWords = e.results[0][0].transcript.split(' ')

    // check word by word
    for (let tryWord of tryWords) {
      const wordDom = wordsDom[currentWordIndex]
      const answer = wordDom.dataset.answer
      wordDom.removeAttribute('style')

      if (tryWord === answer) {
        wordDom.classList.add('hit')
        hitsCount += 1
      } else {
        wordDom.classList.add('miss')
        missesCount += 1
      }

      hits.textContent = hitsCount
      misses.textContent = missesCount
      currentWordIndex += 1
      total.textContent = currentWordIndex
      if (checkDone()) return
    }
  }

  recognition.addEventListener('result', handleSpeechResult)
  recognition.addEventListener('end', (e) => {
    if (isPlaying) {
      recognition.start()
    }
  })
  recognition.start()
}

// start game button handler
const handlePlay = (e) => {
  startGame()
}
document
  .querySelectorAll('.btn-play')
  .forEach((btnPlay) => btnPlay.addEventListener('click', handlePlay))

// init game
// check speech recognition
if (!window.webkitSpeechRecognition) {
  switchState('state-unsupported')
} else {
  switchState('state-start')
}
