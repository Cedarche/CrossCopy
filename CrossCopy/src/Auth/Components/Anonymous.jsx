import React, { useState, useEffect } from 'react';

import { FiShare } from 'react-icons/fi';
import {
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  linkWithCredential,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { onValue, query, orderByChild, equalTo } from 'firebase/database'; // Import the functions for Realtime Database

import {
  auth,
  signInAnonymously,
  database,
  ref,
  set,
  trackButtonClick,
  trackViews,
} from '../../firebase';
import {
  Button,
  Spinner,
  spinner,
  LinkingContainer,
  LinkingButton,
  LinkingText,
  LinkingCode,
  LinkExisting,
  ShareLink,
  Clipboard,
  ClipboardCheck,
  Box,
  ErrorMessage,
} from '../AuthElements';
import OtpInput from 'react-otp-input';
import { Modal } from '../../Home/FilesElements';
import ShareCodeModal from './ShareCode';

export const AnonymousSignUp = ({ handleCancel }) => {
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkingCode, setLinkingCode] = useState(null);
  const [copy, setCopy] = useState(false);
  const [otp, setOtp] = useState('');
  const [linkExisting, setLinkExisting] = useState(false);
  const [mobile, setMobile] = useState(null); // Add a device state
  const [showModal, setShowModal] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    trackViews('anonymousSignUp');
    const checkDevice = () => {
      if (window.innerWidth <= 900) {
        setMobile(true);
      } else {
        setMobile(false);
      }
      setLoading(false); // Set loading to false after mobile is set
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const generateLinkingCode = () => {
      return Math.floor(1000000 + Math.random() * 9000000); // Generates a random 8-digit number
    };

    setLinkingCode(generateLinkingCode());
  }, []);

  const handleLinkAccount = () => {
    if (otp) {
      // Search the Realtime Database in the 'anonymousUsers' node for the matching linkingCode
      const dbRef = ref(database, 'anonymousUsers');
      const queryRef = query(dbRef, orderByChild('linkingCode'), equalTo(Number(otp)));
      setLoading(true);

      onValue(
        queryRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const userUID = Object.keys(snapshot.val())[0]; // Get the UID of the user
            console.log(userUID);

            // Construct the pseudo-email and password using the UID
            const pseudoEmail = `${userUID}@crosscopy.dev`;
            const pseudoPassword = userUID;

            // Use signInWithEmailAndPassword to log in
            signInWithEmailAndPassword(auth, pseudoEmail, pseudoPassword)
              .then((userCredential) => {
                // Successfully logged in
                setLoading(false);
                console.log('Logged in with linkingCode:', userCredential.user);
              })
              .catch((error) => {
                setLoading(false);
                setError('Something went wrong, please try again.');
                console.log(error);
                setTimeout(() => {
                  handleCancel();
                }, 2000);

                console.error('Error logging in with linkingCode:', error);
              });
          } else {
            setLoading(false);
            setError('Invalid linking code.');
            console.error('No user found with the provided linkingCode');
          }
        },
        (error) => {
          setLoading(false);
          setError('Something went wrong, please try again.');
            console.error('Error querying the database:', error);
        }
      );
    }
  };

  const handleAnonymousSignUp = () => {
    setLoading(true);

    if (!linkingCode) {
      return;
    }

    signInAnonymously(auth)
      .then(async (userCredential) => {
        const user = userCredential.user;
        trackButtonClick('anonymousButton');

        const pseudoEmail = `${user.uid}@crosscopy.dev`;
        const pseudoPassword = user.uid;
        console.log('Pseudo Email: ', pseudoEmail)
        console.log('Pseudo password: ', pseudoPassword)

        // Create a credential for email/password
        const credential = EmailAuthProvider.credential(pseudoEmail, pseudoPassword);

        // Link the anonymous account with the email/password credential
        await linkWithCredential(user, credential);

        // Store user data in the 'users' node
        await set(ref(database, 'users/' + user.uid), {
          email: pseudoEmail,
          autoCopy: false,
          saveHistory: true,
          deleteFilesAfter: '7days',
          paidUser: false,
          text: 'Welcome to Cross Copy - Type or paste here',
          linkingCode: linkingCode,
        });

        // Store the linking code in the 'anonymousUsers' node
        return set(ref(database, 'anonymousUsers/' + user.uid), {
          linkingCode: linkingCode,
        });
      })
      .then(() => {
        setLoading(false);
        // console.log('Anonymous user data stored in the database');
      })
      .catch((error) => {
        // console.error('Error during anonymous sign-up:', error);
        setError('Something went wrong, please try again.');
        setLoading(false);
      });
  };

  const handleCopy = () => {
    setCopy(true);

    navigator.clipboard
      .writeText(linkingCode)
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

  const handleShareClick = async (e) => {
    e.preventDefault();

    try {
      const shareData = {
        title: 'Link Device',
        text: 'Link new device',
        url: `https://crosscopy.dev/login/${linkingCode}`,
      };
      setFileURL(shareData.url);

      if (navigator.share) {
        navigator
          .share({
            title: shareData.title,
            text: shareData.text,
            url: shareData.url,
          })
          .then(() => {
            console.log('Successful share');
          })
          .catch((error) => {
            console.log('Error sharing', error);
          });
      } else {
        console.log(linkingCode);
        setShowModal(true); // Ensure this is set after fileURL is set
      }
    } catch (error) {
      console.error('Something went wrong sharing', error);
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <ShareCodeModal onClose={() => setShowModal(false)} url={fileURL} />
        </Modal>
      )}
      <LinkingContainer
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {linkExisting ? (
          <>
            {' '}
            <LinkingText>Enter existing linking code: </LinkingText>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={7}
              renderSeparator={<span></span>}
              renderInput={(props) => <Box {...props} />}
              inputType={'tel'} // Ensure only numbers are entered
            />
            <LinkingText></LinkingText>
            <LinkExisting layout onClick={() => setLinkExisting(false)}>
              Cancel
            </LinkExisting>
          </>
        ) : (
          <>
            {' '}
            <LinkingText>Use this code to link other devices: </LinkingText>
            <LinkingButton onClick={handleCopy}>
              <LinkingCode>{linkingCode}</LinkingCode>
              {copy ? <ClipboardCheck size={15} /> : <Clipboard size={15} />}
            </LinkingButton>
            <ShareLink onClick={handleShareClick}>
              Send link <FiShare style={{ marginLeft: '8px', color: '#75a9df' }} />
            </ShareLink>
            <LinkingText style={{ fontSize: '12px' }}>
              If you sign out while anonymous, you'll have to re-link any connected devices.
              <br />
            </LinkingText>
            <LinkingText style={{ fontSize: '12px', color: '#ffff' }}>
              You can find it again in Settings.
            </LinkingText>
            <LinkExisting layout onClick={() => setLinkExisting(true)} disabled={linkLoading}>
              {linkLoading ? <Spinner animate={spinner.loop} /> : 'Link Existing Account'}
            </LinkExisting>
          </>
        )}
      </LinkingContainer>
      {error.length > 0 && <ErrorMessage layout>{error}</ErrorMessage>}

      {linkExisting ? (
        <Button layout disabled={otp.length !== 7} onClick={handleLinkAccount}>
          {loading ? <Spinner animate={spinner.loop} /> : 'Link Account'}
        </Button>
      ) : (
        <Button layout disabled={loading} onClick={handleAnonymousSignUp}>
          {loading ? <Spinner animate={spinner.loop} /> : 'Continue to Home'}
        </Button>
      )}

      <Button style={{ background: '#29121283', color: '#dcdcdc' }} layout onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};
