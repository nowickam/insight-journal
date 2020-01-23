import React, { Component } from "react";
import { Link } from "react-router-dom";
//import "../Welcome/Welcome.css";
import "./Calendar.css"
import { monthNames, monthLengths } from "../data/apiConfig.js"
import modelInstance from "../data/Model";
import calendarInstance from "../data/CalendarModel";


function CalendarDay(props) {
    let profileStatus, weekClassName, weekNumber;
    if (props.entry.profile !== undefined) profileStatus = "definedProfile";
    else profileStatus = "undefinedProfile";

    if (props.day === 1) {
        let tempDate = new Date(props.entry.date);
        weekNumber = tempDate.getDay();
        weekClassName = "first" + weekNumber.toString();
    }
    else
        weekClassName = "notFirst";

    return <Link className={weekClassName + " " + profileStatus + " " + "monthDay"} to="/details" onClick={() => {
            localStorage.setItem("detailsDay",props.day);
            localStorage.setItem("detailsEntry",JSON.stringify(props.entry)); 
            calendarInstance.setDetails(props.entry, props.day);
        }}>
        {props.day}
    </Link>

}


class Calendar extends Component {
    constructor(props) {
        super(props);
        this.date = new Date();

        this.state = {
            userId: modelInstance.getId(),
            status: "LOADING",
            change: false
        }

        this.days;
    }

    mapEntries() {
        if (this.state.userId !== null)
            this.days.map(idx => (
                modelInstance.getDailyCachedEntries(this.state.userId, calendarInstance.getDateTemp(idx))
                    .then((response) => {
                        calendarInstance.setStatus();
                        this.days[response[0].slice(8) - 1] = { date: response[0], text: response[1], profile: response[2] };
                        if (calendarInstance.getStatus() === 0)
                            this.setState({
                                status: "LOADED",
                            });
                    }
                    )
                    .catch(() => {
                        this.setState({
                            status: "ERROR"
                        });
                    })
            ))
    }

    componentDidMount() {
        calendarInstance.addObserver(this);

        if (localStorage !== undefined && localStorage.getItem("userId") !== null) { 
            this.setState((state, props) => { return { userId: localStorage.getItem("userId"), change: true } }); 
        }

        calendarInstance.resetStatus();
        this.days = calendarInstance.getDaysArray();

        //loop through the days in month
        this.mapEntries();

    }

    componentDidUpdate() {
        if (this.state.change === true) {
            this.days = calendarInstance.getDaysArray();

            this.mapEntries();

            this.setState({ change: false })
        }
    }

    update(model, changeDetails) {
        if (changeDetails.type === "new-month") {
            this.setState({
                change: true,
                status: "LOADING"
            })
        }
    }

    render() {
        let calendarEntries = null;

        if (this.state.status === "LOADED") {
            calendarEntries = this.days.map((entry, idx) => (
                <CalendarDay key={(idx + 1)} day={(idx + 1)} entry={entry} />
            ));
        }
        else
            calendarEntries = <p>Loading...</p>


        return <div id="calendar">
            <div id="calendarHeader">
                <button id="left" className="monthChangeButton" onClick={(e) => { calendarInstance.changeMonth(e.target.id); }}>{"<"}</button>
                <button id="right" className="monthChangeButton" onClick={(e) => { calendarInstance.changeMonth(e.target.id) }}>{">"}</button>
                <div id="monthHeader">{calendarInstance.getMonthName() + " " + calendarInstance.getYear()}</div>
            </div>
            <div id="weekDays">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
            </div>
            <div id="monthDays">
                {calendarEntries}
            </div>
        </div>
    }
}

export default Calendar;