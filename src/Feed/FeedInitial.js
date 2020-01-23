import React, { Component } from "react";
import modelInstance from "../data/Model";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      userId: "1"
    }
  }

  componentDidMount() {
    modelInstance.addObserver(this);

    modelInstance
      .getProfile(this.state.userId)
      .then((response) => {
        this.setState({
          status: "LOADED",
          profile: response
        });
      })
      .catch(() => {
        this.setState({
          status: "ERROR"
        });
      });
  }
  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }
  render() {
    //API testing
    let response = null;
    let wordCount = null;
    let big5 = null;
    let txt = "Dear Diary, after I woke up this morning, I made the regrettable decision of waking up. " +
      "I tried to go back to sleep, but I could not even relax. Today was one of those days where either I get up, or I get up. " +
      "I then decided to go outside, but because it was raining, I got wet. I went back inside, felt tired enough to go back to bed, " +
      "but I still had to change out of my wet clothes. Then I got a phone call from you know who. I got so excited that I did not care that I was naked, " +
      "tired, and there was a puddle on the floor. We are going on a date this Friday. I do not know how I am going to sleep. What am I going to wear? " +
      ":naked dance: :singing in the rain: oh diary, one day I will look back on this and say remember when I did not pay attention to anything but the phone " +
      "ringing. FINALLY.";
    switch (this.state.status) {
      case "LOADING":
        response = <p>loading</p>;
        break;
      case "LOADED":
        response = this.state.profile;
        wordCount = this.state.profile.word_count;
        big5 = this.state.profile.personality.map(trait => (
          <p>{trait.name} = {(trait.percentile * 100).toFixed(1)}%</p>
        ));
        console.log(response);
        break;
    }

    //FIREBASE DB testing
    modelInstance.userExists(1).then(r => {
      if (r === false)
        modelInstance.addUser(1);
    });

    let text = { content: "" };

        modelInstance.addEntry(3, "I am happy.")
        .then(modelInstance.addEntry(3, "I am sad."))
        .then(modelInstance.addEntry(3, "I am tired."))
        .then(modelInstance.cacheEntries(3))
        .then(modelInstance.getCachedText(3, "2019-12-20", text))
        .then(console.log(text));

    return (
      <div className="Welcome">
        <Sidebar id="sidebarView"/>
        <div className="Feed">
        <h1>Welcome to Insight Journal</h1>
        <p>The text that has been submited for analasys: <br /> {txt}</p>
        <p>Number of words: {wordCount}</p>
        {big5}
      </div>
      </div>
    );
  }
}

export default Feed;
