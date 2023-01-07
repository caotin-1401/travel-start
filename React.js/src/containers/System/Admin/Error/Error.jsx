import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { getAllErrService, deleteErrService } from "../../../../services/userService";
import { toast } from "react-toastify";
import { LANGUAGES } from "../../../../utils";
class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listErr: [],
        };
    }
    async componentDidMount() {
        await this.listError();
    }
    listError = async () => {
        let res = await getAllErrService("ALL");
        if (res && res.errCode === 0) {
            this.setState({ listErr: res.err });
        }
    };
    handleDeleteUser = async (item) => {
        let { language } = this.props;
        let res = await deleteErrService(item.id);
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) toast.success("Xóa thành công");
            else toast.success("Delete successfully");
            await this.listError();
        }
    };
    render() {
        let { listErr } = this.state;
        return (
            <div className="container">
                <div className="title text-center">
                    <FormattedMessage id="menu.admin.listErr.title" />
                </div>
                <div className="contentProfile" style={{ padding: 0 }}>
                    <div className="ticket-content">
                        <table className="table table-striped table-hover table-responsive">
                            <thead style={{ borderBottom: "2px solid black" }}>
                                <tr>
                                    <th scope="col" style={{ width: "10%" }}>
                                        Id
                                    </th>
                                    <th scope="col" style={{ width: "50%" }}>
                                        <FormattedMessage id="menu.admin.listErr.description" />{" "}
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        <FormattedMessage id="menu.admin.listErr.time" />{" "}
                                    </th>
                                    <th scope="col" style={{ width: "10%" }}>
                                        <FormattedMessage id="menu.admin.listErr.done" />{" "}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listErr && listErr.length > 0 ? (
                                    listErr.map((item, index) => {
                                        let create = moment(
                                            new Date(item.createdAt).getTime()
                                        ).format("DD/MM/YYYY HH:mm");
                                        return (
                                            <tr key={index}>
                                                <td>{item.id}</td>
                                                <td>{item.description}</td>
                                                <td>{create}</td>
                                                <td>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => this.handleDeleteUser(item)}>
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr colSpan="4">
                                        <td colSpan="4">
                                            <p
                                                style={{
                                                    marginTop: "15px",
                                                    textAlign: "center",
                                                    fontSize: "15px",
                                                }}>
                                                <FormattedMessage id="menu.admin.listErr.title1" />
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Error);
