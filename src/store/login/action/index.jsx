import http from '../../../configs/middleware'
import toast from 'react-hot-toast';
export const signIn = (params) => {
 return async (dispatch) => {
  
    await http.post('/auth/login', params).then((response) => {
      console.log(response)
      const message = response.data.message === "" ? "Login Successfully" : response.data.message;

      toast.success(message, {
        position: 'top-right', // Position the toast at the top right
      });
    
      localStorage.setItem(
        'TOKEN',
        `Bearer ${response.data.token}`
      )
      localStorage.setItem('userDetails', JSON.stringify(response.data.userDetails));

    dispatch({ type: 'LOGIN_SUCCESS' })
    }).catch((err) => {
      
      const message = err.response.data.message



      toast.error
      (message, {
        position: 'top-right', // Position the toast at the top right
      });
      
    //   notifyError(err?.response?.data?.message || err?.message)
    })
  }
}
