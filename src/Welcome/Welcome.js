import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";
import Sidebar from "../Sidebar/Sidebar";
//import Feed from "../Feed/Feed.js";
import modelInstance from "../data/Model";
import { Redirect } from 'react-router-dom';

class Welcome extends Component {
  constructor(props){
    super(props);
    this.state={
      username:"",
      password: "",
      correct: false,
      change: false,
      status: "NULL"
    }
  }

  addHandler=()=>{
    modelInstance.addUser(this.state.username,this.state.password);
  }
  loginHandler=()=>{
    modelInstance.checkPassword(this.state.username, this.state.password);
  }
  componentDidMount() {
    modelInstance.addObserver(this);
  }
  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }
  update(model, changeDetails) {
    if (changeDetails.type === "login") {
      if (changeDetails.correct)
        {
          this.setState({ status: "CORRECT" });
          localStorage.setItem("userId",model.getId());
        }
      else
        this.setState({ status: "FALSEPASS" });
    }
    if (changeDetails.type === "new-user") {
		if (changeDetails.added)
    {
      this.setState({ status: "CORRECT" });
      localStorage.setItem("userId",model.getId());
    }
		else
			this.setState ({ status: "NOTADDED" });
	}
  }
  render() {
	let linkTo = "/";
	let msg = null;
	if (this.state.status === "CORRECT")
		return <Redirect to="/feed" />
    switch (this.state.status) {
      case "NULL":
        break;
      case "FALSEPASS":
        msg = <p>The username or password you entered is incorrect</p>
        break;
      case "NOTADDED":
        msg = <p>The user already exist</p>
        break;
	}


    return (
      <div className="Welcome">
        <div className="Feed">
          <div id="username">
            <label>Username:</label>
            <input id="usernameInput" onChange={e=> this.setState({username: e.target.value})}/>
          </div>
          <div id="password">
            <label>Password:</label>
            <input type="password" onChange={e=> this.setState({password: e.target.value})}/>
          </div>
          <Link to={linkTo}  onClick={this.addHandler}>
		    <button id="logBtn">Create user</button>
          </Link>
          <Link to={linkTo}  onClick={this.loginHandler}>
            <button id="logBtn">Log in</button>
          </Link>
          {msg}
        </div>
      </div>
    );
  }
}

export default Welcome;
