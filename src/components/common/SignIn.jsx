import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import firebase from "firebase";
import { SocialLogin } from "@/components/common";
import { CustomInput, CustomMobileInput } from "@/components/formik";
import { FORGOT_PASSWORD, SIGNUP } from "@/constants/routes";
import { Field, Form, Formik, useFormikContext } from "formik";
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

const SignIn = ({ history }) => {
  const [showOtp, setShowOtp] = useState(false);
  const { authStatus, isAuthenticating } = useSelector((state) => ({
    authStatus: state.app.authStatus,
    isAuthenticating: state.app.isAuthenticating,
  }));

  const dispatch = useDispatch();

  useScrollTop();
  useDocumentTitle("Sign In | Ezys");

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
                          <button
                            className="button auth-button button-small"
                            type="button"
                            onClick={() => handleSendOtp(props.values.phone)}
                          >
                            Send OTP
                          </button>
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
                          <div className="d-flex justify-content-center">
                            <button
                              className="button auth-button button-small"
                              type="button"
                              onClick={() => handleVerifyOtp(props.values.otp)}
                            >
                              Verify OTP
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
  history: PropType.shape({
    push: PropType.func,
  }).isRequired,
};

export default SignIn;
