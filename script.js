// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var numMistakes = 0
var timeRemaining;
var countDown;


function generatePattern(){
  for (let i = 0; i <= 9; i++){
  pattern.push(Math.floor(Math.random() * 6) +1);
  }
  
}


function timer(){
  countDown = countDown - 1;
  if (countDown <= -1) {
    clearInterval(timeRemaining);
    loseGame();
    return;
  }
  document.getElementById("timer").innerHTML = 
    "Time Remaining: " + countDown;
}


function startGame(){
    //initialize game variables
    clearInterval(countDown);
    pattern = []
    progress = 0;
    numMistakes = 0;
    gamePlaying = true;
    generatePattern()
    console.log(pattern)
    for(let i = 0; i < pattern.length; i++){
      console.log(pattern[i])
    }
  
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
  
    //Initialize Lives
    document.getElementById("life1").classList.remove("hidden")
    document.getElementById("life2").classList.remove("hidden")
    document.getElementById("life3").classList.remove("hidden")
  

  
    playClueSequence();
    setTimeout(() => {
      document.getElementById("timer").classList.remove("hidden");
    }, 100);
}


function stopGame(){
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
    document.getElementById("timer").classList.add("hidden");
    clearInterval(countDown);
    clearInterval(timeRemaining);
    
  


}



function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")

}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}




function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);       
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  clearInterval(timeRemaining);
  guessCounter = 0;
  context.resume() //
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
    clueHoldTime -= 30
    countDown =  3*(progress + 2); 
    if(clueHoldTime <=500){
      clueHoldTime = 500
    }
  }
  timeRemaining = setInterval(timer, 1000)
}

function loseGame(){
  stopGame();
  alert("Game Over. YOU LOST.");
}

function winGame(){
  stopGame();
  alert("Game Over. YOU WON!");
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if(guessCounter == progress){
      if(progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
    }else{
      //so far so good... check the next guess
      guessCounter++;
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    numMistakes++;
    if(numMistakes == 1){
      document.getElementById("life1").classList.add("hidden");
    }
    if(numMistakes == 2){
      document.getElementById("life2").classList.add("hidden");
    }
    if(numMistakes == 3){
      document.getElementById("life3").classList.add("hidden");
      loseGame();  
    } else{
      playClueSequence()
    }
    
    
  }
}





// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 550,
  6: 632
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)