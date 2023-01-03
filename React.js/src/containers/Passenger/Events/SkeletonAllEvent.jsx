import React, { Component } from "react";
import { Typography, Box, Skeleton } from "@mui/material";

export default class SkeletonAllEvent extends Component {
    render() {
        let { loading } = this.props;

        return (
            <>
                {" "}
                {loading === false && (
                    <>
                        <li>
                            <div className="content-events">
                                <div className="bg-img">
                                    <Box>{loading === false && <Skeleton height={140}></Skeleton>}</Box>
                                </div>
                                <div className="content-right">
                                    <Typography variant="h3" sx={{ mb: 1 }}>
                                        {loading === false && <Skeleton width="500px" />}
                                    </Typography>
                                    <Typography variant="caption">
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                    <Typography variant="h2" sx={{ mt: 1 }}>
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="content-events">
                                <div className="bg-img">
                                    <Box>{loading === false && <Skeleton height={140}></Skeleton>}</Box>
                                </div>
                                <div className="content-right">
                                    <Typography variant="h3" sx={{ mb: 1 }}>
                                        {loading === false && <Skeleton width="500px" />}
                                    </Typography>
                                    <Typography variant="caption">
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                    <Typography variant="h2" sx={{ mt: 1 }}>
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="content-events">
                                <div className="bg-img">
                                    <Box>{loading === false && <Skeleton height={140}></Skeleton>}</Box>
                                </div>
                                <div className="content-right">
                                    <Typography variant="h3" sx={{ mb: 1 }}>
                                        {loading === false && <Skeleton width="500px" />}
                                    </Typography>
                                    <Typography variant="caption">
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                    <Typography variant="h2" sx={{ mt: 1 }}>
                                        {loading === false && <Skeleton width="200px" />}
                                    </Typography>
                                </div>
                            </div>
                        </li>
                    </>
                )}
            </>
        );
    }
}
