import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Welcome/Welcome.css";
import Sidebar from "../Sidebar/Sidebar";
import Calendar from "./Calendar";

class History extends Component {
  render() {
    return (
      <div className="Welcome">
        <Sidebar id="sidebarView"/>
        <div className="Feed">
          <Calendar/>
        </div>
      </div>
    );
  }
}

export default History;