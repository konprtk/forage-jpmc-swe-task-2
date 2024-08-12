import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[],
}

class App extends Component<{}, IState> {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(props: {}) {
    super(props);
    this.state = {
      data: [],
    };
  }

  renderGraph() {
    return (<Graph data={this.state.data}/>)
  }

  getDataFromServer() {
    const fetchData = () => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        if (serverResponds.length > 0) {
          this.setState({ data: [...this.state.data, ...serverResponds] });
        } else {
          // Stop the interval if no more data
          if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
          }
        }
      });
    };

    // Fetch data every 100ms
    this.intervalId = setInterval(fetchData, 100);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => this.getDataFromServer()}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
