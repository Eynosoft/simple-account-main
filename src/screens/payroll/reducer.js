import { PAYROLL } from 'constants/types'

const initState = {
  summary_list: [],
}

const PayrollReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case PAYROLL.SUMMARY_LIST:
      return {
        ...state,
        summary_list: Object.assign([], payload)
      }

    
    default:
      return state
  }
}

export default PayrollReducer