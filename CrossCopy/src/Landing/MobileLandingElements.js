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

export const HeroContainer = styled(motion.div)`
  width: 100%;
  height: 100vh;
  margin-top: 50px;
  z-index: 1;
  /* border: 1px solid; */
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const NavBar = styled(motion.div)`
  position: fixed;
  display: flex;
  justify-content: space-between;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 3;
  /* border: 1px solid; */
  height: 50px;
  align-items: center;
  padding-left: 10px;

  backdrop-filter: blur(10px); /* You can adjust the value as needed */
`;

export const Button = styled.button`
  padding: 3px 10px;
  box-sizing: border-box;
  border: none;
  background-image: linear-gradient(45deg, #006ee6, #36c3e2); // Added this line
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  transition: all 0.3s ease;
  height: 28px;
  margin-right: 20px;
  color: #ffffff;

  &:hover {
    color: #646cff;
    outline: 1px solid #646cff;
    cursor: pointer;
  }
`;

export const HeadingContainer = styled(motion.div)`
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  padding: 20px;
  /* align-items: center; */
  justify-content: center;
  padding-top: 60px;
`;

export const TagLine = styled(motion.h1)`
  padding: 0px;
  margin: 0px;
  font-size: 30px;
  /* border: 1px solid; */
  color: #ffffff;
  width: 100%;
  margin-bottom: 35px;
`;

export const SubHeading = styled(motion.h2)`
  color: #c2c2c2;
  width: 100%;
  font-family: 'Avenir' !important;

  font-size: 18px;
  font-weight: 600;
  padding: 0px;
  margin: 0px;
  margin-bottom: 15px;

  /* text-align: center; */
`;

export const HeroImages = styled(motion.div)`
  width: 100%;
  height: 420px;
  position: relative;
  margin-bottom: 70px;
  margin-top: 30px;
  @media screen and (min-width: 500px) {
    width: 80%;

    margin-left: 10%;
  }
`;

export const HeroPhone = styled(motion.img)`
  width: 150px;
  height: auto;
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  bottom: 20px;
  left: 15px;

  /* border-radius: 12px; */
`;

export const HeroWeb = styled(motion.img)`
  width: 340px;
  height: auto;
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  top: 0px;
  right: 15px;
  /* border-radius: 12px; */
  @media screen and (min-width: 500px) {
    width: 80%;
  }
`;

export const HeroExtension = styled(motion.img)`
  width: 150px;
  height: auto;
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  bottom: -15px;
  right: 40px;
  /* border-radius: 12px; */
`;

export const HeroExtension2 = styled(motion.img)`
  width: 300px;
  height: auto;
  cursor: pointer;
  flex-shrink: 0;
  position: absolute;
  bottom: -15px;
  right: 40px;
  /* border-radius: 12px; */
`;

export const TextBox = styled.div`
  position: absolute;
  display: flex;
  /* background-color: #51515181; */
  background: -webkit-linear-gradient(45deg, #363537 75%, #3c3b3c 100%);
  font-family: 'Avenir' !important;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border: 1px solid #05f3ff7e;
  padding: 0px 10px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 9px;
  z-index: 1; // to ensure it's on top
  align-items: center;
  justify-content: center;
  height: 20px;
`;

export const CarouselContainer = styled(motion.div)`
  display: flex;
  max-width: 100vw;
  overflow: hidden; /* Add this to clip the images outside the container */
  justify-content: center; /* Center the main image */
  align-items: center;
  padding-top: 0px;
  position: relative;
`;
export const ImageContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(10px); /* You can adjust the value as needed */
  background: #242424;
  cursor: pointer;
  /* flex-shrink: 0; */

  margin-bottom: 38px;
  padding: 21px;
  padding-top: 15px;
  border: 1px solid #66ffff;
  border-radius: 8px;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
`;

export const InfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 280px;
`;

export const InfoHeader = styled.h2`
  font-size: 18px;
  margin: 0px;
`;

export const InfoSubHeader = styled.p`
  font-size: 14px;
  margin: 0px;
  margin-top: 4px;
  margin-bottom: 10px;
`;

export const PhoneImage = styled(motion.img)`
  width: 280px;
  min-height: 473px;
  cursor: pointer;
  /* position: absolute; */
  flex-shrink: 0;

  /* border-radius: 12px; */
`;

export const IndicatorsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; // spacing between indicators
  position: absolute; // position them at the bottom
  bottom: 10px; // space from bottom
  width: 100%;
  /* border: 1px solid; */
`;

export const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%; // make it circular
  border: 1px solid white;
  background-color: ${({ isActive }) => (isActive ? '#646cff' : 'transparent')};
`;

export const RectRight = styled(motion.div)`
  width: 100%;
  height: ${(props) => props.height}vh;
  background-color: ${(props) => props.color};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  clip-path: polygon(
    0 0,
    100% 0,
    ${(props) => props.leftWidth}% ${(props) => props.topWidth}%,
    0% 100%
  );
`;

export const NavigationButton = styled.div`
  top: calc(50% - 20px);
  position: absolute;
  background: #70707074;
  border-radius: 30px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  z-index: 5;

  &.next {
    right: 10px; // Adjust this value as necessary
  }

  &.prev {
    left: 10px; // Adjust this value as necessary
    transform: scaleX(-1); // This will flip the arrow horizontally for prev button
  }
`;
