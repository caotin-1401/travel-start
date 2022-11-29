import { useMemo } from "react";

import PropTypes from "prop-types";
// import { Line } from "react-chartjs-2";
// import { Line } from "react-chartjs-2";

import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import configs from "./configs/index";

function ReportsLineChart({ color, chart }) {
    const { data, options } = configs(chart.labels || [], chart.datasets || {});

    return (
        <Card sx={{ height: "100%" }}>
            <Box padding="1rem">
                {useMemo(
                    () => (
                        <Box
                            sx={{
                                bgcolor: "#4CAF50",
                                coloredshadow: "#4CAF50",
                                height: "12.5rem",
                                borderRadius: "10px",
                            }}>
                            {/* <Line data={data} options={options} {...props} /> */}
                        </Box>
                    ),
                    [chart, color]
                )}
            </Box>
        </Card>
    );
}

ReportsLineChart.defaultProps = {
    color: "dark",
};

ReportsLineChart.propTypes = {
    color: PropTypes.oneOf(["dark"]),
    chart: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    ).isRequired,
};

export default ReportsLineChart;
