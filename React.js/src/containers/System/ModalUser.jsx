

import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter ,
  FormGroup,
  Form,
  Label,
  Input,
  Row,
  Col
} from 'reactstrap';
import PropTypes from 'prop-types';
import {emitter} from '../../utils/emitter';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
          name: '',
          phoneNumber: '',
          address: '',
        }

        this.listenToEmitter();
    }

    listenToEmitter(){
      emitter.on('EVENT_CLEAN_MODAL',() => {
        this.setState({
          email: '',
          password: '',
          name: '',
          phoneNumber: '',
          address: '',          
        })
      })
    }

    toggle = () => {
      this.props.toggleFromParent()
    }

    handleOnChangeInput = (event, id) => {
      let copyState = {...this.state}
      copyState[id] = event.target.value;

      this.setState({
        ...copyState,
      })
    }

    checkValidInput = () => {
      let isValid = true;
      let arrInput = ['email','password','name','phoneNumber','address']
      for(let i = 0; i < arrInput.length; i++) {
        if( !this.state[arrInput[i]] ) {
          isValid = false;
          alert('Missing: ' + arrInput[i])
          break
        }
      }
      return isValid
    }

    handleAddNewUser = () => {
      let isValid = this.checkValidInput()
      if(isValid === true) {
        this.props.createNewUser(this.state);
        console.log('data modal: ', this.state)
      }
    }

    render() {
        return (
            <Modal 
                isOpen={this.props.isOpen} 
                toggle={()=>{this.toggle()}} 
                // className={'abcclassName'}
                size="lg"
            >
                <ModalHeader toggle={()=>{this.toggle()}} >
                  Create a new user
                </ModalHeader>
                <ModalBody>
                <Form>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail">
                            Email
                          </Label>
                          <Input
                            id="exampleEmail"
                            name="email"
                            placeholder="Email"
                            type="email"
                            className="mb-4"
                            value={this.state.email}
                            onChange={(event)=>{this.handleOnChangeInput(event,'email')}}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="examplePassword">
                            Password
                          </Label>
                          <Input
                            id="examplePassword"
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={this.state.password}
                            onChange={(event)=>{this.handleOnChangeInput(event,'password')}}

                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="exampleEmail">
                            Full Name
                          </Label>
                          <Input
                            id="exampleEmail"
                            name="name"
                            placeholder="Full Name"
                            type="text"
                            className="mb-4"
                            value={this.state.name}
                            onChange={(event)=>{this.handleOnChangeInput(event,'name')}}

                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="phone">
                            Phone Number
                          </Label>
                          <Input
                            id="examplePassword"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            type="text"
                            value={this.state.phoneNumber}
                            onChange={(event)=>{this.handleOnChangeInput(event,'phoneNumber')}}

                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="exampleAddress">
                        Address
                      </Label>
                      <Input
                        id="exampleAddress"
                        name="address"
                        placeholder="1234 Main St"
                        value={this.state.address}
                        onChange={(event)=>{this.handleOnChangeInput(event,'address')}}

                      />
                    </FormGroup>
                  </Form>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    color="secondary" 
                    onClick={()=>{this.toggle()}} 
                    className="btn-primary-modal">
                    Cancel
                  </Button>{' '}
                  <Button color="primary" onClick={()=>{this.handleAddNewUser()}} className="btn-primary-modal">
                    Save
                  </Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
