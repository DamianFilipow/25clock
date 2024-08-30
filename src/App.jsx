import { useState, useEffect, useRef } from 'react'

function App() {

  const [breakTimerValue, setBreakTimerValue] = useState(5)
  const [sessionTimerValue, setSessionTimerValue] = useState(25)
  const [sessionTimer, setSessionTimer] = useState(1500)
  const [breakTimer, setBreakTimer]  = useState(300)
  const [isRunning, setIsRunning] = useState(false)
  const [isSession, setIsSession] = useState(true)
  const intervalIdRef = useRef(null)
  const beepRef = useRef(null);

   const onOff = () => {
    setIsRunning(!isRunning)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60;

    const formatedMinutes = String(minutes).padStart(2, '0')
    const formatedSeconds = String(seconds).padStart(2, '0')

    return `${formatedMinutes}:${formatedSeconds}`
  }

  const reset = () => {
    setBreakTimerValue(5)
    setSessionTimerValue(25)
    setSessionTimer(25 * 60)
    setBreakTimer(5 * 60)
    setIsRunning(false)
    setIsSession(true)
    clearInterval(intervalIdRef.current)
    beepRef.current.pause()
    beepRef.current.currentTime = 0
  }

  const decrementBreak = () => {
    if (breakTimerValue - 1 > 0) {
      setBreakTimerValue(b => b - 1);
      setBreakTimer(b => b - 60)
    }
  }

  const incrementBreak = () => {
    if (breakTimerValue + 1 <= 60) {
      setBreakTimerValue(b => b + 1);
      setBreakTimer(b => b + 60)
    }
  }

  const decrementSession = () => {
    if (sessionTimerValue - 1 > 0) {
      setSessionTimerValue(s => s - 1);
      setSessionTimer(s => s - 60)
    }
  }

  const incrementSession = () => {
    if (sessionTimerValue + 1 <= 60) {
      setSessionTimerValue(s => s + 1);
      setSessionTimer(s => s + 60)
    }

  }

  const updateTimer = (event) => {
    if (isRunning) {
      return
    }
    else {
      switch (event.currentTarget.id) {
        case 'break-decrement':
          decrementBreak()
          break;
        case 'break-increment':
          incrementBreak()
          break;
        case 'session-decrement':
          decrementSession()
          break;
        case 'session-increment':
          incrementSession()
          break;
      }
    }
  }


  useEffect(() => {
    if (!isRunning) return;
    clearInterval(intervalIdRef.current)
    intervalIdRef.current = setInterval(() => {
      if (isSession) {
        setSessionTimer(prev => {
          if (prev === 0) {
            beepRef.current.play();
            setIsSession(false);
            return breakTimer;
          }
          return prev - 1;
        });
      } else {
        setBreakTimer(prev => {
          if (prev === 0) {
            beepRef.current.play();
            setIsSession(true);
            return sessionTimer;
          }
          return prev - 1;
        });
      }
    }, 1000);
  
    return () => clearInterval(intervalIdRef.current);

  }, [isRunning, isSession, breakTimer, sessionTimer]);

  return(
    <div className='main-container'>
      <audio id='beep' ref={beepRef} src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      <div className='timer-container'>
        <label htmlFor='time-left' id='timer-label'><strong className='session'>{isSession ? "Session" : "Break"}</strong></label>
        <div id='time-left'>{isSession ? formatTime(sessionTimer) : formatTime(breakTimer)}</div>
      </div>
      <div className='wraper'>
        <div className='break-container'>
          <label htmlFor='break-length' id='break-label'>Break length</label>
          <div id='break-length'>{breakTimerValue}</div>
          <div className='wraper-plus-minus'>
            <button id='break-decrement' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Decrement break</span></button>
            <button id='break-increment' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Increment break</span></button>
          </div>
        </div>
        <div className='session-container'>
          <label htmlFor='session-length' id='session-label'>Session length</label>
          <div id='session-length'>{sessionTimerValue}</div>
          <div className='wraper-plus-minus'>
            <button id='session-decrement' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Decrement session</span></button>
            <button id='session-increment' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Increment session</span></button>
          </div>
        </div>
      </div>
      <div className='buttons-container'>
        <button id='start_stop' onClick={onOff} className='btn btn-success rounded-pill px-3'>{isRunning ? "Stop" : "Start"}</button>
        <button id='reset' onClick={reset} className='btn btn-danger rounded-pill px-3'>Reset</button>
      </div>
    </div>
  )
}

export default App