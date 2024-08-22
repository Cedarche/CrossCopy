import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
// import AuthHome from './Auth';
import HomePage from './HomePage';
import { auth, onAuthStateChanged } from '../firebase';
import axios from 'axios';
import { useAuth, AuthProvider } from './AuthContext';
import { API_URL } from './URL';

const AuthHome = lazy(() => import('./Auth'));

function AuthHandler() {
  const { user, loading, logout } = useAuth();

  // If loading is true, display a loading spinner or some other placeholder
  if (loading) {
    return (
      <SpinnerContainer>
        <Spinner animate={spinner.loop} />
      </SpinnerContainer>
    );
  }

  return user ? (
    <HomePage />
  ) : (
    <Suspense
      fallback={
        <SpinnerContainer>
          <Spinner animate={spinner.loop} />
        </SpinnerContainer>
      }
    >
      <AuthHome />
    </Suspense>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <Container initial="hidden" animate="visible">
        <HeaderContainer>
          <Header href="https://crosscopy.dev" target="_blank" rel="noopener noreferrer">
            CROSS COPY
          </Header>
        </HeaderContainer>
        <AuthHandler />
      </Container>
    </AuthProvider>
  );
};

export default App;

const Container = styled(motion.div)`
  width: 100%;
  height: 400px;
  width: 350px;
  max-height: 400px;
  display: flex;
  background: #3b3b3b;
  border: 1px solid #66ffff;
  flex-direction: column;
  align-items: center;
`;
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.a`
  color: #66ffff;
  font-size: 22px;
  margin-bottom: 10px;
  margin-top: 10px;
  text-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1);
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  stroke: 1px solid black;
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
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
      ease: 'linear',
      repeat: Infinity,
    },
  },
};
