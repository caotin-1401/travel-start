import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import ReportsLineRoute from "./ReportsLineRoute";
import ReportsLineRevenue from "./ReportsLineRevenue";
import { getTripsFromBusCompany } from "../../../../services/userService";

export default class DashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDrivers: [],
            Trips: [],
        };
    }
    async componentDidMount() {
        await this.getTicket();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.listDrivers !== this.state.listDrivers) {
            this.filterTickets();
        }
    }
    getTicket = async () => {
        let busOwnerId = this.props.userInfo.id;
        let res = await getTripsFromBusCompany(busOwnerId);
        this.setState({
            listDrivers: res.trips,
        });
    };
    filterTickets = () => {
        let { listDrivers } = this.state;
        let resultUser, listTickets;
        let Trips = [];
        if (listDrivers && listDrivers.length > 0) {
            listDrivers.forEach((item) => {
                listTickets = item.User.Trips;

                if (listTickets && listTickets.length > 0) {
                    listTickets.forEach((ticket) => {
                        let temp = ticket.Tickets;
                        if (temp.length > 0) {
                            let tempUser = {};
                            temp.forEach((i) => {
                                if (tempUser[`${i.token}`]) {
                                } else {
                                    tempUser[`${i.token}`] = {
                                        token: i.token,
                                        totalPrice: i.totalPrice,
                                    };
                                }
                            });
                            resultUser = Object.values(tempUser);
                        } else {
                            resultUser = [];
                        }
                        let arrPrice = [];
                        if (resultUser.length === 1) {
                            arrPrice.push(resultUser[0].totalPrice);
                        } else if (resultUser.length > 1) {
                            resultUser.map((item) => arrPrice.push(item.totalPrice));
                        }
                        let final = 0;
                        arrPrice.map((a) => (final = final + a));
                        ticket.total = final;
                    });
                }
                Trips = Trips.concat(listTickets);
            });
        }
        this.setState({
            listDrivers: listDrivers,
            Trips,
        });
    };
    render() {
        let { Trips } = this.state;
        console.log(Trips);
        return (
            <Grid container mt={4.5} spacing={3}>
                <Grid item xs={12} md={6}>
                    <ReportsLineRevenue Trips={Trips} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ReportsLineRoute Trips={Trips} />
                </Grid>
            </Grid>
        );
    }
}
