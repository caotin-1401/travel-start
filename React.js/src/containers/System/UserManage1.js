import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage1.scss'
import {
  getAllUsers, 
  createNewUserService, 
  deleteUserService,
  editUserService
} from '../../services/userService'

import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

import {emitter} from '../../utils/emitter';


class UserManage1 extends Component {  

    constructor(props) {
        super(props);
        this.state = {
          arrUsers: [],
          isOpenModel: false,
          isOpenModelEditUser: false,
          userEdit: {}
        }
    }

    async componentDidMount() {
      await this.getAllUsers()
    }

    getAllUsers = async () => {
      let response = await getAllUsers('ALL')
      if(response && response.errCode === 0){
        this.setState({
          arrUsers: response.users
        }, () => {
        console.log(this.state.arrUsers)

        })
      }
    }

    handleAddUser = (user) => {
      this.setState({
        isOpenModel: true
      })
    }

    toggleUserModel = () => {
      this.setState({
        isOpenModel: !this.state.isOpenModel
      })
    }

    toggleUserEditModel = () => {
      this.setState({
        isOpenModelEditUser: !this.state.isOpenModelEditUser
      })
    }

    createNewUser =  async (data) => {
        console.log(data)
      try {
        let response = await createNewUserService(data)
        if(response && response.errCode !== 0) {
          alert(response.errMessage)
        } else {
            await this.getAllUsers()
            this.setState({
              isOpenModel: false,
            })
            emitter.emit('EVENT_CLEAN_MODAL')
        } 
        console.log('response create ', response)
      } catch(e) {
        console.log(e)
      }
    }

    // dùng để xóa phân tử
    handleDeleteUser = async (user)=> {
        try {
            let res = await deleteUserService(user.id)
            if(res && res.errCode === 0) {
                await this.getAllUsers(); // xoa xonf thi load lai page            
            } 
            else {
                alert(res.errMessage)
            }
        } catch(e) {
          console.log(e)
        }
    }  

    handleEditUser = (user) => {
      console.log('check edit user')
      this.setState({
        isOpenModelEditUser: true,
        userEdit : user
      })
    }

    doEditUser = async (user) => {
      try {
        let res = await editUserService(user);
        if(res && res.errCode === 0){
          this.setState({ 
            isOpenModelEditUser: false
          })
          await this.getAllUsers()
        }
        else {
          alert(res.errMessage)
        }
      } catch(e){
        console.log(e)
      }
    }

    render() {
        let arrUsers = this.state.arrUsers
        return (
            <div className="user-container">
              <ModalUser
                isOpen = {this.state.isOpenModel}
                toggleFromParent = {this.toggleUserModel}
                createNewUser = {this.createNewUser}
              />
              {this.state.isOpenModelEditUser && 
              <ModalEditUser
                isOpen = {this.state.isOpenModelEditUser}
                toggleFromParent = {this.toggleUserEditModel}
                currentUser = {this.state.userEdit}
                editUser = {this.doEditUser}
              />
            }

                <div className="title text-center">
                  User manage
                </div>
                <div className="mx-5 my-3">
                  <button 
                    className = "btn btn-primary px-3"
                    onClick={()=>this.handleAddUser()}
                  >
                  <i className="fas fa-plus px-1"></i>
                    Add new user
                    
                    </button>
                </div>
                <div className="use-table m-3">
                    
                  <table id="customers">
                  <tbody>

                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                    {
                      arrUsers && arrUsers.map((user, index) =>{
                        return (
                          <tr key = {index}>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.address}</td>   
                            <td>
                            <button 
                              className ="btn-edit"
                              onClick={()=>this.handleEditUser(user)}
                            >
                              <i className="fas fa-user-edit"></i>
                            </button>
                            <button 
                              className ="btn-delete"
                              onClick={()=>this.handleDeleteUser(user)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                            </td>
                          </tr>
                        )
                      })
                    }

                    </tbody>

                  </table>

                </div>
            </div>
        );
    }


}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage1);
