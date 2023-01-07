import { Typography, Skeleton } from "@mui/material";

export const SkeletonEvent = () => {
    return (
        <tr>
            <td
                colSpan="5"
                style={{
                    height: "47px",
                }}>
                <div>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        <Skeleton width="100%" />
                    </Typography>
                </div>
                <div>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        <Skeleton width="100%" />
                    </Typography>
                </div>
                <div>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                        <Skeleton width="100%" />
                    </Typography>
                </div>
            </td>
        </tr>
    );
};
