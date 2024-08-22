import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { Spinner, spinner } from '../Home/FilesElements';
import { auth } from '../firebase';
import LoginPage from './AuthHome';

export default function AuthModal({ onClose }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onClose();
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);
  return (
    <ModalContent>
      <LoginPage />
      <Close onClick={onClose} size={15} />
    </ModalContent>
  );
}

const ModalContent = styled.div`
  position: relative;
  /* background-color: rgba(0, 0, 0, 0.3) !important; */

  margin: auto;
  padding: 8px;
  display: flex;
  flex: 1;

  max-width: 310px;
  /* height: 438px; */
  padding-top: -3px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: auto;
`;

const Close = styled(FiX)`
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  &:hover {
    color: #646cff;
  }
`;
