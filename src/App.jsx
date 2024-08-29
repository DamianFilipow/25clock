import { useState, useEffect, useRef } from 'react'

function App() {

  const [breakTimer, setBreakTimer] = useState({
    minutes: 5,
    seconds: 0,
  })
  const [sessionTimer, setSessionTimer] = useState({
    minutes: 25,
    seconds: 0,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isSession, setIsSession] = useState(true)
  const intervalIdRef = useRef(null)
  const sessionTimerRef = useRef(sessionTimer)
  const breakTimerRef = useRef(breakTimer)

   const onOff = () => {
    setIsRunning(!isRunning)
  }

  const reset = () => {
    setSessionTimer(25)
    setBreakTimer(5)
    setIsRunning(false)
  }


  const formatTimer = (time) => {
    const {minutes, seconds} = time
    const minute = minutes < 10 ? "0" + minutes.toString() : minutes.toString()
    const second = seconds < 10 ? "0" + seconds.toString() : seconds.toString()
    return `${minute}:${second}`
  }

  const updateTimer = (event) => {
    if (isRunning) {
      return
    }
    else {
      switch (event.currentTarget.id) {
        case 'break-decrement':
          setBreakTimer(b => b.minutes - 1 <= 0 ? b : {...b,
            minutes: b.minutes - 1,
          });
          break;
        case 'break-increment':
          setBreakTimer(b => b.minutes + 1 > 60 ? b : {...b,
            minutes: b.minutes + 1,
      });
          break;
        case 'session-decrement':
          setSessionTimer(s => s.minutes - 1 <= 0 ? s : {...s,
            minutes: s.minutes - 1,
          });
          break;
        case 'session-increment':
          setSessionTimer(s => s.minutes + 1 > 60 ? s : {...s,
            minutes: s.minutes + 1,
          } );
          break;
      }
    }
  }

  useEffect(() => {

    if(isRunning){
      intervalIdRef.current = setInterval(() => {
      }, 1000)
    }

    return () => {
      clearInterval(intervalIdRef.current)
    }
  }, [isRunning])

  return(
    <div className='main-container'>
      <div className='timer-container'>
        <label htmlFor='time-left' id='timer-label'><strong className='session'>{sessionTimer === 0 ? "Break" : "Session"}</strong></label>
        <div id='time-left'>{isSession ? formatTimer(sessionTimer) : formatTimer(breakTimer)}</div>
      </div>
      <div className='wraper'>
        <div className='break-container'>
          <label htmlFor='break-length' id='break-label'>Break length</label>
          <div id='break-length'>{breakTimer.minutes}</div>
          <div className='wraper-plus-minus'>
            <button id='break-decrement' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Decrement break</span></button>
            <button id='break-increment' onClick={updateTimer} className='btn btn-light rounded-pill px-3'><span className='resize'>Increment break</span></button>
          </div>
        </div>
        <div className='session-container'>
          <label htmlFor='session-length' id='session-label'>Session length</label>
          <div id='session-length'>{sessionTimer.minutes}</div>
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
