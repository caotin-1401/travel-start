import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { AccordionSummary, AccordionDetails, Accordion } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

class FAQ extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="section-share section-FAQ">
                    <div className="section-container">
                        <h2 className="FAQ">
                            <FormattedMessage id="FAQ.header" />
                        </h2>

                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header1" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title1" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div style={{ height: "20px" }}></div>
                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header2" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title2" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div style={{ height: "20px" }}></div>
                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header3" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title3" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div style={{ height: "20px" }}></div>
                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header4" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title4" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div style={{ height: "20px" }}></div>
                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header5" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title5" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div style={{ height: "20px" }}></div>
                        <div className="FAQ-content">
                            <Accordion>
                                <div className="item">
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                        <h5>
                                            <FormattedMessage id="FAQ.header6" />
                                        </h5>
                                    </AccordionSummary>
                                </div>
                                <AccordionDetails>
                                    <p>
                                        <FormattedMessage id="FAQ.title6" />
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
