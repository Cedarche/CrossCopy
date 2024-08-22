import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"; // <-- import this
import styled from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { auth, onAuthStateChanged } from "./firebase";
import HomePage from "./Home/Home";
import ExtensionDownload from "./Home/ExtensionDownload";
import Share from "./Share/Share";
import Privacy from "./Auth/Privacy";
import Contact from "./Auth/Contact";
import { motion } from "framer-motion";
import LandingPage from "./Landing/LandingPage";
import AuthPage from "./Auth/AuthPage";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

function AuthHandler() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once Firebase returns the user's auth status
      if (user) {
        navigate("/home");
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // If loading is true, display a spinner
  if (loading) {
    return (
      <Container>
        {" "}
        <Spinner animate={spinner.loop} />
      </Container>
    );
  }

  return user ? <HomePage /> : <LandingPage />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Cross Copy - Your files, everywhere</title>
                  <meta
                    name="description"
                    content="CrossCopy is the easiest way to get text or links from one device to another"
                  />
                </Helmet>
                <AuthHandler />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Helmet>
                  <title>Home - Cross Copy</title>
                  <meta
                    name="description"
                    content="CrossCopy is the easiest way to get text or links from one device to another"
                  />
                </Helmet>
                <AuthHandler />
              </>
            }
          />
          <Route
            path="/login/:linkingCode?"
            element={
              <>
                <Helmet>
                  <title>Login or Signup - CrossCopy</title>
                </Helmet>
                <AuthPage />
              </>
            }
          />
          <Route
            path="/download"
            element={
              <>
                <Helmet>
                  <title>Download - CrossCopy</title>
                  <meta
                    name="description"
                    content="A page where users can download files in the background"
                  />
                </Helmet>
                <ExtensionDownload />
              </>
            }
          />
          <Route
            path="/shared/:uniqueKey"
            element={
              <>
                <Helmet>
                  <title>Share - CrossCopy</title>
                  <meta
                    name="description"
                    content="A page where users can send and share files with other users"
                  />
                </Helmet>
                <Share />
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>
                <Helmet>
                  <title>Privacy Policy - CrossCopy</title>
                  <meta
                    name="description"
                    content="Cross Copy's Privacy Policy"
                  />
                </Helmet>
                <Privacy />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Helmet>
                  <title>Contact Us - CrossCopy</title>
                </Helmet>
                <Contact />
              </>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

const Container = styled(motion.div)`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 1;
  background: #242424;
  flex-direction: column;
  flex: 1;

  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 100vh;
  max-width: 100%;

`;

const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 25px;
  height: 25px;
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
