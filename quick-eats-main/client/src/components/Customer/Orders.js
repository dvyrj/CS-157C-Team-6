import React, { Component } from 'react';
import { getOrdersByCustEmail } from '../../services/CustomerService';
import CustomerNavBar from '../Customer/CustomerNavBar';

export default class Orders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orders: [],
            currentOrders: [],
            previousOrders: [],
            showCurrOrders: false,
            showPrevOrders: false
        }
    }

    async componentDidMount() {

        let emailId = 'default@default.com';
        try {
            emailId = localStorage.getItem('emailId');
        }
        catch (error) {
            console.log(error);
        }
        const request = {
            emailId: emailId
        }
        const orders = await getOrdersByCustEmail(request);
        const currentOrders = [];
        const previousOrders = [];
        console.log(orders);
        if (orders) {
            orders.map((order) => {
                if (order.status === 'DELIVERED' || order.status === 'PICKED_UP') {
                    previousOrders.push(order);
                }
                else {
                    currentOrders.push(order);
                }
            })
            this.setState({
                orders: orders,
                currentOrders: currentOrders,
                previousOrders: previousOrders,
                showCurrOrders: (currentOrders.length > 0 ? true : false),
                showPrevOrders: (previousOrders.length > 0 ? true : false)
            })
        }
        else {
            console.log("Error Fetching Orders");
            this.setState({
                orders: [],
                currentOrders: [],
                previousOrders: []
            })
        }
    }

    render() {
        return (
            <div>
                < CustomerNavBar searchByLocation={this.searchByLocation} />
                <div hidden={!this.state.showCurrOrders} style={{ paddingLeft: '3%' }}>
                    <h3> Current Orders </h3>
                    <div >
                        {
                            this.state.currentOrders.map((order) => {
                                return (
                                    <div key={order.order_id}>
                                        <div className="container">
                                            <br /><br />
                                            <div className="row">
                                                <h5>Order Details</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Payment Mode :
                                                </div>
                                                <div className="col-3">
                                                    {order.payment_mode}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Order Placed on :
                                                </div>
                                                <div className="col-3">
                                                    {order.order_timestamp}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Total Price :
                                                </div>
                                                <div className="col-3">
                                                    {order.order_price}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Order Status :
                                                </div>
                                                <div className="col-3">
                                                    <b>{order.status}</b>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <h5>Dishes Ordered</h5>
                                            </div>
                                            {
                                                JSON.parse(order.dishes_ordered).map((dish) => {
                                                    return (
                                                        <div>

                                                            <div key={dish.dishId} className="card w-50" style={{ marginLeft: '10%' }}>
                                                                <div className="card-body">
                                                                    <div className="card-title">
                                                                        <b>{dish.dishName}</b>
                                                                    </div>
                                                                    <div className="card-text">
                                                                        Quantity: {dish.dish_quantity}
                                                                    </div>
                                                                    <div className="card-text">
                                                                        Price: ${dish.dish_price}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <br />
                                                        </div>
                                                    )
                                                })
                                            }
                                            <hr />
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div style={{ paddingLeft: '3%' }} hidden={!this.state.showPrevOrders}>
                    <h3> Previous Orders </h3>
                    <div >
                        {
                            this.state.previousOrders.map((order) => {
                                return (
                                    <div key={order.order_id}>
                                        <div className="container">
                                            <br /><br />
                                            <div className="row">
                                                <h5>Order Details</h5>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Payment Mode :
                                                </div>
                                                <div className="col-3">
                                                    {order.payment_mode}
                                                </div>
                                                <div className="col-6">

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    Order Placed on :
                                                </div>
                                                <div className="col-3">
                                                    {order.order_timestamp}
                                                </div>
                                                <div className="col-6">

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    Total Price :
                                                </div>
                                                <div className="col">
                                                    {order.order_price}
                                                </div>
                                                <div className="col-6">

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    Order Status :
                                                </div>
                                                <div className="col">
                                                    <b>{order.status}</b>
                                                </div>
                                                <div className="col-6">

                                                </div>
                                            </div>
                                            <br />
                                            <div className="row">
                                                <h5>Dishes Ordered</h5>
                                            </div>
                                            {
                                                JSON.parse(order.dishes_ordered).map((dish) => {
                                                    return (
                                                        <div>

                                                        <div key={dish.dishId} className="card w-50" style={{ marginLeft: '10%' }}>
                                                            <div className="card-body">
                                                                <div className="card-title">
                                                                    <b>{dish.dishName}</b>
                                                                </div>
                                                                <div className="col">
                                                                    Quantity: {dish.dish_quantity}
                                                                </div>
                                                                <div className="col">
                                                                    Price: ${dish.dish_price}
                                                                </div>
                                                                <div className="col-3">

                                                                </div>
                                                            </div>
                                                        </div>

                                                        <br/>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <hr />
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div style={{ paddingLeft: '3%' }} hidden={this.state.showCurrOrders || this.state.showPrevOrders} >
                    No Orders were placed from your account. Explore our wide variety of cuisines from the Menu
                </div>
            </div>

        )
    }
}