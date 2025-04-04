import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout'
import { Konfigurasi } from '../componen/Konfigurasi';
import { Me } from '../fitur/AuthSlice';

export const KonfigurasiPages = () => {
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
        <Konfigurasi />
    </Layout>
  )
}
