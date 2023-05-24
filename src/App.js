import { useState, useEffect, useRef } from 'react';
import randomWords from 'random-words';
import './App.css';
import banner from './typing.png'

const TOTALWORDS = 200;

function App() {
  const seconds=60
  const [words, setWords] = useState([]);
  const [currChar, setCurrChar] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState('');
  const [countDown, setCountDown] = useState(seconds);
  const [currInput, setCurrInput] = useState('');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [keyCount, setKeyCount] = useState(0);
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === 'start') {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(TOTALWORDS).fill(null).map(() => randomWords());
  }

  function start() {
    if (status === 'completed') {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar('');
      setKeyCount(0);
    }

    if (status !== 'start') {
      setStatus('start');
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus('completed');
            setCurrInput('');
            return seconds;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    if (keyCode === 32) {
      checkMatch();
      setCurrInput('');
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar('');
    } else {
      setKeyCount((prevCount) => prevCount + 1);
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'completed') {
      if (char === currChar) {
        return 'bg-success';
      } else {
        return 'bg-danger';
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'bg-danger';
    } else {
      return '';
    }
  }

  useEffect(() => {
    setCountDown(seconds);
  }, [seconds]);

  return (
    <div style={{backgroundImage:`url(${banner})`,backgroundSize:"cover",height:"100vh",margin:"10px"}} >
      <div className="row">
        <div className="col text-center">
        <h1 style={{margin:"40px",padding:"20px"}}>Typing Speed Tester</h1>
          <h2 className="text-primary display-1">{countDown}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <input
            ref={textInput}
            disabled={status !== 'start'}
            type="text"
            className="form-control inputbox"
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <button className="btn btn-primary button is-info" onClick={start}>
            Start
          </button>
        </div>
      </div>
      {status === 'start' && (
        <div className="row m-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split('').map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === 'completed' && (
        <div className="row mt-4">
          <div className="col">
            <div className="row">
              <div className="col text-center">
                <p className="h3 text-black">Number of Words Per Minute</p>
                <p className="bo display-1">
                  {correct}
                </p>
              </div>
              <div className="col text-center">
                <p className="h3">Accuracy</p>
                {correct !== 0 ? (
                  <p className=" display-1 bo">{Math.round((correct / (correct + incorrect)) * 100)}%</p>
                ) : (
                  <p className=" display-1">0%</p>
                )}
              </div>
              <div className="col text-center">
                <p className="h3">Key Pressed</p>
                <p className="display-1 bo">{keyCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
