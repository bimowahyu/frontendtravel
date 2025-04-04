import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { Dashboard } from '../componen/Dashboard';
import { Me } from '../fitur/AuthSlice';

export const DashboardPages = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(Me())
            .unwrap()
            .catch(() => {
                navigate('/login');
            });
    }, [dispatch, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
            {/* {isAuthenticated && user ? (
                <Dashboard userRole={user?.role} />
            ) : (
                <div>Please login to access the dashboard</div>
            )} */}
            <Dashboard />
        </Layout>
    );
};