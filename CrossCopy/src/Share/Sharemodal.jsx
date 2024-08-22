import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { Spinner, spinner } from '../Home/FilesElements';

import { getFunctions, httpsCallable } from 'firebase/functions';
import { motion } from 'framer-motion';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';

import 'react-phone-number-input/style.css';
import PhoneInputComponent from 'react-phone-number-input';

export default function ShareModal({ onClose, url }) {
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [smsSent, setSmsSent] = useState(false);
  const [copy, setCopy] = useState(false);

  const handleShare = () => {
    setLoading(true);

    // Check if the contact is a valid mobile number using regex
    const mobileRegex = /^\+?\d{10,15}$/;
    if (!mobileRegex.test(contact)) {
      setError('Invalid mobile number.');
      setLoading(false);
      return;
    }

    fetch('https://australia-southeast1-crosscopy-72ed9.cloudfunctions.net/send/sendSMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        console.log('SMS sent successfully:', data);
        setSmsSent(true);
      })
      .catch((error) => {
        console.error('Error sending SMS:', error);
        setError('Failed to send SMS. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCopy = () => {
    setCopy(true);

    navigator.clipboard
      .writeText(url)
      .then(() => {
        // console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });

    setTimeout(() => {
      setCopy(false);
    }, 10000);
  };

  return (
    <ModalContent>
      <Heading>Share Files</Heading>
      <LinkingText>Copy this URL to share:</LinkingText>
      <CopyContainer>
        <LinkingButton onClick={handleCopy}>
          <LinkingCode>{url}</LinkingCode>
          {copy ? <ClipboardCheck size={15} /> : <Clipboard size={15} />}
        </LinkingButton>
      </CopyContainer>
      <LinkingText style={{ marginBottom: 5 }}>
        Or enter a mobile number to send files directly:
      </LinkingText>
      {loading ? (
        <InputContainer>
          <Spinner animate={spinner.loop} />
        </InputContainer>
      ) : smsSent ? (
        <InputContainer>
          <FiCheckCircle
            color={'#66ff66'}
            size={18}
            style={{ marginRight: '8px', marginBottom: '2px' }}
          />{' '}
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
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
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

  width: 100%;
  text-align: center;
  border-bottom: 1px solid #636363;
  padding-bottom: 4px;
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

export const LinkingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 95%;
  margin-bottom: 10px;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 1px solid #3f3f3f;
  border-bottom: 1px solid #3f3f3f;

  @media screen and (max-width: 420px) {
    border: none;
  }
`;

export const LinkingButton = styled(motion.button)`
  width: 85%;
  padding: 8px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid #aeaeae;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
  overflow: hidden;
`;

export const LinkingText = styled(motion.span)`
  display: flex;
  color: #c7c7c7;
  font-size: 11px;
  text-align: center;
  /* border: 1px solid; */
  align-items: center;
  justify-content: center;

  /* align-items: ; */
  /* justify-content: flex-end; */
  margin-top: 2px;
  margin-bottom: 2px;
  cursor: pointer;
  width: 90%;
`;

export const LinkingCode = styled(motion.span)`
  font-size: 10px;
  /* letter-spacing: 4px; */
  flex: 1;
  text-align: left;
  /* padding-left: 20px; */
`;

export const Clipboard = styled(BsClipboard2)`
  color: #66ffff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

export const ClipboardCheck = styled(BsClipboard2Check)`
  transition: all 0.2s;

  color: #26ff00;
`;

const CopyContainer = styled(motion.div)`
  width: 90%;
  display: flex;
  align-items: center;
`;
