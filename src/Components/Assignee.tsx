import * as React from "react";
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux'
import { AssigneeActionCreator, AssigneeAction, ReloadActionCreater } from '../Actions'
import { store } from '../app'
import { RootState } from '../Reducers'

// var rootState = store.getState();


interface AssigneeProps { Assignees?: any, MessageKey?: string, dispatch?: Dispatch<RootState> }
interface AssigneeState { editMode: boolean, assigneeList: any[], newAssignee: string }

class Assignees extends React.Component<AssigneeProps, AssigneeState>{
  constructor(props: AssigneeProps) {
    super(props);
    this.state = { editMode: false, assigneeList: [], newAssignee: "" };

    //bind functions to this ??
    this.editAssignee = this.editAssignee.bind(this);
    this.add = this.add.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveAssignees = this.saveAssignees.bind(this);
    this.cancelAssigneeAdd = this.cancelAssigneeAdd.bind(this);
  };
  editAssignee(): void {
    this.setState({ editMode: true, assigneeList: [], newAssignee: "" });
  }
  add(): void {
    let temp = this.state.assigneeList;
    temp.push({ Id: "e_" + this.state.newAssignee });
    let t = { editMode: this.state.editMode, assigneeList: temp, newAssignee: "" };
    this.setState(t);
  }
  saveAssignees() {
    let currentContext = this;
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://iswebdev.pc.factset.com/rpd/api/v2/rpd/" + this.props.MessageKey + "/assignees", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(this.state.assigneeList));
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        currentContext.props.dispatch(AssigneeActionCreator(currentContext.state.assigneeList));
        currentContext.props.dispatch(ReloadActionCreater(true));
        currentContext.cancelAssigneeAdd();
      }
    }
    xhr.onerror = function () {
      alert(xhr.responseText);
    }
  }
  cancelAssigneeAdd() {
    this.setState({ editMode: false, assigneeList: [], newAssignee: "" });
  }
  render() {
    if (this.state.editMode) {
      var assigneeList = this.state.assigneeList;
      return (
        <div style={{ width: '30%', border: '1px solid', padding: '2px' }}>
          <input type="text" value={this.state.newAssignee} onChange={this.handleChange} /> <button onClick={this.add}>ADD</button>
          <div style={{ padding: '2px' }}>{assigneeList.map(assignee => {
            return <div>{assignee.Id} </div>
          })}</div>
          <div>
            <button onClick={this.saveAssignees}>Save</button>
            <button style={{ float: 'right' }} onClick={this.cancelAssigneeAdd}>Cancel</button>
          </div>
        </div>
      )
    }
    else {
      return (
        <div style={{ color: 'blue' }}> <b> Assignees: </b>
          <span> {this.props.Assignees.map(a => { return a.Name }).join(", ")}</span>
          <button onClick={this.editAssignee}>Edit</button>
        </div>
      )
    }
  }
  handleChange(evt: any): any {
    let newAssignee = evt.target.value;//.substr(0, 100);
    this.setState({ editMode: this.state.editMode, assigneeList: this.state.assigneeList, newAssignee: newAssignee });
  }
}


//------------------------ CONTAINER-----------------------------

function mapStateToProps(rootState: any, props: AssigneeProps): AssigneeProps {  //props
  return {
    Assignees: rootState.RPD.Assignees,
    MessageKey: rootState.RPD.MessageKey
  };
}

function mapDispatchToProps(dispatch): any {
  return {
    actions: bindActionCreators(AssigneeActionCreator, dispatch)
  };
}

function mergeProps(): any {

}


const AssigneesContainer = connect(mapStateToProps)(Assignees); //, mapDispatchToProps, mergeProps

export default AssigneesContainer;