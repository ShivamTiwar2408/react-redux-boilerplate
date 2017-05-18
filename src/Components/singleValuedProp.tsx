import * as React from "react";
import { RootState } from '../Reducers'
import { connect } from "react-redux";
import { bindActionCreators, Dispatch, Action } from 'redux'
import * as  RPDActions from '../Actions'
//prop name not optional

export interface SingleValuedProps { PropName: string, MessageKey?: string, PropValue?: string, Options?: any[], dispatch?: Dispatch<RootState> }
interface SingleValuedState { editMode: boolean, newValue: string, PropValue: string }

class SingleValuedProperty extends React.Component<SingleValuedProps, SingleValuedState>{
    constructor(props: SingleValuedProps) {
        super(props);
        this.state = { editMode: false, newValue: "", PropValue: this.props.PropValue };
        this.editProperty = this.editProperty.bind(this);
        this.cancelEditProperty = this.cancelEditProperty.bind(this);
        this.saveProperty = this.saveProperty.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };
    cancelEditProperty(): void {
        this.setState({ editMode: false, newValue: "", PropValue: this.state.PropValue });
    }
    editProperty(): void {
        this.setState({ editMode: true, newValue: "", PropValue: this.state.PropValue });
    }
    saveProperty(): void {
        let currentContext = this;
        var data = {};
        data[this.props.PropName] = this.state.newValue;
        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "http://iswebdev.pc.factset.com/rpd/api/v2/rpd/" + this.props.MessageKey);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                currentContext.cancelEditProperty();
                currentContext.setState({ editMode: false, newValue: "", PropValue: data[currentContext.props.PropName] });
                currentContext.props.dispatch(RPDActions.ReloadActionCreater(false));
            }
        }
        xhr.onerror = function () {
            alert(xhr.responseText);
        }
    }
    handleChange(evt: any): any {
        this.setState({ editMode: this.state.editMode, newValue: evt.target.value, PropValue: this.state.PropValue });
    }
    render() {
        if (this.state.editMode) {
            var ops = this.props.Options.map(option => { return <option> {option} </option> });
            return (
                <div>
                    <select value={this.state.newValue} onChange={this.handleChange}>
                        <option>---- Select {this.props.PropName} ----</option>
                        {ops}
                    </select>
                    <button onClick={this.cancelEditProperty}>Cancel</button>
                    <button onClick={this.saveProperty}>Save</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <span>
                        <b>{this.props.PropName} :  </b>
                        {this.state.PropValue}
                    </span>
                    <button onClick={this.editProperty}>Edit</button>
                </div>
            )
        }

    }
}


//------------------------ CONTAINER-----------------------------

function mapStateToProps(rootState: any, props: SingleValuedProps): SingleValuedProps {  //props
    return {
        PropName: props.PropName,
        MessageKey: rootState.RPD.MessageKey,
        PropValue: rootState.RPD.Properties[props.PropName],
        Options: rootState.RPD.PropertyOptions[props.PropName]
    };
    //    SingleValuedProps { PropName: string, MessageKey: string, PropValue: string, Options: any[] }
}

// function mapDispatchToProps(dispatch): any {         works without mapDispatchToProps
//     return {
//         actions: bindActionCreators(AssigneeActionCreator, dispatch)
//     };
// }

function mergeProps(): any {

}


const SingleValuedPropertyContainer = connect(mapStateToProps)(SingleValuedProperty); //, mapDispatchToProps, mergeProps

export default SingleValuedPropertyContainer;