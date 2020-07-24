import React from "react";

import "./landing.css";

class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };        
    }

    render() {
        return (
            <div className="main-content row">
                <div className="card col-md-6">
                    <div className="card-body">
                        
                        <h5 className="card-title">Memory Game</h5>
                        <p className="card-text">Please select game difficulty:</p>
                        <div className="select-difficulty">
                            <button type="button" className="btn btn-primary">Easy</button>
                            <button type="button" className="btn btn-primary">Medium</button>
                            <button type="button" className="btn btn-primary">Hard</button>
                        </div>
                        <div className="highlight-line"></div>
                        <div className="form-group">
                            <label htmlFor="gameId">Restore Game:</label>
                            <input type="text" className="form-control mb-2" id="gameId" />
                            <button type="button" className="btn btn-primary">Restore</button>                                
                        </div>
                        {/* <div className="highlight-line"></div> */}
                        <h5 className="card-title">Last 10 Scores:</h5>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Score</th>
                                        <th>Difficulty</th>                                            
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {
                                        this.state.courses.map((course, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="course-code" onClick={() => this.clickedCourse(course)}>{course["code"]+course["section"]}</td>
                                                    <td>{course["initial_waitlist"]}</td>
                                                    <td>{course["initial_enrolment"]+"/"+course["enrolment_capacity"]}</td>
                                                    <td>{course["final_enrolment"]+"/"+course["enrolment_capacity"]}</td>
                                                    <td>
                                                        <span className={(inputValidate.getPercentDrop(course["percent_remaining"]) > 0 ? "c-red":"c-grey")}>
                                                            -{inputValidate.getPercentDrop(course["percent_remaining"])+"%"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    } */}
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>111</td>
                                        <td>Easy</td>
                                        <td>11-11-2020 11:00:00 pm</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                    </div>    
                </div>
            </div>
        );
    }
}

export default Landing;