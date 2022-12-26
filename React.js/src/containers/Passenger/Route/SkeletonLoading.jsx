import React, { Component } from "react";
import { Box, Typography, Skeleton } from "@mui/material";

export default class SkeletonLoading extends Component {
    render() {
        let { loading } = this.props;
        return (
            <>
                <div className="ticket">
                    <div className="ticket-container">
                        <Box
                            sx={{
                                width: "100%",
                            }}>
                            {loading === false && (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            )}
                        </Box>

                        <div className="ticket-body row">
                            <div className="col-3 ticket-img_ ">
                                <Box
                                    sx={{
                                        width: "100%",
                                    }}>
                                    {loading === false && <Skeleton width="100%" height={120}></Skeleton>}
                                </Box>
                            </div>

                            <div className="col-9">
                                <div className="row">
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false && (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false && (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false && (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        )}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ticket-footer">
                        <Box
                            sx={{
                                width: "90%",
                                ml: 3,
                            }}>
                            {loading === false ? (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            ) : (
                                <Typography>Ted</Typography>
                            )}
                        </Box>
                    </div>
                </div>{" "}
                <div className="ticket">
                    <div className="ticket-container">
                        <Box
                            sx={{
                                width: "100%",
                            }}>
                            {loading === false ? (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            ) : (
                                <Typography>Ted</Typography>
                            )}
                        </Box>

                        <div className="ticket-body row">
                            <div className="col-3 ticket-img_ ">
                                {" "}
                                <Box
                                    sx={{
                                        width: "100%",
                                    }}>
                                    {loading === false ? (
                                        <Skeleton width="100%" height={120}></Skeleton>
                                    ) : (
                                        <Typography>Ted</Typography>
                                    )}
                                </Box>
                            </div>

                            <div className="col-9">
                                <div className="row">
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ticket-footer">
                        <Box
                            sx={{
                                width: "90%",
                                ml: 3,
                            }}>
                            {loading === false ? (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            ) : (
                                <Typography>Ted</Typography>
                            )}
                        </Box>
                    </div>
                </div>{" "}
                <div className="ticket">
                    <div className="ticket-container">
                        <Box
                            sx={{
                                width: "100%",
                            }}>
                            {loading === false ? (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            ) : (
                                <Typography>Ted</Typography>
                            )}
                        </Box>

                        <div className="ticket-body row">
                            <div className="col-3 ticket-img_ ">
                                {" "}
                                <Box
                                    sx={{
                                        width: "100%",
                                    }}>
                                    {loading === false ? (
                                        <Skeleton width="100%" height={120}></Skeleton>
                                    ) : (
                                        <Typography>Ted</Typography>
                                    )}
                                </Box>
                            </div>

                            <div className="col-9">
                                <div className="row">
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                        }}>
                                        {loading === false ? (
                                            <Skeleton width="100%" height={30}>
                                                <div className="ticket-header"></div>
                                            </Skeleton>
                                        ) : (
                                            <Typography>Ted</Typography>
                                        )}
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ticket-footer">
                        <Box
                            sx={{
                                width: "90%",
                                ml: 3,
                            }}>
                            {loading === false ? (
                                <Skeleton width="100%" height={30}>
                                    <div className="ticket-header"></div>
                                </Skeleton>
                            ) : (
                                <Typography>Ted</Typography>
                            )}
                        </Box>
                    </div>
                </div>
            </>
        );
    }
}
