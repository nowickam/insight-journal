import React, { Component } from "react";
import modelInstance from "../data/Model";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import "./Feed.css"

function EntryItem(props) {
  return <div className="entryItem">
    <div className="entryContent">{props.entry.data().content}</div>
    <button className="deleteButton" onClick={() => handleEntryDelete(props.id,props.entry.data().created)}>X</button>
  </div>
}

function handleEntryDelete(id,created) {
  modelInstance.deleteEntry(id, created);
}

function handleEnter(e, props) {
  if (e.key === "Enter") {
    e.preventDefault();
    modelInstance.addEntry(props.id, props.this.state.input);
    props.this.setState({ input: "" });
  }
}

function handleClick(props) {
  modelInstance.addEntry(props.id, props.this.state.input);
  props.this.setState({ input: "" });
}

function handleFinish(props) {
  modelInstance.cacheEntries(props.id, modelInstance.getToday())
    .then(text => modelInstance.fetchDailyProfile(text))
    .then(response => modelInstance.assignDailyProfile(props.id, modelInstance.getToday(), response))
    .catch(e => console.log(e));
}

function EntryInput(props) {
  return (<div id="entryPanel">
    <input id="entryInput" type="text" value={props.this.state.input} placeholder="How are you feeling?" onKeyDown={(e) => handleEnter(e, props)} onChange={e => props.this.setState({ input: e.target.value })} />
    <button className="feedButton send" onClick={() => handleClick(props)}>Save</button>
    <button className="feedButton finish" onClick={() => handleFinish(props)} disabled={props.this.state.button}>Finish</button>
  </div>)
}

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      userId: modelInstance.getId(),
      change: false,
      input: "",
      button: true
    }
  }

  fetchCurrentEntries() {
    return modelInstance
      .getCurrentEntries(this.state.userId)
      .then((response) => {
        this.setState({
          status: "LOADED",
          currentEntries: response
        });
      })
      .catch(() => {
        this.setState({
          status: "ERROR"
        });
      });
  }

  handleDisabling(text){
    if(text.length<100)
        return true;
      else{
        return modelInstance.entryExists(this.state.userId,modelInstance.getToday());
      }
  }

  componentDidMount() {
    modelInstance.addObserver(this);
    if(localStorage!==undefined && localStorage.getItem("userId")!==null)
      {this.setState((state,props)=>{return {userId: localStorage.getItem("userId"),change: true}});}

    if (this.state.userId !== "" && this.state.userId !== null) {
      this.fetchCurrentEntries()
      .then(()=>modelInstance.getEntriesText(this.state.userId))
      .then(response=>this.handleDisabling(response))
      .then(response=>this.setState({button:response}))
    }
    else {
      this.setState({
        status: "LOADING"
      });
    }
  }

  componentDidUpdate() {
    if (this.state.change === true) {
      this.fetchCurrentEntries()
      .then(()=>modelInstance.getEntriesText(this.state.userId))
      .then(response=>this.handleDisabling(response))
      .then(response=>this.setState({button:response}));
      this.setState({ change: false });
    }
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  update(model, changeDetails) {
    if (changeDetails.type === "new-entry") {
      this.setState({
        change: true
      });
    }

    if (changeDetails.type === "new-user") {
      this.setState({
        userId: model.getId(),
        change: true
      });
    }
  }

  render() {
    let entryList = null;
    let entryInput = null;

    switch (this.state.status) {
      case "LOADING":
        entryList = <em>Loading...</em>;
        break;
      case "LOADED":
        entryList = this.state.currentEntries.map(entry => (
          <EntryItem key={entry.id} id={this.state.userId} entry={entry} />
        ));
        entryInput = <EntryInput id={this.state.userId} this={this} />;
        break;
      default:
        entryList = <b>Failed to load data, please try again</b>;
        break;
    }

    return (
      <div className="Welcome">
        <Sidebar id="sidebarView" />
        <div id="feedContainer" className="Feed">
          <div id="entryList">
            {entryList}
          </div>
          {entryInput}
        </div>
      </div>
    );
  }
}

export default Feed;
