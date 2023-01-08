import { Typography, Skeleton } from "@mui/material";

const SkeletonDetail = () => {
    return (
        <div>
            <Typography variant="h3">
                <Skeleton width="60%" />
            </Typography>
            <Typography variant="h2">
                <Skeleton width="100%" />
            </Typography>
            <Typography sx={{ mb: 1 }}>
                <Skeleton width="80%" height={20} />
            </Typography>

            <div className="t-box">
                <div className="t-img">
                    <Skeleton sx={{ height: 300 }} variant="rectangular" />
                </div>
            </div>
            <div>
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="100%" height={20} />
            </div>
        </div>
    );
};

export default SkeletonDetail;
