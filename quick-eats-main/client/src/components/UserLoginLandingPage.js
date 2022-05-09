import React, { Component } from "react";
import '../css/User.css';
import UserLogin from "./UserLogin";
import CustomerSignup from "./Customer/CustomerSignup";

export default class UserLoginLandingPage extends Component {

    constructor(props) {
        super(props);
        this.state = { page: '' };

        this.setPageRedirect = this.setPageRedirect.bind(this);
    }

    setPageRedirect(pageContent) {
        console.log("Inside User Login Landing Page Fuction");
        console.log(pageContent);
        this.setState({ page: pageContent })
    }

    render() {
        return (
                <div className="center-div">
                    <a href="/" id="uber-eats-signin-img">
                        <img alt="Uber Eats Home" role="img" src="https://quickeatss3.s3.us-east-2.amazonaws.com/logo/quickeats.jpg" width="200" height="40" />
                    </a>
                    {this.state.page === 'signup' ? <CustomerSignup setPageRedirect={this.setPageRedirect} /> : < UserLogin setPageRedirect={this.setPageRedirect} />}
                </div>

        );
    }
}