import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  styled as style,
} from '@mui/material';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import axios from 'axios';
import { auth, Signout, database } from '../firebase';
import { ref, update, onValue } from 'firebase/database';
import { Clipboard, ClipboardCheck } from '../Auth/AuthElements';
import { useNavigate } from 'react-router-dom';
import {
  Input,
  Button as SignupButton,
  ErrorMessage,
  Spinner,
  spinner,
} from '../Auth/AuthElements';

const API_URL = import.meta.env.VITE_API_URL;

const SubContainer = styled(motion.div)`
  min-height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  /* padding: 8px; */
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 15px;
  padding-right: 18px;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* margin-bottom: 20px; */
  padding: 10px 0px;

  border-bottom: 1px solid #6b6b6b;
  font-size: 12px;
  min-height: 30px;
`;

const ItemLabel = styled.label`
  padding-left: 10px;
  color: #c7c7c7;
`;

const SignoutButtonContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 10px;
  justify-content: flex-end;
`;
const SignoutButton = styled.button`
  margin-right: 10px;
  padding: 5px 15px;
  font-size: 12px;
  background-color: #006ee6;
  color: #fff;
`;

export default function Settings() {
  // const [listenForCopy, setListenForCopy] = useState(null);
  const [rememberPasteHistory, setRememberPasteHistory] = useState(true);
  const [autoDeleteFiles, setAutoDeleteFiles] = useState('');
  const [userData, setUserData] = useState(null);
  const [copy, setCopy] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;
  const navigate = useNavigate();

  const userSettingsRef = ref(database, 'users/' + user.uid);

  useEffect(() => {
    if (user) {
      onValue(userSettingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserData(data);
          setRememberPasteHistory(data.saveHistory);
          setAutoDeleteFiles(data.deleteFilesAfter);
        }
      });
    }
  }, [user]);

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cant be undone.')) {
      if (user) {
        axios
          .delete(`${API_URL}/user/${user.uid}`)
          .then(() => {
            console.log('Account deleted successfully');
          })
          .catch((error) => {
            // console.error('Failed to delete account:', error);
          });
      }
    }
  };

  const handleToggleRememberPasteHistory = (event) => {
    if (user) {
      const newRememberPasteHistory = event.target.checked;
      setRememberPasteHistory(newRememberPasteHistory);
      update(userSettingsRef, { saveHistory: newRememberPasteHistory });
    }
  };

  const handleSelectAutoDeleteFiles = (event) => {
    if (user) {
      const newAutoDeleteFiles = event.target.value;
      setAutoDeleteFiles(newAutoDeleteFiles);
      update(userSettingsRef, { deleteFilesAfter: newAutoDeleteFiles });
    }
  };

    // const handleToggleListenForCopy = (event) => {
  //   if (user) {
  //     const newListenForCopy = event.target.checked;
  //     setListenForCopy(newListenForCopy);

  //     axios.post(`${API_URL}/user/settings/${user.uid}`, { autoCopy: newListenForCopy });
  //   }
  // };

  const handleSignup = async () => {
    try {
      setLoading(true);

      if (!user) {
        setLoading(false);
        // console.error('User is not authenticated');
        return;
      }

      // Create a credential from the user's current email and password
      const currentCredential = EmailAuthProvider.credential(
        user.email, // Current email of the user
        user.uid // Current password of the user
      );

      // Reauthenticate the user

      reauthenticateWithCredential(user, currentCredential)
        .then(async () => {
          // User re-authenticated.
          await updateEmail(user, email);
          await updatePassword(user, password);

          // Update the user's email in the Realtime Database
          const userRef = ref(database, 'users/' + user.uid);
          await update(userRef, {
            email: email,
          });

          setLoading(false);
          // console.log('Successfully updated email and password');
        })
        .catch((error) => {
          // An error ocurred
          setLoading(false);
          setError('Something went wrong... ');
          // console.log(error);
          // ...
        });

      // After reauthentication, update the email and password
    } catch (error) {
      setLoading(false);
      setError('Something went wrong... ');
      // console.error('Error updating email and password:', error);
    }
  };

  const handleSignout = () => {
    if (user.email.endsWith('@crosscopy.dev') && user.linkingCode) {
      const message = `Are you sure you want to Sign Out? If you sign out while anonymous, you'll have to re-link any connected devices.
      `;
      Signout(message);
    } else {
      Signout('Are you sure you want to Sign Out?');
    }
  };

  const handleCopy = () => {
    setCopy(true);

    navigator.clipboard
      .writeText(userData.linkingCode)
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
    <Container
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {userData && (
        <SubContainer
          key="settings2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {user.email && !user.email.endsWith('@crosscopy.dev') && (
            <ItemWrapper layout>
              <ItemLabel style={{ color: '#fff', fontSize: '12px', fontWeight: '500' }}>
                {user.email}
              </ItemLabel>
            </ItemWrapper>
          )}

          {user.email.endsWith('@crosscopy.dev') && createAccount && (
            <ItemWrapper
              layout
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ItemLabel
                onClick={() => setCreateAccount(!createAccount)}
                style={{ color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
              >
                Create Account
              </ItemLabel>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {' '}
                <Input
                  layout
                  style={{ maxHeight: '35px', marginTop: '10px', marginBottom: '0px' }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <Input
                  style={{ maxHeight: '35px' }}
                  layout
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <SignupButton
                  onClick={handleSignup}
                  style={{ fontSize: '12px', height: '35px', marginTop: '3px' }}
                >
                  {loading ? <Spinner animate={spinner.loop} /> : 'Sign Up'}
                </SignupButton>
                {error.length > 0 && <ErrorMessage layout>{error}</ErrorMessage>}
                {/* <SignupButton
              onClick={() => setCreateAccount(false)}
              style={{ fontSize: '12px', height: '35px', marginTop: '5px' }}
            >
              Cancel
            </SignupButton> */}
              </div>
            </ItemWrapper>
          )}
          {user.email.endsWith('@crosscopy.dev') && (
            <ItemWrapper layout>
              <div>
                <ItemLabel>Linking code:</ItemLabel>
                <ItemLabel
                  style={{
                    color: '#006ee6',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    fontWeight: '600',
                  }}
                >
                  {userData.linkingCode}
                </ItemLabel>
              </div>
              {copy ? (
                <ClipboardCheck size={15} style={{ marginRight: '5px' }} />
              ) : (
                <Clipboard
                  onClick={handleCopy}
                  size={15}
                  style={{ marginRight: '5px', color: '#006ee6' }}
                />
              )}
            </ItemWrapper>
          )}

          <ItemWrapper layout>
            <ItemLabel>Remember paste history:</ItemLabel>
            <Switch
              checked={rememberPasteHistory}
              onChange={handleToggleRememberPasteHistory}
              name="Remember paste history"
              color="primary"
              size="small"
              sx={{ marginRight: '5px' }}
            />
          </ItemWrapper>

          <ItemWrapper layout>
            <ItemLabel>Automatically delete files after:</ItemLabel>
            <FormControl>
              <Select
                value={autoDeleteFiles}
                onChange={handleSelectAutoDeleteFiles}
                size="small"
                sx={{ fontSize: '12px', color: 'white', marginRight: '5px' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: '#727272', // Change to your desired dropdown background color
                    },
                  },
                }}
              >
                <MenuItem
                  value={'1hr'}
                  size="small"
                  sx={{
                    fontSize: '12px',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#5b5b5b', color: 'white' },
                    '&:focus': { backgroundColor: '#8086ff', color: 'white' },
                  }}
                >
                  1 Hour
                </MenuItem>
                <MenuItem
                  value={'24hrs'}
                  sx={{
                    fontSize: '12px',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#5b5b5b', color: 'white' },
                    '&:focus': { backgroundColor: '#8086ff', color: 'white' },
                  }}
                >
                  24 Hours
                </MenuItem>
                <MenuItem
                  value={'7days'}
                  sx={{
                    fontSize: '12px',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#5b5b5b', color: 'white' },
                    '&:focus': { backgroundColor: '#8086ff', color: 'white' },
                  }}
                >
                  7 Days
                </MenuItem>
                {/* <MenuItem
                value={'never'}
                sx={{
                  fontSize: '12px',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#5b5b5b', color: 'white' },
                  '&:focus': { backgroundColor: '#8086ff', color: 'white' },
                }}
              >
                Never
              </MenuItem> */}
              </Select>
            </FormControl>
          </ItemWrapper>

          <SignoutButtonContainer layout>
            {user.email.endsWith('@crosscopy.dev') && (
              <SignoutButton onClick={() => setCreateAccount(!createAccount)}>
                {createAccount ? 'Cancel' : ' Create Account'}
              </SignoutButton>
            )}

            <SignoutButton onClick={handleSignout}>Signout</SignoutButton>
          </SignoutButtonContainer>

          <BottomContainer>
            <StyledButton onClick={handleDeleteAccount}>Delete Account</StyledButton>
            <StyledButton onClick={() => navigate('/privacy')}>Privacy Policy</StyledButton>
            <StyledButton onClick={() => navigate('/contact')}>Contact Us</StyledButton>
          </BottomContainer>
          {/* <StyledButton onClick={handleDeleteAccount}>Privacy Policy</StyledButton> */}
        </SubContainer>
      )}
    </Container>
  );
}

const Container = styled(motion.div)`
  display: flex;
  flex: 1;
  /* max-height: 400px; */
  width: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-bottom: 0px;
`;

const BottomContainer = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  bottom: 3px;
  width: 100%;
  border: 1px solid #4d4d4d;
`;

const StyledButton = style(Button)({
  //   position: 'absolute',
  display: 'flex',
  //   flex: 1,
  alignItems: 'center',

  justifyContent: 'center',

  color: 'white',
  fontSize: '8px',
  '&:hover': {
    backgroundColor: '#727272',
  },
});
