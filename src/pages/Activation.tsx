import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router";
import { validate } from 'uuid';

import api from "../api/axios.ts";
import { useAppSelector } from "../hooks/hooks.ts";

import Modal from "../comoponents/Modal.tsx";
import Loading from "../comoponents/Loading.tsx";

const Activation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const token = searchParams.get('token');

  const { user } = useAppSelector(state => state.user);

  useEffect(() => {
    if (token) {
      if (validate(token)) {
        setIsLoading(true);
        api.get('/auth/activate/' + token)
          .catch(e => {
            setError(e.message);
          })
          .finally(() => setIsLoading(false));
      } else {
        setError('Invalid token');
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
      <Modal isOpen className="w-full max-w-md">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold">Check Your Email</h2>
          <p className="text-gray-400">We've sent an activation link to your email.</p>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen className="w-full max-w-md">
      {isLoading && (
        <Loading />
      )}
      {!isLoading && !error && (
        <div className="text-center text-white">
          <h2 className="text-xl font-bold">Activation Successful</h2>
          <p className="text-gray-400">Your account has been activated. You can now log in.</p>
          <button onClick={() => navigate("/login")}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition">
            Go to Login
          </button>
        </div>
      )}
      {!isLoading && error && (
        <div className="text-center text-white">
          <h2 className="text-xl font-bold">Activation Failed</h2>
          <p className="text-gray-400">The activation link is invalid or expired.</p>
        </div>
      )}

    </Modal>
  );
};

export default Activation;
