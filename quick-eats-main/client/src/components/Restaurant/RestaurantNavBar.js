import React, { Component } from 'react';
import '../../css/App.css';
import '../../css/Generic.css';
import '../../css/Restaurant.css';
import RestaurantSideBar from './RestaurantSideBar';

export default class RestaurantNavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sideNavbarVisible: false,
        };

        this.loadSideNavBar = this.loadSideNavBar.bind(this);
        this.collapseSidebar = this.collapseSidebar.bind(this);
    }

    loadSideNavBar() {
        this.setState({ sideNavbarVisible: !this.state.sideNavbarVisible })
    }

    collapseSidebar() {
        this.setState({ sideNavbarVisible: false })
    }
    
    handleLogout(){
        localStorage.setItem('isLoggedIn',false);
        localStorage.setItem('isRestaurantOwner','');
        localStorage.setItem('emailId','');
        window.location.href="/";
    }

    render() {
        return (
            <div className="landing_page">
                <div>
                    {this.state.sideNavbarVisible === true ? <RestaurantSideBar collapseSidebar={this.collapseSidebar} renderProfile={this.renderProfile} renderMenu={this.renderMenu} renderOrders={this.renderOrders} /> : null}
                </div>
                <div className="navbar">
                    <span className="hamburger" onClick={this.loadSideNavBar}>&#9776;</span>
                    <a href="/">
                        <img alt="Uber Eats Home" role="img" src="https://quickeatss3.s3.us-east-2.amazonaws.com/logo/quickeats.jpg" width="146" height="24" />
                    </a>
                    <a href="/"><button className="button" id="logout_btn" onClick={this.handleLogout}>Logout</button></a>
                </div>
            </div>
        );
    }
}