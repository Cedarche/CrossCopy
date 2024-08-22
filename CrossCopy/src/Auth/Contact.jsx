import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../Home/HomeElements';
import { FiSend, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spinner, spinner } from './AuthElements';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    // This is a simple regex for email validation. It checks for the general pattern of emails.
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (email.length > 0 && message.length > 0 && isValidEmail(email)) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/send-email`, {
          email,
          message,
        });

        if (response.data && response.status === 200) {
          setLoading(false);
          setIsSent(true);

          setEmail('');
          setMessage('');
        } else {
          setLoading(false);
          setError('Failed to send message. Please try again.');
          // alert('Failed to send message. Please try again.');
        }
      } catch (error) {
        setLoading(false);
        console.error('Error sending message:', error);
        setError('An error occurred. Please try again later.');
      }
    } else {
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
      } else {
        setError('Please add a message.');
      }
    }
  };

  return (
    <Container>
      <SubContainer>
        <Header>CROSS COPY</Header>
        <ContactContainer>
          <TitleContainer>
            <Title>Get in touch</Title>
            <Subtitle>Let us know if you have any issues or improvements</Subtitle>
          </TitleContainer>

          <AnimatePresence mode="wait">
            {isSent ? (
              <InputContainer
                style={{ alignItems: 'center', justifyContent: 'center' }}
                key="sent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FiCheckCircle style={{ color: '#09ff00', marginBottom: '10px' }} size={35} />
                Thank you for your feedback.
              </InputContainer>
            ) : (
              <InputContainer
                key="notSent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  onClick={() => {
                    setError('');
                  }}
                />
                <Textarea
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onClick={() => {
                    setError('');
                  }}
                />
                {error.length > 0 && (
                  <ErrorContainer>
                    <Error>{error}</Error>
                  </ErrorContainer>
                )}
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <Spinner animate={spinner.loop} style={{ borderLeftColor: '#006ee6' }} />
                  ) : (
                    <>
                      <FiSend style={{ marginRight: '5px' }} />
                      Send
                    </>
                  )}
                </Button>
              </InputContainer>
            )}
          </AnimatePresence>
        </ContactContainer>
      </SubContainer>
      <BottomContainer>
        <CloseButton
          onClick={() => {
            navigate('/');
          }}
        >
          <FiArrowLeft style={{ marginRight: '5px', marginBottom: '2px' }} />
          Go Back
        </CloseButton>
      </BottomContainer>
    </Container>
  );
}

export const Container = styled.div`
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
  width: 100%;
  max-height: 100%;
  align-items: center;
  /* justify-content: center; */
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1150px;
  align-items: center;
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 500px;
  border: 1px solid grey;
  border-radius: 8px;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
  min-height: 500px;

  @media screen and (max-width: 480px) {
    min-width: 90%;
    max-width: 90%;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  /* width: 100%; */
  border-bottom: 1px solid #515151;
  padding: 0px 15px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-top: 15px;
  margin-bottom: 5px;
  font-size: 22px;
`;

const Subtitle = styled.p`
  margin-top: 0px;
  font-size: 14px;
`;

const InputContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  flex: 1;
  flex-direction: column;
`;

const Input = styled.input`
  margin: 15px;
  padding: 12px;
  /* width: 100%; */
  margin-bottom: 10px;
  font-size: 13px;

  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-sizing: border-box;

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #a3a3a3; /* Placeholder color */
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #a3a3a3; /* Placeholder color */
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #a3a3a3; /* Placeholder color */
  }
`;

const Textarea = styled.textarea`
  margin: 15px;
  margin-top: 0px;
  padding: 13px;
  display: flex;
  flex: 1;
  margin-bottom: 10px;
  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 12px;
  font-family: 'Poppins';

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #a3a3a3; /* Placeholder color */
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #a3a3a3; /* Placeholder color */
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #a3a3a3; /* Placeholder color */
  }
`;

export const Button = styled.button`
margin: 15px;
margin-top: 0px;
display: flex;
  padding: 3px 10px;
  box-sizing: border-box;
  border: none;
  background: #66ffff;
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 14px;
  transition: all 0.3s ease;
  height: 35px;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #646cff;
    outline: 1px solid #646cff
    cursor: pointer;
  }


  /* @media screen and (max-width: 1450px) and (max-height: 700px) {
    font-size: 11px;
    max-height: 27px;
    margin-bottom: 0px;
  }

  @media screen and (max-width: 480px) {
    margin-bottom: 0px;
    margin-left: 0px;
    font-size: 15px;
    min-height: 35px;
    padding: 5px 10px;
  } */

  
`;

const BottomContainer = styled.div`
  min-width: 500px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media screen and (max-width: 480px) {
    min-width: 95%;
  }
`;

const CloseButton = styled.button`
  margin-top: 10px;
  font-size: 12px;
  height: 35px;
  display: flex;
  align-items: center;
  border-radius: 4px;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

const Error = styled.span`
  color: #f75f00;
  font-size: 13px;
`;
