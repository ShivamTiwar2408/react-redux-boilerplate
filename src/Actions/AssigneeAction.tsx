//---------------- not used 

import { Action } from 'redux'


export type AssigneeAction = GET | ADD | POST;
export interface GET extends Action {
    type: 'getAssigneeAction'
}

export interface ADD extends Action {
    type: 'addAssigneeAction',
    data: any
}
export interface POST extends Action {
    type: 'postAssigneeAction', //beacuse strings serializable
    data: any[]
}
export function getAssigneeActionCreater(actionName : string, data : any): any {
    return {
        type: 'getAssigneeAction'
    }
}

export function postAssigneeActionCreater(data: any[]): POST {
    return {
        type: 'postAssigneeAction',
        data: data
    }
}

export function addAssigneeActionCreater(data): ADD {
    return {
        type: 'addAssigneeAction',
        data: data
    }
}