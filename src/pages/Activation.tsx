import React, {useEffect, useState} from 'react';
import { useAppSelector } from "../hooks/hooks.ts";
import { useNavigate, useSearchParams } from "react-router";
import api from "../api/axios.ts";
import { validate } from 'uuid';

const Activation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const { user } = useAppSelector(state => state.user);


  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      if (validate(token)) {
        api.get('/auth/activate/' + token).catch(e => {
          setError(e.message);
        }).finally(() => setIsLoading(false));
      } else {
        setError('Invalid token');
        setIsLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    if (user || accessToken) {
      navigate('/');
    }
  }, [user, accessToken]);

  if (!token) {
    return (
      <p>You need confirm your email. We send activation URL to you email.</p>
    )
  }

  return (
    <div>
      <p>Activation Page</p>
      {isLoading && (
        <p>Loading...</p>
      )}
      { !isLoading && error && <p>Error: {error}</p> }
      { !isLoading && !error && (
        <p>Activation success, go to <a href="http://localhost:5173/login">Login</a></p>
      )}
    </div>
  );
};

export default Activation;
