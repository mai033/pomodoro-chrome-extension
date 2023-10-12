document.addEventListener("DOMContentLoaded", function () {
    const tleftDisplay = document.getElementById("time-left");
    const playPause = document.getElementById("start_stop");
    const reset = document.getElementById("reset");
    const timerLabel = document.getElementById("timer-label");
    // break & session to reset values (5, 25), and tleftDisplay
    const breakLength = document.getElementById("break-length");
    const sessionLength = document.getElementById("session-length");
    //buttons inc & dec
    const breakIncrement = document.getElementById("break-increment");
    const breakDecrement = document.getElementById("break-decrement");
    const sessionIncrement = document.getElementById("session-increment");
    const sessionDecrement = document.getElementById("session-decrement");
    //audio
    const beepSound = document.getElementById("beep");
    beepSound.volume = 0.1;
    beepSound.autoPlay = true;
    let currentMode = "Session";
    let sessionTime = 25;
    let breakTime = 5;
    let sessionTimeSec = sessionTime * 60;
    let breakTimeSec = breakTime * 60; 
    let isPlaying = false;
    let timeInterval;
    breakLength.innerHTML = breakTime;
    sessionLength.innerHTML = sessionTime;
  
    function updateDisplay(mode) {
      const minutes = Math.floor(mode === "Session" ? sessionTimeSec / 60 : breakTimeSec / 60);
      let seconds = mode === "Session" ? sessionTimeSec % 60 : breakTimeSec % 60;
  
      // Add leading zeros to minutes & seconds if necessary
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  
      // Handle special case: display "00:00" when both minutes & seconds are 0
      if (minutes === 0 && seconds === 0) {
          tleftDisplay.innerHTML = "00:00";
      } else {
          tleftDisplay.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
      } 
    }
  
    function startTimer() {
      if(!isPlaying){
        isPlaying = true;
        timeInterval = setInterval(updateTimer, 1000);
      }
    };
    function stopTimer() {
      if(isPlaying){
        clearInterval(timeInterval);
        isPlaying = false;
      }
    };
    
    function resetTimer() {
      clearInterval(timeInterval);
      isPlaying = false;
      sessionTime = 25;
      sessionLength.innerHTML = 25; // <= changed
      breakTime = 5;
      breakLength.innerHTML = 5; // <= changed
      sessionTimeSec = sessionTime * 60;
      breakTimeSec = breakTime * 60;
      currentMode = "Session";
      updateDisplay("Session");
      document.getElementById("timer-label").innerHTML = currentMode;
      beepSound.pause();
      beepSound.currentTime = 0;
    };
  
    function updateTimer() {
      if (isPlaying) {
        if (sessionTimeSec > 0) {
          sessionTimeSec--;
          updateDisplay("Session");
        } else if (breakTimeSec > 0) {
            timerLabel.innerHTML = "Break";
            updateDisplay("Break");
            if (breakTimeSec === 1) { // Check if breakTimeSec is 00:01
                beepSound.play();
            }
            if (breakTimeSec === 2) { // Check if breakTimeSec is 00:02
              timerLabel.innerHTML = "Session"; // Switch to session timer
              sessionTimeSec = sessionTime * 60;
              updateDisplay("Session");
            }
            breakTimeSec--; // Decrease breakTimeSec by 1
        }

        if (sessionTimeSec === 0 && breakTimeSec === 0) {
          beepSound.play();
          clearInterval(timeInterval);
          isPlaying = false;
          timerLabel.innerHTML = "Session";
          sessionTimeSec = sessionTime * 60;
          breakTimeSec = breakTime * 60; 
          updateDisplay("Session");
        }
      }
    }
    //display for break & session timers - inc & dec.
    function press(key){
      switch (key) {
        case "break-inc":
          if(!isPlaying && breakTime < 60){
            breakTime = (breakTime < 60) ? breakTime + 1 : 60;
            breakLength.innerHTML = breakTime;
            breakTimeSec = breakTime * 60;
            updateDisplay();
          }
          break;
        case "break-dec":
          if(!isPlaying && breakTime > 1){
            breakTime = (breakTime > 1) ? breakTime - 1 : 1;
            breakLength.innerHTML = breakTime;
            breakTimeSec = breakTime * 60;
            updateDisplay();
          }
          break;
        case "sesh-inc":
          if(!isPlaying && sessionTime < 60){
            sessionTime = (sessionTime < 60) ? sessionTime + 1 : 60;
            sessionLength.innerHTML = sessionTime;
            sessionTimeSec = sessionTime * 60;
            updateDisplay("Session");
          }
          break;
        case "sesh-dec":
          if(!isPlaying && sessionTime > 1){
            sessionTime = (sessionTime > 1) ? sessionTime - 1 : 1;
            sessionLength.innerHTML = sessionTime;
            sessionTimeSec = sessionTime * 60;
            updateDisplay("Session");
          }
          break;
      }
    }
  
    breakIncrement.addEventListener("click", function (){
      press("break-inc");
    });
    breakDecrement.addEventListener("click", function () {
      press("break-dec");
    });
    sessionIncrement.addEventListener("click", function (){
      press("sesh-inc");
    });
    sessionDecrement.addEventListener("click", function () {
      press("sesh-dec");
    });
  
    playPause.addEventListener("click", function () {
      if (!isPlaying) {
        playPause.classList.toggle("play-pause");
        startTimer();
        beepSound.play();
      } else if (isPlaying) {
        playPause.classList.add("play-pause");
        stopTimer();
      }
      // press("play-pause");
    });
  
    reset.addEventListener("click", function() {
      resetTimer();
    });
  });