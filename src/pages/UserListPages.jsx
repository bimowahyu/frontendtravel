import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout'
import UserList from '../componen/UserList'
import { Me } from '../fitur/AuthSlice';

export const UserListPages = () => {
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
    <UserList userRole={user?.role} userUuid={user?.id} />
   </Layout>
  )
}
