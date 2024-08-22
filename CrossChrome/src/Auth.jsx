import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import styled from "styled-components";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth/web-extension";

import axios from "axios";
import { API_URL } from "./URL";

export default function AuthHome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sLoading, setSLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("Forgot password?");

  const auth = getAuth();

  function errorSwitch(err) {
    switch (err) {
      case "auth/wrong-password":
        return setErrorMessage("Incorrect Email or Password");
      case "auth/weak-password":
        return setErrorMessage("Password should be at least 6 characters.");
      case "special":
        return setErrorMessage("Password should include Capital letters.");
      case "auth/email-already-in-use":
        return setErrorMessage("Email already in use");
      default:
        return setErrorMessage("An error occurred");
    }
  }

  const handleLogin = () => {
    setLoading(true);
    setError(false);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setLoading(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setForgotPassword(true);
        setLoading(false);
        setError(true);
        errorSwitch(String(errorCode));
        // ..
      });
  };

  const handleSignUp = () => {
    setSLoading(true);
    setError(false);

    // Check if password contains at least one special character
    const capitalLetterRegex = /[A-Z]/;
    if (!capitalLetterRegex.test(password)) {
      setError(true);
      errorSwitch("special");
      setSLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setSLoading(false);

        axios
          .post(`${API_URL}/signup/${user.uid}`, {
            email: user.email,
          })
          .then((response) => {
            // User data stored in the database
          })
          .catch((error) => {
            console.log("Failed to store user data");
            setSLoading(false);
            setError(true);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        setSLoading(false);
        setError(true);
        errorSwitch(String(errorCode));
      });
  };

  function sendReset() {
    if (email) {
      sendPasswordResetEmail(auth, email).then((result) => {
        if (result) {
          setForgotMessage("Password reset email sent!");
          setPassword("");
          setTimeout(() => {
            setForgotPassword(false);
          }, 10000);
        } else {
          setErrorMessage("Email was not valid...");
          setError(true);
        }
      });
    }
  }
  return (
    <SubContainer>
      <SubHeader>Simple cross-platform media transfers</SubHeader>
      <LayoutGroup>
        <Input
          layout
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ marginTop: "20px" }}
        />
        <Input
          layout
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {forgotPassword && (
          <ForgotMessage
            layout
            onClick={() => {
              sendReset();
            }}
          >
            {forgotMessage}
          </ForgotMessage>
        )}
        <Button layout onClick={handleLogin} disabled={loading || sLoading}>
          {loading ? <Spinner animate={spinner.loop} /> : "Login"}
        </Button>
        <Button layout onClick={handleSignUp} disabled={loading || sLoading}>
          {sLoading ? <Spinner animate={spinner.loop} /> : "Sign Up"}
        </Button>
        {error && <ErrorMessage layout>{errorMsg} </ErrorMessage>}
      </LayoutGroup>
    </SubContainer>
  );
}

const SubContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  max-height: 400px;
  width: 300px;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Input = styled(motion.input)`
  margin: 10px;
  padding: 10px;
  width: 200px;
  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;
`;

const Button = styled(motion.button)`
  margin: 10px;
  padding: 8px;
  width: 220px;
  border-radius: 0px;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1),
    6px 6px 0px rgba(0, 234, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 14px;
  height: 14px;
  border-left-color: #66ffff;
  border-radius: 50%;
`;

const spinner = {
  loop: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

const ForgotMessage = styled(motion.span)`
  width: 200px;
  display: flex;
  color: #878787;
  font-size: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0px;
  margin-bottom: 2px;
  cursor: pointer;
`;

const ErrorMessage = styled(motion.span)`
  width: 100%;
  display: flex;
  color: #f90000;
  font-size: 11px;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  max-width: 230px;
  margin-left: 3px;
`;

const SubHeader = styled.h4`
  color: white;
  margin: 0;
  padding: 0;
  font-size: 11px;
  font-weight: 300;
  margin-bottom: 3px;
  font-style: italic;
`;
