import React, { useState, } from "react";
import styled from "styled-components";
import { FiX, FiCheckCircle } from "react-icons/fi";
import { Spinner, spinner } from "../../Home/FilesElements";
import { motion } from "framer-motion";
import { LinkingText } from "../AuthElements";
import "react-phone-number-input/style.css";
import PhoneInputComponent from "react-phone-number-input";

const SMS_URL = import.meta.env.VITE_SMS_URL;

export default function ShareCodeModal({ onClose, url }) {
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smsSent, setSmsSent] = useState(false);

  const handleShare = () => {
    setLoading(true);

    // Check if the contact is a valid mobile number using regex
    const mobileRegex = /^\+?\d{10,15}$/;
    if (!mobileRegex.test(contact)) {
      setError("Invalid mobile number.");
      setLoading(false);
      return;
    }

    fetch(SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: contact, body: url }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("SMS sent successfully:", data);
        setSmsSent(true);
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        setError("Failed to send SMS. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ModalContent>
      <Heading>Share Linking Code</Heading>
      <LinkingText style={{ marginBottom: "5px" }}>
        Send this linking code directly to your mobile to link it to your
        account.
      </LinkingText>
      {loading ? (
        <InputContainer>
          <Spinner animate={spinner.loop} />
        </InputContainer>
      ) : smsSent ? (
        <InputContainer>
          <FiCheckCircle
            color={"#66ff66"}
            size={18}
            style={{ marginRight: "8px", marginBottom: "2px" }}
          />{" "}
          <SuccessMessage>Message sent successfully!</SuccessMessage>
        </InputContainer>
      ) : (
        <InputContainer>
          {/* <Input
            type="text"
            placeholder="Enter email or phone number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          /> */}
          <StyledPhoneInput
            placeholder="Enter phone number"
            value={contact}
            onChange={setContact}
            international
            defaultCountry="AU"
          />

          <Button onClick={handleShare}>Share</Button>
        </InputContainer>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Close onClick={onClose} size={15} />
    </ModalContent>
  );
}

const SuccessMessage = styled(motion.div)`
  color: #bdbdbd; // Green color for success
  font-weight: 500;
  margin: 10px 0;
  font-size: 14px;
`;

const ModalContent = styled.div`
  position: relative;
  background: #3b3b3b;
  margin: auto;
  padding: 8px;
  padding-bottom: 15px;
  border: 1px solid #888;
  width: 300px;
  border-radius: 4px;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2),
    6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: auto;
`;

const Heading = styled.h2`
  padding: 0px;
  margin: 5px;
  font-size: 18px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 50px;

  /* margin-bottom: 10px; */
`;

const Input = styled.input`
  margin: 8px;
  height: 35px;
  width: 200px;
  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding-left: 4px;
`;

const StyledPhoneInput = styled(PhoneInputComponent)`
  margin: 8px;
  height: 35px;
  width: 200px;
  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding-left: 8px;

  // Style the input field itself
  input {
    height: 35px;
    border: none;
    background: transparent;
    color: white; // or any other desired color for text
  }

  // Style the country select dropdown (if you need to)
  .PhoneInputCountrySelect {
    margin: 4px;
    // styles for the country select dropdown
  }

  // You can continue adding styles for other nested elements
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
  font-size: 12px;
  transition: all 0.3s ease;
  height: 38px;
  margin-right: 5px;
`;

const Close = styled(FiX)`
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
`;

const ErrorMessage = styled(motion.span)`
  width: 100%;
  display: flex;
  color: #fc5656;
  font-size: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;
