export interface State {};

export interface Action { 
    type: "SET_FORM",  payload: { name: string, value: string } 
}

function formReducer<S extends State, A extends Action>(state: S, action: A){
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
}

export default formReducer;