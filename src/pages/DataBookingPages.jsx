import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout'
import DataBooking from '../componen/DataBooking';
import { Me } from '../fitur/AuthSlice';

export const DataBookingPages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);
    
    useEffect(() => {
      dispatch(Me());
    }, [dispatch]);
  
    useEffect(() => {
      if(isError){
        navigate('/login')
      }
    
    }, [isError,navigate]);
  return (
    <Layout>
        <DataBooking />
    </Layout>
  )
}
