// Data
import Grid from "@mui/material/Grid";
import ReportsLineChart from "../../../../components/ReportsLineChart";
import reportsLineChartData from "./data/reportsLineChartData";

function DashboardComponent() {
    const { sales } = reportsLineChartData;

    return (
        <Grid container mt={4.5} spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
                <ReportsLineChart color="success" chart={sales} />
            </Grid>
        </Grid>
    );
}

export default DashboardComponent;
