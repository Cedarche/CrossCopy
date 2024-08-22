import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiX, FiAlertTriangle } from "react-icons/fi";

import { CenterContainer } from "../Home/FilesElements";
import { auth } from "../firebase";

export default function ErrorModal({ onClose, showAuth }) {
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
      <FiAlertTriangle
        size={40}
        color="#ff8800"
        style={{ marginTop: "15px", marginBottom: "10px", strokeWidth: "1px" }}
      />
      <SubHeader>Please log in or sign up to batch download files.</SubHeader>

      <CenterContainer
        style={{ flexDirection: "column", marginTop: 0, minWidth: "250px" }}
      >
        <Button
          onClick={() => {
            onClose(), showAuth(true);
          }}
          style={{ marginTop: "10px" }}
        >
          Login/Sign up
        </Button>
        <Button
          style={{
            background: "none",
            color: "#66ffff",
            border: "1px solid #cadaef",
            marginBottom: "12px",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </CenterContainer>

      <Close onClick={onClose} size={15} />
    </ModalContent>
  );
}

const ModalContent = styled.div`
  position: relative;
  background-color: #313131;
  margin: auto;
  padding: 8px;
  display: flex;
  flex: 1;
  top: -110px;
  z-index: 3;

  max-width: 250px;
  height: auto;
  padding-bottom: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 420) {
    top: -110px;
  }
`;

const SubHeader = styled.h2`
  font-size: 15px;
  color: #dadada;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 200px;
  font-weight: 400;
`;

const Button = styled.button`
  padding: 2px 10px;
  box-sizing: border-box;
  border: none;
  background: #66ffff;
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 13px;
  transition: all 0.3s ease;
  height: 38px;
  width: 85%;
  margin-top: 6px;
  /* margin-right: 5px; */
  &:hover {
    outline: 1px solid #646cff;
    /* scale: 1.02; */
    cursor: pointer;
  }
`;

const Close = styled(FiX)`
  position: absolute;
  top: 8px;
  right: 8px;
  cursor: pointer;
`;
