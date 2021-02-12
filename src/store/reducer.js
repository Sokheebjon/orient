export default function reducer(state, action) {
   switch (action.type) {
      case 'MODE': {
         return {...state, mode: action.payload}
      }
      case 'SET_TOKEN': {
         return {...state, token: action.payload}
      }
      case 'UPDATED': {
         return {...state, updated: action.payload}
      }
      case 'PAGE': {
         return {...state, page: action.payload}
      }
      case 'PER_PAGE': {
         return {...state, perPage: action.payload}
      }
      case 'SNACKBAR': {
         return {...state, snackbar: action.payload}
      }
   }
   return state
}