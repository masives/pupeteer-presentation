import React, { useState } from 'react';
import uuid from 'uuid/v4';
import './App.css';

function App() {
  const [luckyNumber, setLuckyNumber] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="App">
      <div>
        <h2>Click this button for lucky number</h2>
        <button
          className="generate-number-button"
          onClick={() => {
            setLuckyNumber(uuid());
          }}
        >
          This one
        </button>

        {Boolean(luckyNumber) && (
          <p className="lucky-number-container">
            Here's your lucky number: <span className="lucky-number">{luckyNumber}</span>
          </p>
        )}

        <br />
        {error && <h1 className="error">{error}</h1>}

        <form
          onSubmit={e => {
            e.preventDefault();
            const luckyNumberInInput = e.target[0];

            if (!luckyNumberInInput.value) {
              setError('Give me you lucky number dumbo');
            } else {
              setLuckyNumber('');
              setError('');
              luckyNumberInInput.value = '';
              alert("you didn't win, sorry");
            }
          }}
        >
          <label>
            Give me your lucky number:
            <input name="number" />
            <button type="submit">click</button>
          </label>
        </form>
      </div>
    </div>
  );
}

export default App;
