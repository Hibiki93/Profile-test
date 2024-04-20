// import { createSlice, PayloadAction }from '@reduxjs/toolkit';

// const sortItems = () => {
//   return {
//     type: 'SORT_ITEMS'
//   };
// };

const initialState = {
  items: [
    {
      name: 'Default',
      editAble: false,
    },
    {
      name: 'Custom',
      editAble: true
    }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SORT_ITEMS':
      const sortedItems = [...state.items].sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });

      return {
        ...state,
        items: sortedItems
      };

    default:
      return state;
  }
};

export default reducer; 