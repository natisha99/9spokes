import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar'

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <h2>Google Finance</h2>

        <h2>Google Trends</h2>

        <h2>Twitter</h2>
        * #<br/>
        <h2>Companies Office</h2>
        * Shares <br/><br/> * Main names
      </div>
    );
  }
}

export default App;
