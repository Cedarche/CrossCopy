import styled, { css, keyframes } from 'styled-components';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

export const Container = styled(motion.div)`
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
  /* min-height: 100%; */
  max-height: 100vh;
  /* border: 1px solid pink; */
  align-items: center;
  overflow: hidden;
  /* justify-content: center; */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const HeadingContainer = styled(motion.div)`
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;
  @media screen and (min-width: 1000px) {
    padding: 0px;
  }
`;

export const Header = styled(motion.h1)`
  color: #66ffff;
  font-size: 50px;
  text-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1);
  margin-bottom: 10px;

  @media screen and (max-width: 420px) {
    font-size: 35px;
  }
  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 30px;
    margin-bottom: 0px;
  }
`;

export const SubHeading = styled(motion.h2)`
  color: #ffffff;
  margin-bottom: 0px;

  text-align: center;

  @media screen and (max-width: 420px) {
    font-size: 20px;
  }
  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 20px;
  }
`;

export const HeroContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex: 1;
  max-height: 75vh;
  margin-bottom: -30px;
  width: 80%;
  overflow: auto;

  z-index: 2;
  /* backdrop-filter: blur(8px); */
  /* border: 1px solid; */
  border-radius: 8px;
  max-width: 1150px;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */

  /* @media screen and (max-height: 1080px) {
    width: 800px;
  } */

  @media screen and (max-width: 1280px) {
    width: 95%;
    max-height: 630px;
  }

  @media screen and (max-width: 750px) {
    padding: 15px;
  }

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    width: 1000px;
  }
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  /* border: 1px solid; */
  margin-top: 8px;
  padding: 0px;
  margin-bottom: -20px;
  z-index: 4;
  align-items: center;
  @media screen and (max-width: 480px) {
    flex-direction: column;
    margin-bottom: 0px;
  }
`;

export const Button = styled.button`
  margin-left: 10px;
  padding: 3px 10px;
  box-sizing: border-box;
  border: none;
  background: #66ffff;
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  transition: all 0.3s ease;
  height: 30px;

  &:hover {
    color: #646cff;
    outline: 1px solid #646cff
    cursor: pointer;
  }


  @media screen and (max-width: 1450px) and (max-height: 800px) {
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
  }

  
`;

export const ButtonText = styled.p`
  font-size: 12px;
  padding: 5px;
  margin: 0px;
`;

export const TriangleLeft = styled(motion.div)`
  width: 0;
  height: 0;
  border-right: 50vw solid transparent;
  border-bottom: ${(props) => props.height}vh solid ${(props) => props.color};
  position: absolute;
  top: ${(props) => props.top}%;
  left: 0;

  @media screen and (max-width: 1200px) {
    /* border-right: 90vw solid transparent; */
  }
`;

export const RectLeft = styled(motion.div)`
  width: 100%;
  height: ${(props) => props.height}vh;
  background-color: ${(props) => props.color};
  position: absolute;
  top: 0;
  left: 0;
  clip-path: polygon(
    0 0,
    ${(props) => props.rightWidth}% 0,
    ${(props) => props.bottomWidth}% 100%,
    0% 100%
  );
`;

export const WebAppImage = styled(motion.img)`
  position: absolute;
  /* transition: all 0.3s ease; */
  opacity: ${(props) => (props.clicked && props.clicked !== 'webapp' ? '0' : '1')};
  visibility: ${(props) => (props.clicked && props.clicked !== 'webapp' ? 'hidden' : 'visible')};
  transition: all 0.5s ease,
    visibility 0s ${(props) => (props.clicked && props.clicked !== 'webapp' ? '0s' : '0s')};

  top: 22px;
  bottom: 0;
  left: 0;
  right: 0;
  width: ${(props) => (props.clicked === 'webapp' ? '1000px' : '950px')};
  height: auto;
  cursor: pointer;
  &:hover {
    scale: 1.002;
    /* z-index: 5; */
  }

  margin: auto;

  @media screen and (max-height: 1080px) {
    width: 850px;
  }

  @media screen and (max-width: 1280px) {
    width: 750px;
  }

  @media screen and (max-width: 780px) {
    width: 650px;
  }

  @media screen and (max-width: 700px) {
    display: none;
  }
  @media screen and (max-width: 1450px) and (max-height: 800px) {
    top: 40px;
    width: 720px;
  }
`;

const phoneAnimation = keyframes`
  from {
    top: 350px;
    left: 0;
    /* width: 225px; */
  }
  to {
    top: 0;
    left: 180px;
    /* width: 260px; */
  }
`;

export const PhoneImage = styled(motion.img)`
  position: absolute;
  opacity: ${(props) => (props.clicked && props.clicked !== 'phone' ? '0' : '1')};
  visibility: ${(props) => (props.clicked && props.clicked !== 'phone' ? 'hidden' : 'visible')};
  transition: all 0.5s ease,
    visibility 0s ${(props) => (props.clicked && props.clicked !== 'webapp' ? '0s' : '0s')};
  bottom: 0;
  height: auto;
  margin: auto;
  cursor: pointer;
  animation: ${(props) => (props.clicked === 'phone' ? phoneAnimation : 'none')} 0.3s ease forwards;
  width: ${(props) => (props.clicked === 'phone' ? '260px' : '225px')};
  height: auto;
  margin: auto;

  cursor: pointer;
  &:hover {
    scale: 1.008;
    z-index: 5;
  }

  @media screen and (max-width: 1000px) {
    width: ${(props) => (props.clicked === 'phone' ? '220px' : '180px')};
    left: ${(props) => (props.clicked === 'phone' ? '80px' : '0')};
  }

  @media screen and (max-width: 700px) {
    width: 260px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    width: ${(props) => (props.clicked === 'phone' ? '200px' : '180px')};
    left: 50px;
    bottom: 0px;
  }

  @media screen and (max-width: 480px) {
    width: 250px;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const extensionAnimation = keyframes`
  from {
    top: 30px;
    right: 0;
    bottom: 400px;
  }
  to {
    top: 0px;
    right: 150px;
    bottom: 0px;
  }
`;

export const ExtensionImage = styled(motion.img)`
  position: absolute;
  opacity: ${(props) => (props.clicked && props.clicked !== 'extension' ? '0' : '1')};
  visibility: ${(props) => (props.clicked && props.clicked !== 'extension' ? 'hidden' : 'visible')};
  transition: all 0.5s ease,
    visibility 0s ${(props) => (props.clicked && props.clicked !== 'webapp' ? '0s' : '0s')};
  height: auto;
  margin: auto;
  cursor: pointer;
  &:hover {
    scale: 1.008;
    z-index: 5;
  }

  ${(props) =>
    props.clicked === 'extension' &&
    css`
      animation: ${extensionAnimation} 0.3s ease forwards;
    `}

  top: ${(props) => (props.clicked === 'extension' ? '0' : '20px')};
  right: ${(props) => (props.clicked === 'extension' ? '150px' : '20px')};
  width: ${(props) => (props.clicked === 'extension' ? '300px' : '225px')};

  @media screen and (max-width: 1200px) {
    width: ${(props) => (props.clicked === 'extension' ? '220px' : '180px')};
    right: ${(props) => (props.clicked === 'extension' ? '100px' : '0')};
    top: 25px;
  }

  @media screen and (max-width: 700px) {
    display: none;
  }

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    width: ${(props) => (props.clicked === 'extension' ? '250px' : '180px')};
    right: 70px;
    top: 20px;
  }
`;

export const TextContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  top: 0;
  bottom: 0;
  max-width: 45%;
  /* border: 1px solid; */
  height: 400px;
  padding: 15px;
  border-radius: 8px;

  // Other styles

  @media screen and (max-width: 1000px) {
    /* border-right: 90vw solid transparent; */
    max-width: 40%;
  }

  @media screen and (max-width: 1280px) and (max-height: 800px) {
    max-width: 40%;
  }
`;

export const InfoText = styled.p`
  font-size: 17px;
  padding: 10px;
  margin: 0px;
  /* border: 1px solid; */
  /* text-align: center; */

  @media screen and (max-width: 1000px) {
    /* border-right: 90vw solid transparent; */
    font-size: 14px;
  }

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 13px;
  }
`;

export const CloseButton = styled.button`
  font-size: 13px;
  margin-right: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 12px;
    height: 35px;
  }
`;

export const TryButton = styled.button`
  font-size: 13px;
  margin-right: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  background: #66ffff;
  color: #242424;
  border-radius: 4px;
  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 12px;
    height: 35px;
  }
`;

export const ChromeButton = styled.button`
  font-size: 13px;
  margin-right: 8px;
  height: 40px;
  display: flex;
  align-items: center;
  background: #7aff66;
  color: #242424;
  width: 290px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border-radius: 4px;
  @media screen and (max-width: 420px) {
    display: none;
  }

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    font-size: 11px;
    max-height: 27px;
  }
`;

export const BottomButtonContainer = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 70px;
  margin: auto;

  @media screen and (max-width: 1450px) and (max-height: 800px) {
    bottom: 20px;
    right: 125px;
  }
`;

export const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 25px;
  height: 25px;
  border-left-color: #66ffff;
  border-radius: 50%;
`;

export const spinner = {
  loop: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};
