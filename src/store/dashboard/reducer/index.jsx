// ** Initial State
const initialState = {
    isloading: false,
    heatmaploading:false,
    performancedata: {},
    heatmapdata:{},
    metricsFilterData:[]
    
  }
  
  const dashboard = (state = initialState, action) => {
      switch (action.type) {
       
        case 'GET_PERFORMANCE_DATA_INIT':
          return { ...state, isloading:true }
        case 'GET_HEATMAP_DATA_INIT':
            return {...state, heatmaploading:true}  
    
        case 'GET_PERFORMANCE_DATA':
          return { ...state, performancedata: action.data,isloading: false }
        case 'GET_DAYPARTINGFILTERLIST':
          return { ...state, metricsFilterData: action.data }
        case 'GET_HEATMAP_DATA':
          return {...state, heatmapdata:action.data, heatmaploading:false}    
        default:
          return { ...state }
      }
    }
  
    export default dashboard
  