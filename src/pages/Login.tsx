import React from 'react';
import { useFormik } from 'formik';
import { useAppDispatch } from "../hooks/hooks.ts";
import * as userActions from './../features/user/userSlice.ts';
import api from "../api/axios.ts";
import { useNavigate } from "react-router";
import { AxiosResponse } from "axios";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: (values) => {
      api.post('auth/login', {
        email: values.email,
        password: values.password
      }).then((data: AxiosResponse) => {
        dispatch(userActions.add(data.data.user));
        navigate('/')
      }).catch(e => {
        console.error(e.response.data);
      });
    }
  });

  return (
    <div>
      <div>
        <form onSubmit={formik.handleSubmit}>
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

export default Login;
