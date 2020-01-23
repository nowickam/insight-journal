import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import Welcome from "./Welcome/Welcome";
import modelInstance from "./data/Model";
import History from "./History/History";
import Overview from "./Overview/Overview";
import Feed from "./Feed/Feed";
import Help from "./Help/Help";
import DayDetails from "./History/DayDetails"
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Insight Journal",
    };
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Link to="/"><h1 className="App-title">{this.state.title}</h1></Link>
        </div>
        <Route exact path="/"
          render={() => <Welcome />}
        />
        <Route
          path="/feed"
          render={() => <Feed />}
        />
        <Route
          path="/history"
          render={() => <History />}
        />
        <Route
          path="/overview"
          render={() => <Overview model={modelInstance} />}
        />
        <Route
          path="/details"
          render={() => <DayDetails/>}
        />
        <Route
          path="/help"
          render={()=><Help/>}
        />
      </div>
    );
  }
}



export default App;
