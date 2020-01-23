import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Help/Help.css";
import Sidebar from "../Sidebar/Sidebar";

class Help extends Component {
    render() {
        return (
            <div className="Welcome">
                <Sidebar id="sidebarView" />
                <div className="Help">
                    <div className="helpText"><div id="textTitle">Insight journal</div> is a project done for DH2642HT192 Interaction Programming & Dynamic Web course by <span className="bold">Malgorzata Nowicka and Saga Harnesk.</span> </div>
                    <div className="helpTitle">About:</div>
                    <div className="helpText">The user submits daily notes about his/her mood. Upon finishing the day the messages are sent to IBM Personalty Insights API that evaluates the user’s personality based on their text. <span className="bold">The text can be sent once per day, with the overall length of at lest 100 words.</span> The user can view the history of his/her notes and evaluations (in the calendar), and see the overview of his/her personality. The user data and his/her messages are stored in Firebase Cloud Firestore.</div>
                    <div className="helpTitle">How we evaluate your personality:</div>
                    <div className="helpText">"IBM Personality Insights service is based on the psychology of language in combination with data analytics algorithms. The service analyzes the content that you send and returns a personality profile for the author of the input. The service infers personality characteristics based on three models:
                        Big Five personality characteristics represent the most widely used model for generally describing how a person engages with the world. The model includes five primary dimensions:
                        <ul>
                            <li><span className="bold">Agreeableness</span> is a person's tendency to be compassionate and cooperative toward others.</li>
                            <li><span className="bold">Conscientiousness</span> is a person's tendency to act in an organized or thoughtful way.</li>
                            <li><span className="bold">Extraversion</span> is a person's tendency to seek stimulation in the company of others.</li>
                            <li><span className="bold">Emotional range</span>, also referred to as Neuroticism or Natural reactions, is the extent to which a person's emotions are sensitive to the person's environment.</li>
                            <li><span className="bold">Openness</span> is the extent to which a person is open to experiencing different activities.</li>
                        </ul>
                        Each of these top-level dimensions has six facets that further characterize an individual according to the dimension.
                        
                        Needs describe which aspects of a product resonate with a person. The model includes twelve characteristic needs.
Values describe motivating factors that influence a person's decision making. The model includes five values."</div>
                    <div className="helpText">IBM Personality models, <a href="https://cloud.ibm.com/docs/services/personality-insights?topic=personality-insights-models">source</a></div>
                </div>
            </div>
        );
    }
}

export default Help;