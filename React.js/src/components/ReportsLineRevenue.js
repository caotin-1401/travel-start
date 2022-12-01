import React, { Component } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);
class ReportsLineRevenue extends Component {
    render() {
        const data = {
            labels: [
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "Doanh thu",
                    data: [
                        30000000, 4000000, 300000, 320000, 8000000, 330000,
                        200000, 230000, 300000,
                    ],
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                },
            ],
        };
        return (
            <Card sx={{ height: "100%" }}>
                <Box padding="1rem">
                    <Box
                        sx={{
                            height: "25rem",
                            borderRadius: "10px",
                            mt: "30px",
                        }}>
                        <Line data={data} />
                    </Box>
                </Box>
            </Card>
        );
    }
}

export default ReportsLineRevenue;
