import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout'
import { Profile } from '../componen/Profile';
import { Me } from '../fitur/AuthSlice';

export const ProfilePages = () => {
      const dispatch = useDispatch();
            const navigate = useNavigate();
            const { isError, user } = useSelector((state) => state.auth);
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
        <Profile userUuid={user?.id}/>
    </Layout>
   
  )
}
