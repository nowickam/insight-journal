import React, { Component } from "react";
import { Link } from "react-router-dom";

//import "../Welcome/Welcome.css";

import modelInstance from "../data/Model";
import Sidebar from "../Sidebar/Sidebar";
import calendarInstance from "../data/CalendarModel";
import "./DayDetails.css";

function Personality(props) {
    return <div>
        <div className="profileHeader">What characterizes you:</div>
        <div>{props.data.map(trait => {
            return <div key={trait.trait_id}>
                <div className="traitName">{trait.name}</div>
                {trait.children.map(facet => {
                    if (facet.percentile > 0.6)
                        return <div key={facet.trait_id}>
                            <div className="facet">
                                <div className="facetName">{facet.name}</div>
                                <div className="facetNumber">{(facet.percentile * 100).toFixed(0) + "%"}</div>
                            </div>
                        </div>;
                })}</div>
        })}
        </div>
    </div>
}

function NeedsValues(props) {
    //top 3 traits
    let traits = props.data.sort((a, b) => (a.percentile > b.percentile) ? -1 : (a.percentile < b.percentile) ? 1 : 0).slice(0, 3);

    return <div>
        <div className="profileHeader">{props.title}</div>
        <div>
            {traits.map(trait => {
                return <div key={trait.trait_id}>
                    <div className="facet">
                        <div className="traitName">{trait.name}</div>
                        <div className="traitNumber">{(trait.percentile * 100).toFixed(0) + "%"}</div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

class DayDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: calendarInstance.getDetails().day,
            entry: calendarInstance.getDetails().entry,
        }
    }

    componentDidMount() {
        if (this.state.day === null && localStorage !== undefined && localStorage.getItem("detailsDay") !== undefined) {
            this.setState((state, props) => { return { day: localStorage.getItem("detailsDay"), entry: JSON.parse(localStorage.getItem("detailsEntry")), change: true } });
        }
    }


    render() {
        let profile = null;
        let detailedProfile = null;

        if (this.state.entry === null || this.state.entry.profile === undefined)
            profile = <div id="noProfile">No profile for this day!</div>
        else {
            detailedProfile = <div id="detailedProfile">
                    <Personality data={this.state.entry.profile.personality} />
                    <NeedsValues title="What you need most:" data={this.state.entry.profile.needs} />
                    <NeedsValues title="What is most important to you:" data={this.state.entry.profile.values} />
            </div>;
            profile = <div id="profile">
                    <div id="detailsDate">{this.state.entry.date}</div>
                    <div id="detailsText">{this.state.entry.text}</div>
                    <div id="detailsProfiles">{detailedProfile}</div>
                </div>;
        }

        return <div className="Welcome">
            <Sidebar id="sidebarView" className="sidebarHistory" />
            <div id="dayDetails">
                <Link to="/history" className="backButton">back</Link>
                <div>{profile}</div>
            </div>
        </div>

    }

}

export default DayDetails;