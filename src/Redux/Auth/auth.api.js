import axios from "axios";
export const getAuth= async(UserData)=>{

    try {
        let res = await axios.post(`https://mock-5yj5.onrender.com/login`,UserData)
      
        return res.data;
    } catch (error) {
        return error;
    }
}