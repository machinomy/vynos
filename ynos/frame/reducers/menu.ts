import {Reducer} from "redux";

export interface MenuState {
    topmenu: { currentMenuItem: string }
}

export interface MenuAction {
    type: 'CHANGE_CURRENT_MENU_ITEM';
    menuItem?: string
}


const initialState:MenuState = {
    topmenu: { currentMenuItem: 'Wallet' }
};

export const topmenu = (state = initialState, action:MenuAction) => {
    if (action.type === 'CHANGE_CURRENT_MENU_ITEM') {
        return state = Object.assign({}, state, {topmenu: {currentMenuItem: action.menuItem}});
    } else {
        return state;
    }
};