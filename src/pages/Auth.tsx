import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { AxiosResponse } from "axios";

import api from "../api/axios.ts";
import { useAppDispatch, useAppSelector } from "../hooks/hooks.ts";
import * as userActions from "../features/user/userSlice.ts";

import Modal, { ModalContent, ModalHeader, ModalTitle } from "../comoponents/Modal.tsx";
import Input from "../comoponents/Input.tsx";
import Button from "../comoponents/Button.tsx";

const LoginForm = () => {
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
        localStorage.setItem('accessToken', data.data.accessToken);
        navigate('/');
      }).catch(e => {
        console.error(e.response);
      });
    }
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
        required
      />
      <Button type="submit" className="w-full">Login</Button>
    </form>
  )
};

const RegisterForm = () => {
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

        navigate('/activate');
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="Name"
        onChange={formik.handleChange}
        value={formik.values.name}
        required
      />
      <Input
        id="phone"
        name="phone"
        type="tel"
        placeholder="Phone number"
        onChange={formik.handleChange}
        value={formik.values.phone}
        required
      />
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        onChange={formik.handleChange}
        value={formik.values.email}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        onChange={formik.handleChange}
        value={formik.values.password}
        required
      />
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  )
};

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const accessToken = localStorage.getItem('accessToken');

  const type = searchParams.get('type');
  const isLogin = type === 'login';

  useEffect(() => {
    if (user || accessToken) {
      navigate('/');
    }
  }, [user, accessToken]);

  return (
    <div>
      <Modal isOpen className="w-full max-w-md">
        <ModalHeader>
          <ModalTitle>{ isLogin ? "Login" : "Sign Up" }</ModalTitle>
        </ModalHeader>
        <ModalContent>
          { isLogin ? <LoginForm/> : <RegisterForm/> }
          <p className="mt-4 text-center text-sm text-gray-300">
            { isLogin ? (
              <>
                Don't have an account?&nbsp;
                <Link to="/auth?type=signup" className="text-blue-400 hover:text-blue-300">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?&nbsp;
                <Link to="/auth?type=login" className="text-blue-400 hover:text-blue-300">Login</Link>
              </>
            )}
          </p>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AuthPage;
