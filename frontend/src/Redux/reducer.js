import { TOGGLE_VIEW,DRAWER,ALL_NOTES, ALL_LABELS } from "../Redux/actionType";

export const initialState = {
  view:true,
  openDrawer:false,
  allNotes:[],
  allLabels:[],

 
};

const reducer = (state = initialState, action) => {
  switch (action.type) {


    case DRAWER: {
      return { ...state,openDrawer: !state.openDrawer  };
    }
 
    case TOGGLE_VIEW: {
      return {...state, view: !state.view   };
    }

    case ALL_NOTES: {
      return {...state, allNotes: action.payload};
    }
    case ALL_LABELS: {
      return {...state, allLabels: action.payload};
    }
    

    default:
      return state;
  }
};

export default reducer;
