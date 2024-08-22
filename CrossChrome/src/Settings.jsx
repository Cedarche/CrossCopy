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
import axios from 'axios';
import { auth, Signout } from '../firebase';
import { API_URL } from './URL';

const SubContainer = styled(motion.div)`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  /* padding: 8px; */
  margin-left: 8px;
  margin-right: 8px;
  padding-left: 10px;
  padding-right: 15px;
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
`;

const ItemLabel = styled.label`
  padding-left: 10px;
  color: #c7c7c7;
`;

export default function Settings() {
  const [listenForCopy, setListenForCopy] = useState(null);
  const [rememberPasteHistory, setRememberPasteHistory] = useState(true);
  const [autoDeleteFiles, setAutoDeleteFiles] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_URL}/user/settings/${user.uid}`)
        .then((response) => {
          const { autoCopy, saveHistory, deleteFilesAfter } = response.data;
          setListenForCopy(autoCopy);
          setRememberPasteHistory(saveHistory);
          setAutoDeleteFiles(deleteFilesAfter);
        })
        .catch((error) => {
          console.error('Failed to fetch settings:', error);
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
            console.error('Failed to delete account:', error);
          });
      }
    }
  };

  const handleToggleListenForCopy = (event) => {
    if (user) {
      const newListenForCopy = event.target.checked;
      setListenForCopy(newListenForCopy);
      //   if (chrome && chrome.runtime) {
      //     chrome.runtime.sendMessage({
      //       type: 'login',
      //       listenForCopy: newListenForCopy,
      //     });
      //   }
      axios.post(`${API_URL}/user/settings/${user.uid}`, { autoCopy: newListenForCopy });
    }
  };

  const handleToggleRememberPasteHistory = (event) => {
    if (user) {
      const newRememberPasteHistory = event.target.checked;
      setRememberPasteHistory(newRememberPasteHistory);
      axios.post(`${API_URL}/user/settings/${user.uid}`, { saveHistory: newRememberPasteHistory });
    }
  };

  const handleSelectAutoDeleteFiles = (event) => {
    if (user) {
      const newAutoDeleteFiles = event.target.value;
      setAutoDeleteFiles(newAutoDeleteFiles);
      axios.post(`${API_URL}/user/settings/${user.uid}`, { deleteFilesAfter: newAutoDeleteFiles });
    }
  };

  const navigate = () => {
    chrome.tabs.create({ url: `https://crosscopy.dev/privacy` });
  };

  return (
    <Container
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {listenForCopy !== null && (
        <SubContainer
          key="settings2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* <ItemWrapper>
            <ItemLabel>Listen for copy:</ItemLabel>
            <Switch
              checked={listenForCopy}
              onChange={handleToggleListenForCopy}
              name="Listen for copy"
              color="primary"
              size="small"
              sx={{ marginRight: '5px' }}
            />
          </ItemWrapper> */}

          <ItemWrapper>
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

          <ItemWrapper>
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
                <MenuItem
                  value={'never'}
                  sx={{
                    fontSize: '12px',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#5b5b5b', color: 'white' },
                    '&:focus': { backgroundColor: '#8086ff', color: 'white' },
                  }}
                >
                  Never
                </MenuItem>
              </Select>
            </FormControl>
          </ItemWrapper>
          <SignoutButtonContainer>
            <SignoutButton onClick={() => Signout()}>Signout</SignoutButton>
          </SignoutButtonContainer>

          <BottomContainer>
            <StyledButton onClick={handleDeleteAccount}>Delete Account</StyledButton>
            <StyledButton onClick={navigate}>Privacy Policy</StyledButton>
          </BottomContainer>
        </SubContainer>
      )}
    </Container>
  );
}

const Container = styled(motion.div)`
  display: flex;
  flex: 1;
  max-height: 400px;
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
  padding: 2px;
  border: 1px solid #4d4d4d;
`;

const StyledButton = style(Button)({
  display: 'flex',

  alignItems: 'center',

  justifyContent: 'center',

  color: 'white',
  fontSize: '8px',
  '&:hover': {
    backgroundColor: '#727272',
  },
});

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
  font-size: 11px;
  background-color: #006ee6;
`;
