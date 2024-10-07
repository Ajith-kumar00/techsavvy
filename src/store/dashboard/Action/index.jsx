import axios from 'axios'
import http from '../../../configs/middleware'

export const getperformancedatainit = () => ({
    type: 'GET_PERFORMANCE_DATA_INIT'
  })
  
  
export const getheatmapinit = () => ({
    type: 'GET_HEATMAP_DATA_INIT'
  })
export const getperformancedata = (data) => {
   
    return async (dispatch) => {
        dispatch(getperformancedatainit())

      await http.post(`/day-parting/DayPartingPerformanceGraphList`, data).then((response) => {
       
        dispatch({
          type: 'GET_PERFORMANCE_DATA',
          data: response.data.result

        })
        
      })
    }
  }


  export const heatmapdata = (data) => {
   debugger
    return async (dispatch) => {
        dispatch(getheatmapinit())

      await http.post(`/day-parting/heatmap-list`, data).then((response) => {
       
        dispatch({
          type: 'GET_HEATMAP_DATA',
          data: response.data

        })
        
      })
    }
  }


  export const DayPartingFilterList = (data) => {
   
    return async (dispatch) => {
    

      await http.post(`/day-parting/DayPartingFilterList`, data).then((response) => {
       
        dispatch({
          type: 'GET_DAYPARTINGFILTERLIST',
          data: response.data.result

        })
        
      })
    }
  }

 















