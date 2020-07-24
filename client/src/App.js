import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// import SimpleAutosuggest from "./component/simple-autosuggest/simpleAutosuggest";
import "./app.css";
import Landing from "./component/landing/landing";
import Game from "./component/game/game";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // suggestions: [],
            // lastUpdateDate: null
        };

        // this.fetchStockList = this.fetchStockList.bind(this);
        // this.fetchLastUpdateDate = this.fetchLastUpdateDate.bind(this);
        // this.selectedSuggestion = this.selectedSuggestion.bind(this);
        // this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // this.fetchLastUpdateDate();
    }

    // async fetchStockList(searchStr) {
    //     console.log("fetch");
    //     let response = await fetch("http://stocklookup-env.eba-mdpeyzrt.us-east-2.elasticbeanstalk.com/api/stock/search?startWith="+searchStr);
    //     let responseJson = await response.json();
    //     if (responseJson["status"] == null || responseJson["status"] !== "success") {
    //         return;
    //     }
    //     this.setState({
    //         suggestions: responseJson["stocks"]
    //     }, ()=>console.log(this.state.suggestions));
    // }

    // async fetchLastUpdateDate() {
    //     let response = await fetch("http://stocklookup-env.eba-mdpeyzrt.us-east-2.elasticbeanstalk.com/api/stock/last-update-date");
    //     let responseJson = await response.json();
    //     if (responseJson["status"] == null || responseJson["status"] !== "success") {
    //         return;
    //     }
    //     let lastUpdateDate = new Date(responseJson["lastUpdateDate"]);
    //     this.setState({
    //         lastUpdateDate: lastUpdateDate
    //     });
    // }

    // selectedSuggestion(suggestion) {
    //     console.log(suggestion);
    // }
    // onChange(value) {
    //     this.fetchStockList(value);
    // }

    render() {
        return (
            <Router>     
                <Switch>
                    <Route exact path="/">
                        <Landing />
                    </Route>
                    <Route path="/game">
                        <Game />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App;
