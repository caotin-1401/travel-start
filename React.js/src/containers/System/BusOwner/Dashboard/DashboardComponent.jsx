import React from "react";
import Grid from "@mui/material/Grid";
import ReportsLineRoute from "./ReportsLineRoute";
import ReportsLineRevenue from "./ReportsLineRevenue";

function DashboardComponent() {
    return (
        <Grid container mt={4.5} spacing={3}>
            <Grid item xs={12} md={6}>
                <ReportsLineRevenue />
            </Grid>
            <Grid item xs={12} md={6}>
                <ReportsLineRoute />
            </Grid>
        </Grid>
    );
}

export default DashboardComponent;
