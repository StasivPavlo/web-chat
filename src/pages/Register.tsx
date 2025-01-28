import React from 'react';
import { useFormik } from 'formik';
import api from '../api/axios.ts';
import { useNavigate } from 'react-router';

const Register: React.FC = () => {
  const navigate = useNavigate();

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
        navigate('/login');
      } catch (error) {
        console.log(error);
      }
    }
  })

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
  )
};

export default Register;
