import React, {useState, useEffect} from 'react'
import axios from "../axiosInstance"

const Quries = () => {
  const [business, setbusiness] = useState("")
  
    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await axios.get('/api/v1/enquiry/get');
            console.log(response);
            setbusiness(response.data);
          } catch (error) {
            console.error('Error fetching reviews:', error);
          }
        };
        fetchReviews();
      }, []);
  
      console.log(business, "user Business");
  return (
    <div>
      quriessssssdchsdbfsj
    </div>
  )
}

export default Quries
