import { Action } from 'redux'

export type RPDActions = AssigneeAction | ProductAction | PropertiesAction | RPDUpdateAction | CommentAddedAction | ReloadAction;

export interface AssigneeAction {
    type: 'Assignee',
    payload: any
}
export interface ProductAction {
    type: 'Product',
    payload: any
}
export interface PropertiesAction {
    type: 'Properties',
    payload: any
}
export interface RPDUpdateAction {
    type: 'RPDUpdated',
    payload: any
}
export interface CommentAddedAction {
    type: 'CommentAdded',
    payload: any
}
export interface ReloadAction {
    type: 'Reload',
    payload: Boolean
}

export function CommentAddedActionCreator(data: any): CommentAddedAction {
    return {
        type: 'CommentAdded', payload: data
    }
}

export function AssigneeActionCreator(data: any): AssigneeAction {
    return {
        type: 'Assignee', payload: data
    }
}
export function ProductActionCreator(data: any): ProductAction {
    return {
        type: 'Product', payload: data
    }
}
export function PropertiesActionCreator(data: any): PropertiesAction {
    return {
        type: 'Properties', payload: data
    }
}

export function RPDUpdateActionCreator(data: string): RPDUpdateAction {
    return {
        type: 'RPDUpdated', payload: data
    }
}

export function ReloadActionCreater(data: Boolean): ReloadAction {
    return {
        type: 'Reload', payload: data
    }
}