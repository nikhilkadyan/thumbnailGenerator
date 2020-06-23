import React, { Component } from 'react';
import { render } from 'react-dom';
import ThumbGenerator from './ThumbGenerator';
import './style.css';

const App = () => {
    return (
      <div>
        <ThumbGenerator />
        <p>
          Start editing to see some magic happen :)
        </p>
      </div>
    );
}

render(<App />, document.getElementById('root'));
