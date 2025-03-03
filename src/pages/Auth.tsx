import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { AxiosResponse } from "axios";
import { toFormikValidationSchema } from 'zod-formik-adapter';

import api from "../api/axios.ts";
import { useAppDispatch, useAppSelector } from "../hooks/hooks.ts";
import * as userActions from "../features/user/userSlice.ts";

import Modal, { ModalContent, ModalHeader, ModalTitle } from "../comoponents/Modal.tsx";
import Input from "../comoponents/Input.tsx";
import InputWrapper from "../comoponents/InputWrapper.tsx";
import Button from "../comoponents/Button.tsx";
import { RegisterFormSchema, RegisterFormSchemaType } from "../validations/registerForm.ts";
import { LoginFormSchema, LoginFormSchemaType } from "../validations/loginForm.ts";

const LoginForm = () => {
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik<LoginFormSchemaType>({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: ({ email, password }) => {
      api.post('auth/login', {
        email: email,
        password: password
      }).then((data: AxiosResponse) => {
        dispatch(userActions.add(data.data.user));

        localStorage.setItem('accessToken', data.data.accessToken);

        navigate('/');
      }).catch(e => {
        setError('Incorrect email address or password');

        console.error(e.response);
      });
    },
    validationSchema: toFormikValidationSchema(LoginFormSchema),
    validateOnChange: false,
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <InputWrapper label="Email" error={formik.errors.email || error}>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          { ...formik.getFieldProps("email") }
          required
        />
      </InputWrapper>
      <InputWrapper label="Password" error={formik.errors.password || error}>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          { ...formik.getFieldProps("password") }
        />
      </InputWrapper>
      <Button type="submit" className="w-full">Login</Button>
    </form>
  )
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const formik = useFormik<RegisterFormSchemaType>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    onSubmit: async ({ name, phone, email, password }) => {
      try {
        await api.post("/auth/register", {
          name,
          phone,
          email,
          password,
        });

        navigate('/activate');
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema: toFormikValidationSchema(RegisterFormSchema),
    validateOnChange: false,
  });

  return (
    <form className="space-y-4" onSubmit={formik.handleSubmit}>
      <InputWrapper label="Name" error={formik.errors.name}>
        <Input
          id="name"
          type="text"
          placeholder="Name"
          { ...formik.getFieldProps("name") }
          required
        />
      </InputWrapper>
      <InputWrapper label="Phone" error={formik.errors.phone}>
        <Input
          id="phone"
          type="tel"
          placeholder="+447123456789"
          { ...formik.getFieldProps("phone") }
          required
        />
      </InputWrapper>
      <InputWrapper label="Email" error={formik.errors.email}>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          { ...formik.getFieldProps("email") }
          required
        />
      </InputWrapper>
      <InputWrapper label="Password" error={formik.errors.password}>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          { ...formik.getFieldProps("password") }
          required
        />
      </InputWrapper>
      <InputWrapper label="Repeat Password" error={formik.errors.repeatPassword}>
        <Input
          id="repeatPassword"
          type="password"
          placeholder="Reapeat your Password"
          { ...formik.getFieldProps("repeatPassword") }
          required
        />
      </InputWrapper>
      <Button type="submit" className="w-full">Sign Up</Button>
    </form>
  )
};

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
