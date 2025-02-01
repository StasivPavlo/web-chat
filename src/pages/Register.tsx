import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { useAppSelector } from '../hooks/hooks.ts';

import api from '../api/axios.ts';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const { user } = useAppSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        await api.post("/auth/register", values);

        console.log("successfully registered!");
        navigate('/activate');
      } catch (error) {
        console.log(error);
      }
    }
  });

  useEffect(() => {
    if (user || accessToken) {
      navigate('/');
    }
  }, [user, accessToken]);

  return (
    <div>
      <div>
        <h1>Register</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone number"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
