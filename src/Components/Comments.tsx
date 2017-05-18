import * as React from "react";
import { RootState } from '../Reducers'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, Action } from 'redux'
import * as  RPDActions from '../Actions'

export interface CommentsProps { MessageKey?: string, Comments?: any[], dispatch?: Dispatch<RootState> } //params?: any, history?: any, 
interface CommentsState { NewComment: string }

class Comments extends React.Component<CommentsProps, CommentsState> {
    constructor(props: CommentsProps) {
        super(props);
        this.state = {
            NewComment: ""  // MesssageKey: this.props.params.id
        };
        this.handleChange = this.handleChange.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
        this.CancelAddComment = this.CancelAddComment.bind(this);
        this.SaveComment = this.SaveComment.bind(this);
    }
    setTheState(state: any) {
        this.setState(state);
    }
    render() {
        var Comments = this.props.Comments;
        let comments;
        if (Comments.length) {
            comments = Comments.map(comment => {
                return (
                    <div className="comment" style={{ margin: '10px' }}>
                        <div style={{ border: '1px solid' }}>
                            <div style={{ background: 'grey', padding: '2px' }}>
                                <div style={{ color: 'yellow' }} >{comment.Author.Name}</div>
                                <div style={{ background: 'beige' }} dangerouslySetInnerHTML={{ __html: comment.Content }} ></div>
                            </div>
                        </div>
                    </div>
                )
            });
        }
        return (
            <div className="comments">
                <div>{comments}</div>
                <div className="comment-box" style={{ border: '5px solid #3786cc', width: '50%', height: '100px', position: 'fixed', bottom: '20px', zIndex: 100 }}>
                    <textarea style={{ width: '100%', height: '100px' }} placeholder="type your comment here..." value={this.state.NewComment} onChange={this.onCommentChange}></textarea>
                    <div><button style={{ float: 'left' }} onClick={this.CancelAddComment}> Cancel</button>
                        <button style={{ float: 'right' }} onClick={this.SaveComment}> Send</button></div>
                </div>
            </div>
        )
    }
    onCommentChange(e: any) {
        this.setState({ NewComment: e.target.value });
    }
    CancelAddComment() {
        this.setState({ NewComment: "" });
    }
    SaveComment() {
        let currentContext = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://iswebdev.pc.factset.com/rpd/api/v2/rpd/" + this.props.MessageKey + "/comments", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({ Content: this.state.NewComment }));
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                currentContext.props.dispatch(RPDActions.CommentAddedActionCreator(currentContext.state.NewComment));
                currentContext.props.dispatch(RPDActions.ReloadActionCreater(false));
                currentContext.CancelAddComment();
            }
        }
    }
    handleChange(evt: any): any {
        let mKey = evt.target.value;
        this.setState({ NewComment: this.state.NewComment });
    }
}


//------------------------ CONTAINER-----------------------------

function mapStateToProps(rootState: any, props: CommentsProps): CommentsProps {  //props
    return {
        Comments: rootState.RPD.Comments,
        MessageKey: rootState.RPD.MessageKey
    };
}
const CommentsContainer = connect(mapStateToProps)(Comments); //, mapDispatchToProps

export default CommentsContainer;


