import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    Button,
    Alert,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    Form,
    FormGroup
} from "reactstrap";
import axios from "axios";

export default class Example extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            newTaskModal: false,
            newTaskData: {
                id: 0,
                name: "",
                description: ""
            }
        };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    loadTask() {
        axios.get("api/tasks").then(response => {
            this.setState({
                tasks: response.data
            });
        });
    }

    componentDidMount() {
        this.loadTask();
    }

    toggleNewTaskModal() {
        this.setState({
            newTaskModal: true
        });
    }

    handleClick() {
        this.setState(state => ({
            newTaskModal: !state.newTaskModal
        }));
    }

    saveTask() {
        var id = this.state.newTaskData.id;
        if (id) {
            axios
                .put("api/task/" + id, this.state.newTaskData)
                .then(response => {
                    this.setState({
                        newTaskModal: false,
                        newTaskData: {
                            name: "",
                            description: ""
                        }
                    });
                    this.loadTask();
                });
        } else {
            axios.post("api/task", this.state.newTaskData).then(response => {
                this.setState({
                    newTaskModal: false,
                    newTaskData: {
                        name: "",
                        description: ""
                    }
                });
                this.loadTask();
            });
        }
    }

    editTask(id, name, description) {
        this.setState({
            newTaskModal: true,
            newTaskData: {
                id: id,
                name: name,
                description: description
            }
        });
    }

    deleteTask(id) {
        axios.delete("api/task/" + id).then(response => {
            this.setState({
                newTaskModal: false,
                newTaskData: {
                    name: "",
                    description: ""
                }
            });
            this.loadTask();
        });
    }

    render() {
        let task = this.state.tasks.map(task => {
            return (
                <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td className="text-center">
                        <Button
                            outline
                            color="info"
                            className="btn-sm mr-2"
                            onClick={this.editTask.bind(
                                this,
                                task.id,
                                task.name,
                                task.description
                            )}
                        >
                            Edit
                        </Button>
                        <Button
                            outline
                            color="danger"
                            className="btn-sm"
                            onClick={this.deleteTask.bind(this, task.id)}
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            );
        });
        return (
            <div className="container">
                <h2>Simple crud with react & Laravel</h2>
                <Button color="primary" onClick={this.handleClick}>
                    Add Task
                </Button>
                <Modal isOpen={this.state.newTaskModal} fade={false}>
                    <ModalHeader>Modal title</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={this.state.newTaskData.name}
                                onChange={e => {
                                    let { newTaskData } = this.state;
                                    newTaskData.name = e.target.value;
                                    this.setState({ newTaskData });
                                }}
                            ></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={this.state.newTaskData.description}
                                onChange={e => {
                                    let { newTaskData } = this.state;
                                    newTaskData.description = e.target.value;
                                    this.setState({ newTaskData });
                                }}
                            ></Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.saveTask}>
                            Add Task
                        </Button>{" "}
                        <Button color="secondary" onClick={this.handleClick}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <div className="card mt-3">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>{task}</tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById("main-body")) {
    ReactDOM.render(<Example />, document.getElementById("main-body"));
}
