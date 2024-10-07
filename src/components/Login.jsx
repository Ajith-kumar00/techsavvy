import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../style/Login/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/logo.svg";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signIn } from "../store/login/action/index";

// Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  // Formik for handling form state and validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(signIn(values));
    },
  });

  return (
    <div className="login-container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <img src={logo} alt="TechSavvy" className="logo mb-1" />
      </div>

      <div className="card shadow-lg p-5">
        <h3 className="text-center mb-4">Welcome Back!</h3>
        <form onSubmit={formik.handleSubmit}>
          <InputField 
            id="email" 
            label="Email" 
            type="email" 
            formik={formik} 
            icon={faEnvelope} 
          />
          <InputField 
            id="password" 
            label="Password" 
            type="password" 
            formik={formik} 
            icon={faLock} 
          />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <a href="#" className="forgot-link text-primary">Forgot Password?</a>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
      </div>
    </div>
  );
};

// Reusable InputField component to reduce redundancy
const InputField = ({ id, label, type, formik, icon }) => (
  <div className="input-box">
    <label htmlFor={id}>{label}</label>
    <FontAwesomeIcon icon={icon} className="icon" />
    <input
      type={type}
      id={id}
      className={`form-control ${formik.touched[id] && formik.errors[id] ? 'is-invalid' : ''}`}
      placeholder={label}
      {...formik.getFieldProps(id)}
    />
    {formik.touched[id] && formik.errors[id] && (
      <div className="invalid-feedback">{formik.errors[id]}</div>
    )}
  </div>
);

export default Login;
