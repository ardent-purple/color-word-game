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
const STATES = ['state-start', 'state-game'].map((state) => ({
  name: state,
  dom: document.querySelectorAll(`.${state}`),
}))
const stateDomAll = document.querySelectorAll('.state')

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

const startGame = () => {
  console.log('game restarted')
  switchState('state-game')
}

// start game button handler
const handlePlay = (e) => {
  startGame()
}
document
  .querySelectorAll('.btn-play')
  .forEach((btnPlay) => btnPlay.addEventListener('click', handlePlay))

// render starting screen
switchState('state-start')
