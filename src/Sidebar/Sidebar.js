import React, { Component } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <div className="Sidebar">
        <Link id="feedLink" to="/feed">
          <h3>FEED</h3>
        </Link>
        <Link id="historyLink" to="/history">
          <h3>HISTORY</h3>
        </Link>
        <Link id="overviewLink" to="/overview">
          <h3>OVERVIEW</h3>
       </Link>
       <Link id="helpLink" to="/help">
          <h3>HELP</h3>
       </Link>
      </div>
    );
  }
}

export default Sidebar;
