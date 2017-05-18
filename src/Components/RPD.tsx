import * as React from "react";
import Products from "./Product"
import Assignees from "./Assignee"
import Comments from "./Comments"
import SingleValuedProperty from "./singleValuedProp"
import { AssigneeActionCreator, AssigneeAction } from '../Actions'
import { RootState } from '../Reducers'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, Action } from 'redux'
import * as  RPDActions from '../Actions'

export interface RPDProps { doReload?: Boolean, MessageKey?: string, dispatch?: Dispatch<RootState> } //params?: any, history?: any, 
interface RPDState { RPDData: any, MessageKey: string }
class RPD extends React.Component<RPDProps, RPDState> {
    constructor(props: RPDProps) {
        super(props);
        this.state = {
            RPDData: null, MessageKey: null // MesssageKey: this.props.params.id
        };
        this.handleChange = this.handleChange.bind(this);
    }
    setTheState(state: any) {
        this.setState(state);
    }
    getDataFromServer(messageKey: string) {
        this.setState({ RPDData: null, MessageKey: messageKey, });  // partially updating the state doesnt call render() 
        //  if (this.props.params.id !== messageKey) {
        //  this.props.history.push('/' + messageKey);

        //}
        let currentContext = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://iswebdev.pc.factset.com/rpd/api/v2/rpd/" + messageKey + "?thread=true", true);
        xhr.withCredentials = true;
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                currentContext.props.dispatch(RPDActions.RPDUpdateActionCreator(JSON.parse(xhr.responseText)));   // {}
                currentContext.setTheState({ RPDData: JSON.parse(xhr.responseText) });
            }
        }
    }

    componentDidMount() {
        if (this.props.doReload) {
            this.getDataFromServer(this.props.MessageKey);
        }
    }
    render() {
        var RPD = this.state.RPDData;
        var comments;
        if (RPD !== null) {
            return (
                <div className="RPD">
                    <h3>RPD: {RPD.Id}</h3>
                    <div style={{ float: 'right' }}><input type="string" value={this.state.MessageKey} onChange={this.handleChange} />
                        <button id="go" onClick={() => { this.getDataFromServer(this.state.MessageKey) } }>GO !</button>
                    </div>
                    <div>
                        <SingleValuedProperty PropName="Type" ></SingleValuedProperty>
                        <SingleValuedProperty PropName="Severity"></SingleValuedProperty>
                        <SingleValuedProperty PropName="Priority"></SingleValuedProperty>
                        <SingleValuedProperty PropName="Difficulty"></SingleValuedProperty>
                    </div>
                    <Products />
                    <h3>{RPD.Title}</h3>
                    <Assignees />
                    <div style={{ border: '1px solid', margin: '10px' }}>
                        <div style={{ background: 'aliceblue', padding: '2px' }}>
                            <div style={{ color: 'red' }} >{RPD.Author.Name}</div>
                            <div style={{ background: 'beige' }} dangerouslySetInnerHTML={{ __html: RPD.Content }} ></div>
                        </div>
                    </div>
                    <Comments />
                </div>
            );
        }
        else {
            return (
                <img src="src/waiting.gif" alt="Waiting" width="1000" height="400" />
            );
        }
    }
    handleChange(evt: any): any {
        let mKey = evt.target.value;
        this.setState({ RPDData: this.state.RPDData, MessageKey: mKey });
    }
}


//------------------------ CONTAINER-----------------------------

function mapStateToProps(rootState: any, props: RPDProps): RPDProps {  //props
    return {
        MessageKey: rootState.RPD.MessageKey,
        doReload: rootState.RPD.Reload
        // params: props.params,
        // history: props.history
    };
}

function mapDispatchToProps(dispatch): any {
    return {
        actions: bindActionCreators(RPDActions.RPDUpdateActionCreator, dispatch)
    };
}

function mergeProps(): any {

}


const RPDContainer = connect(mapStateToProps)(RPD); //, mapDispatchToProps

export default RPDContainer;
