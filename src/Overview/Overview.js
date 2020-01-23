import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { Radar } from "react-chartjs-2";
//import { Link } from "react-router-dom";
import "../Welcome/Welcome.css";
import Sidebar from "../Sidebar/Sidebar";
import modelInstance from "../data/Model";

function MainPersonality(props) {
  let maxVal = 0;
  let mainTrait = null;
  props.data.map(trait => {
    if (trait.percentile > maxVal) {
      maxVal = trait.percentile;
      mainTrait = trait.name;
    }
    else { }
  });
  return <div>
    <div className="profileHeader">What characterizes you:</div>
    <div>{props.data.map(trait => {
      if (trait.name === mainTrait)
        return <div className="mainPersonality" key={trait.trait_id}>
          <div className="mainTitle">
            Your defining personality type is <b>{trait.name}</b>. {modelInstance.getPersonalityType(trait.name)}
            <br/><div id="traitTitle">Your traits:</div>
        </div>
          {trait.children.map(facet => {
            if (facet.percentile > 0.6)
              return <div key={facet.trait_id}>
                <div className="facet">
                  <div className="facetName">{facet.name}</div>
                  <div className="facetNumber">{(facet.percentile * 100).toFixed(0) + "%"}</div>
                </div>
              </div>;
          })}
        </div>
    })}
    </div>
  </div>
}

function MainValues(props) {
  //top 3 traits
  let traits = props.data.sort((a, b) => (a.percentile > b.percentile) ? -1 : (a.percentile < b.percentile) ? 1 : 0).slice(0, 3);

  return <div>
    <div className="profileHeader">{props.title}</div>
    <div className="mainTitle">Your {props.valueType} are
            {traits.map(trait => {
      return <b key={trait.trait_id}> {trait.name} ({(trait.percentile * 100).toFixed(0) + "%"}) </b>
    })}
    </div>
  </div>
}


class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "LOADING",
      userId: modelInstance.getId(),
      mainTrait: null,
      change: false,
      width: 0,
      height:0
    }
  }

  fetchAllEntries() {
    modelInstance.getAllTextEntries(this.state.userId)
      .then((txt) => {
        if (txt.length > 100) {
          modelInstance.fetchDailyProfile(txt)
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
        else {
          this.setState({
            status: "LOADED",
            profile: false
          });
        }
      })
      .catch(() => {
        this.setState({
          status: "ERROR"
        });
      });
  }

  updateWindowDimensions() {
    console.log(window.innerWidth);
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    modelInstance.addObserver(this);
    this.updateWindowDimensions();
    window.addEventListener('resize', function () {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }.bind(this));

    if (localStorage !== undefined && localStorage.getItem("userId") !== null) { this.setState((state, props) => { return { userId: localStorage.getItem("userId"), change: true } }); }

    if (this.state.userId !== null)
      this.fetchAllEntries();
  }

  componentDidUpdate() {
    if (this.state.change === true) {
      this.fetchAllEntries();
      this.setState({ change: false });
    }
  }

  componentWillUnmount() {
    modelInstance.removeObserver(this);
  }

  render() {
    let response = null;
    let wordCount = null;
    let chartData = null;
    let percentile = null;
    let overviewProfile = null;
    let radar = null;
    switch (this.state.status) {
      case "LOADING":
        response = <p>loading</p>;
        break;
      case "LOADED":
        if (this.state.profile !== false) {
          wordCount = this.state.profile.word_count;
          percentile = this.state.profile.personality.map(trait => (
            (trait.percentile * 100).toFixed(1)
          ));
          chartData =
          {
            labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional range'],
            datasets: [{
              label: 'Big 5 personality types',
              backgroundColor: 'rgb(175, 211, 198,0.5)',
              borderColor: 'rgb(175, 211, 198)',
              data: percentile,
              pointRadius: 7,
              pointHoverRadius: 15
            }]
          }
          radar = <Radar
            data={chartData}
            options={{
              scale: {
                pointLabels: {
                  fontSize: this.state.width/60,
                }
              },
              tooltips: {
                titleFontSize: this.state.width/60,
                bodyFontSize: this.state.width/70,
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function(tooltipItems, data) { 
                        return data.labels[tooltipItems.index] + ' : ' + modelInstance.getPersonalityDescription(tooltipItems.index);
                    }
                }
            },
              maintainAspectRatio: true,
              //responsive: true,
              
            }

            }
            //height={this.state.height/2}
            //width={this.state.width/20}
          />;
        }
        break;
    }
    if (this.state.profile === undefined)
      overviewProfile = <div><i>Loading</i></div>
    else {
      if (this.state.profile !== false) {
        overviewProfile = <div id="overviewProfile">
          <div className="mainTitle">This analysis is based on all of your entries: {wordCount} words in total.</div>
          <div>
            <MainPersonality data={this.state.profile.personality} />
          </div>
          <div>
            <MainValues title="What you need most:" valueType="needs" data={this.state.profile.needs} />
          </div>
          <div>
            <MainValues title="What is most important to you:" valueType="values" data={this.state.profile.values} />
          </div>
        </div>;
      }
      else
        overviewProfile = <p>You have to submit at least 100 words in total!</p>
    }

    return (
      <div className="Welcome">
        <Sidebar id="sidebarView" />
        <div className="Overview">
          <div>{radar}</div>
          <div id="mainTraits">{overviewProfile}</div>
        </div>
      </div>
    );
  }
}

export default Overview;