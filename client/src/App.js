import React from "react";
import { withRouter, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./app.css";
import Landing from "./component/landing/landing";
import Game from "./component/game/game";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>     
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/game/:id" component={Game} />
                    <Route path="*" component={Landing} />
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
