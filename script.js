var clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 to 1.0
var guessCounter = 0;
var mistakes;

function startGame(){
    //initialize game variables
    progress = 0;
    mistakes = 0;
    pattern = [];
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("endBtn").classList.remove("hidden");
    randomPattern();
    playClueSequence();
}

 function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
}

function randomPattern(){
  for(let i = 0; i < 4;i++){
    pattern.push(Math.floor(Math.random() * 6) + 1); //pushes 1 to 7 randomly
  }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  guessCounter = 0;
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  if(clueHoldTime > 300){
    clueHoldTime -= 250;
  }
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn){
  //console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }

  if(pattern[guessCounter] == btn){
    if(guessCounter == progress){
      if(progress == pattern.length -1){
        //they won
        winGame();
      }
      else{
        progress++;
        playClueSequence();
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    //they lost
    if(mistakes > 1){
      loseGame();
    }
    else{
      mistakes++;
      playClueSequence();
    }
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You Won!");
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500,
  6: 535.3
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)