import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import firebase from "firebase";
import { CustomInput, CustomMobileInput } from "@/components/formik";
import { Field, Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sendOtp, verifyOtp } from "@/redux/actions/authActions";
import auth from "@/services/config";
import firbaseLocal from "@/services/firebase";
import { setAuthenticating, setAuthStatus } from "@/redux/actions/miscActions";
import Modal from "./Modal";
import * as Yup from "yup";

const SignInSchema = Yup.object().shape({
  phone: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string(),
      value: Yup.string(),
    })
    .required("Phone is required."),
  otp: Yup.string().required("OTP is required."),
});

const SignIn = ({ onClose }) => {
  const [showOtp, setShowOtp] = useState(false);
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating,
  }));

  const dispatch = useDispatch();

  useScrollTop();

  const handleSendOtp = ({ value }) => {
    dispatch(sendOtp(`+${value}`));
  };

  const handleVerifyOtp = (value) => {
    dispatch(verifyOtp(value));
  };

  useEffect(
    () => () => {
      dispatch(setAuthStatus(null));
      dispatch(setAuthenticating(false));
    },
    []
  );

  return (
    <div className="auth-content">
      <div id="recaptcha-container" />
      {!authStatus?.success && (
        <>
          {authStatus?.message && (
            <h5 className="text-center toast-error">{authStatus?.message}</h5>
          )}
          <div
            className={`auth ${
              authStatus?.message && !authStatus?.success && "input-error"
            }`}
          >
            <div className="auth-main">
              <h4>Login</h4>
              <br />
              <div className="auth-wrapper">
                <Formik
                  initialValues={{
                    phone: {},
                    otp: "",
                  }}
                  validateOnChange
                  validationSchema={SignInSchema}
                >
                  {(props) => (
                    <Form>
                      {!isAuthenticating && (
                        <>
                          <div className="auth-field">
                            <Field name="phone">
                              {({ field, form, meta }) => (
                                <CustomMobileInput
                                  defaultValue={props.values.phone}
                                  name={field.name}
                                  label="Enter Your Phone Number"
                                />
                              )}
                            </Field>
                          </div>
                          <br />
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className="button auth-button button-small"
                              type="button"
                              onClick={() => handleSendOtp(props.values.phone)}
                            >
                              Send OTP
                            </button>
                            <button
                              className="button button-small button-muted"
                              onClick={onClose}
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                      {isAuthenticating && (
                        <>
                          <Field name="otp">
                            {({ field, form, meta }) => (
                              <>
                                <h6
                                  style={{
                                    marginBottom: "10px",
                                    fontSize: "12px",
                                  }}
                                >
                                  Enter the code sent to your phone
                                </h6>
                                <OtpInput
                                  value={props.values.otp}
                                  onChange={(value) =>
                                    form.setFieldValue("otp", value)
                                  }
                                  numInputs={6}
                                  shouldAutoFocus
                                  renderInput={(props) => (
                                    <input
                                      {...props}
                                      name={field.name}
                                      style={{
                                        width: "30px",
                                        marginRight: "12px",
                                        marginBottom: "12px",
                                        padding: "1rem",
                                        borderRadius: "5px",
                                      }}
                                    />
                                  )}
                                ></OtpInput>
                              </>
                            )}
                          </Field>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              className="button auth-button button-small"
                              type="button"
                              onClick={() => handleVerifyOtp(props.values.otp)}
                            >
                              Verify OTP
                            </button>
                            <button
                              className="button button-small button-muted"
                              onClick={onClose}
                              type="button"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

SignIn.propTypes = {
  onClose: PropType.func.isRequired,
};

const WithModalSignIn = ({ show, onClose }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      overrideStyle={{ padding: "20px 20px", width: "50rem" }}
    >
      <SignIn onClose={onClose} />
    </Modal>
  );
};

WithModalSignIn.propTypes = {
  show: PropType.bool.isRequired,
  onClose: PropType.func.isRequired,
};

export default WithModalSignIn;
