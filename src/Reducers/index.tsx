import { combineReducers } from 'redux'
import { ProductsProps } from '../Components/Product'
import { RPDProps } from '../Components/RPD'
import { RPDActions } from '../Actions'

export interface RootState {
    Reload: Boolean,
    MessageKey: string,
    Assignees: any[],
    Products: any[],
    Properties: any,
    PropertyOptions: any,
    Comments: any[]
}

const RpdTypes = ["Bug", "Question", "Enhancement Request", "Incident"];
const SeverityValues = ["Low", "Medium", "High", "Critical", "System-Wide Emergency"];
const PriorityValues = ["Under Consideration", "None", "Low", "High", "Critical"];
const DifficultyValues = ["Not applicable", "Unknown", "Trivial", "Moderate", "Difficult", "Extreme"];

function defaultValue() {
    return {
        Assignees: [{ Name: "Unassigned" }]
    }
}

function init(): RootState {  // initialise RPD state
    return {
        Reload: true,
        MessageKey: '25755580',
        Assignees: [],
        Products: [],
        Properties: {},
        PropertyOptions: {
            Severity: SeverityValues,
            Type: RpdTypes,
            Priority: PriorityValues,
            Difficulty: DifficultyValues
        },
        Comments: []
    }
}

function handleReload(data): Boolean {
    var i = document.getElementById("go")    // use http call to get data instead
    if (i) {
        i.click();
    }
    return data;
}

function createPropertiesObject(RPDData: any): any {
    let toReturn = {};
    Object.keys(RPDData).forEach((key) => {
        switch (key) {
            case "Type":
                toReturn["Type"] = RPDData[key];
                break;
            case "Severity":
                toReturn["Severity"] = RPDData[key];
                break;
            case "Priority":
                toReturn["Priority"] = RPDData[key];
                break;
            case "Difficulty":
                toReturn["Difficulty"] = RPDData[key];
                break;
            case "Status":
                toReturn["Status"] = RPDData[key];
                break;
        }
    });
    console.log(JSON.stringify(toReturn));
    return toReturn;
}

function mergeComment(Comments: any[], Comment: any): any[] {
    return Comments;
}
export const RPDReducer = (state: RootState = init(), action: RPDActions): RootState => {

    switch (action.type) {
        case 'Assignee':        // not used anywhere 
            return Object.assign({}, state, {
                Assignees: action.payload
            });
        case 'Product':      // not used anywhere 
            return Object.assign({}, state, {
                Products: action.payload
            });
        case 'RPDUpdated':   
            console.log(action.payload.toString());
            return Object.assign({}, state, {
                MessageKey: action.payload.Id,
                Products: action.payload.Products,
                Assignees: action.payload.Assignees ? action.payload.Assignees : defaultValue().Assignees,
                Properties: createPropertiesObject(action.payload),
                Comments: action.payload.Comments
            }); 
        case 'CommentAdded':   // not used anywhere 
            return Object.assign({}, state, {
                Comments: mergeComment(state.Comments, action.payload)
            });
        case 'Reload':
            return Object.assign({}, state, {
                Reload: handleReload(action.payload)
            });
    }
    return state;   // return same state in case of no action
}



export const combinedReducer = combineReducers({   // cobinign reducer not needed since there is only one
    RPD: RPDReducer
}); 