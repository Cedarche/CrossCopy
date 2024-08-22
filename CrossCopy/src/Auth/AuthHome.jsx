import { motion, LayoutGroup } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  database,
  ref,
  set,
  resetPassword,
  trackButtonClick,
} from '../firebase';
import {
  Container,
  SubContainer,
  Header,
  SubHeader,
  Input,
  Button,
  Spinner,
  spinner,
  ErrorMessage,
  ForgotMessage,
} from './AuthElements';
import { AnonymousSignUp } from './Components/Anonymous';
import { updateEmail, updatePassword } from 'firebase/auth';

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  sLoading,
  handleLogin,
  handleCancel,
  forgotMessage,
  forgotPassword,
  sendReset,
}) => {
  return (
    <>
      <Input
        layout
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ marginTop: '15px' }}
      />
      <Input
        layout
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {forgotPassword && (
        <ForgotMessage
          layout
          onClick={() => {
            sendReset();
          }}
        >
          {forgotMessage}
        </ForgotMessage>
      )}
      <Button layout onClick={handleLogin} disabled={loading || sLoading}>
        {loading ? <Spinner animate={spinner.loop} /> : 'Login'}
      </Button>
      <Button style={{ background: '#29121283', color: '#c4c4c4' }} layout onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};

const CreateAccount = ({
  email,
  setEmail,
  password,
  setPassword,
  checkPassword,
  setCheckPassword,
  sLoading,
  handleSignUp,
  handleCancel,
}) => {
  return (
    <>
      <Input
        layout
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ marginTop: '15px' }}
      />
      <Input
        layout
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Input
        layout
        type="password"
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        placeholder="Re-enter Password"
      />
      <Button layout onClick={handleSignUp} disabled={sLoading}>
        {sLoading ? <Spinner animate={spinner.loop} /> : 'Sign Up'}
      </Button>
      <Button style={{ background: '#29121283', color: '#c4c4c4' }} layout onClick={handleCancel}>
        Cancel
      </Button>
    </>
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sLoading, setSLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMessage] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('Forgot password? Send reset email.');
  const [view, setView] = useState(''); // 'anonymous', 'login', 'createAccount'

  const { linkingCode } = useParams();

  useEffect(() => {
    if (linkingCode) {
      // Search the Realtime Database for the user with the matching linkingCode
      const dbRef = ref(database, 'users');
      const queryRef = query(dbRef, orderByChild('linkingCode'), equalTo(linkingCode));

      onValue(queryRef, (snapshot) => {
        if (snapshot.exists()) {
          const userUID = Object.keys(snapshot.val())[0]; // Get the UID of the user
          const userData = snapshot.val()[userUID]; // Get the user data

          if (userData.email && userData.email.endsWith('@crosscopy.dev')) {
            // Construct the pseudo-email and password using the UID
            const pseudoEmail = `${userUID}@crosscopy.dev`;
            const pseudoPassword = userUID;

            // Use signInWithEmailAndPassword to log in
            signInWithEmailAndPassword(auth, pseudoEmail, pseudoPassword)
              .then((userCredential) => {
                // Successfully logged in
                console.log('Logged in with linkingCode:', userCredential.user);
              })
              .catch((error) => {
                console.error('Error logging in with linkingCode:', error);
              });
          } else if (userData.email) {
            // Set the email state to the email address in the database
            setEmail(userData.email);
          } else {
            console.error('No email found for the user with the provided linkingCode');
          }
        } else {
          console.error('No user found with the provided linkingCode');
        }
      });
    }
  }, [linkingCode]);

  function errorSwitch(err) {
    switch (err) {
      case 'auth/wrong-password':
        console.log('Incorrect email or password');
        return setErrorMessage('Incorrect Email or Password');
      case 'auth/email-already-in-use':
        console.log('Email already in use');
        return setErrorMessage('Email already in use');
      default:
        console.log('An error occurred');
        return setErrorMessage('An error occurred');
    }
  }

  const handleLogin = () => {
    setLoading(true);
    setError(false);
    setForgotPassword(false);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        trackButtonClick('loginButton');
        setLoading(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setForgotPassword(true);
        // console.log(errorMessage);

        setLoading(false);
        setError(true);
        errorSwitch(String(errorCode));
        // ..
      });
  };

  const handleSignUp = () => {
    setSLoading(true);
    setError(false);
    if (password !== checkPassword) {
      setError(true);
      setErrorMessage('Passwords dont match');
      setSLoading(false);
      return;
    }
    const linkingCode = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 7-digit number

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        trackButtonClick('signUpButton');
        // console.log(user);

        // Get a reference to the database service
        const db = database;
        set(ref(db, 'users/' + user.uid), {
          email: user.email,
          autoCopy: false,
          saveHistory: true,
          deleteFilesAfter: '7days',
          paidUser: false,
          text: 'Welcome to Cross Copy - Type or paste here',
          linkingCode: linkingCode,
          // Add any other user properties you want to store
        })
          .then(() => {
            console.log('User data stored in the database');
            setSLoading(false);
          })
          .catch((error) => {
            // console.error('Failed to store user data:', error);
            setSLoading(false);
            setError(true);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        setSLoading(false);
        setError(true);
        errorSwitch(String(errorCode));
      });
  };

  function sendReset() {
    if (email) {
      resetPassword(email).then((result) => {
        if (result) {
          setForgotMessage('Password reset email sent!');
          setPassword('');
          setTimeout(() => {
            setForgotPassword(false);
          }, 10000);
        } else {
          console.log('Email was not sent');
          setErrorMessage('Email was not valid...');
          setError(true);
        }
      });
    }
  }

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setView('');
    setError(false);
    setErrorMessage('');
    setLoading(false);
    setForgotPassword(false);
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SubContainer>
        <LayoutGroup>
          <Header layout>CROSS COPY</Header>
          <SubHeader layout>Simple cross-platform media transfers</SubHeader>
          {view === 'anonymous' && <AnonymousSignUp handleCancel={handleCancel} />}
          {view === 'login' && (
            <Login
              handleLogin={handleLogin}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              sLoading={sLoading}
              handleCancel={handleCancel}
              forgotMessage={forgotMessage}
              setForgotPassword={setForgotPassword}
              forgotPassword={forgotPassword}
              sendReset={sendReset}
            />
          )}
          {view === 'createAccount' && (
            <CreateAccount
              handleSignUp={handleSignUp}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              checkPassword={checkPassword}
              setCheckPassword={setCheckPassword}
              sLoading={sLoading}
              handleCancel={handleCancel}
            />
          )}
          {view === '' && (
            <>
              <Button layout onClick={() => setView('login')}>
                Login
              </Button>
              <Button
                layout
                onClick={() => {
                  trackButtonClick('createAccount'), setView('createAccount');
                }}
              >
                Create Account
              </Button>
              <Button
                layout
                onClick={() => {
                  trackButtonClick('continueWithoutAccount'), setView('anonymous');
                }}
              >
                Continue without account
              </Button>
            </>
          )}
          {error && <ErrorMessage layout>{errorMsg} </ErrorMessage>}
        </LayoutGroup>
      </SubContainer>
    </Container>
  );
}
