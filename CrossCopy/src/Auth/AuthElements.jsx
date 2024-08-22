import { motion, LayoutGroup } from 'framer-motion';
import styled from 'styled-components';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';

export const Container = styled(motion.div)`
  display: flex;
  z-index: 10;

  /* background: #242424; */
  flex-direction: column;
  flex: 1;

  align-items: center;
  justify-content: center;
  overflow: hidden;
  max-width: 100%;
`;

export const SubContainer = styled(motion.div)`
  display: flex;
  /* flex: 1; */
  /* max-height: 440px; */
  padding-bottom: 35px;
  width: 300px;
  border-radius: 4px;
  flex-direction: column;
  align-items: center;
  border: 1px solid;
  overflow: hidden;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
`;

export const Header = styled(motion.h1)`
  color: #66ffff;
  font-size: 35px;
  margin-bottom: 15px;
  margin-top: 45px;
  text-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1);
`;

export const SubHeader = styled(motion.h4)`
  color: white;
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 300;
  margin-bottom: 10px;
  font-style: italic;
`;

export const Input = styled(motion.input)`
  margin: 6px;
  padding: 10px;
  width: 200px;
  background: #404757;
  border: 1px solid lightgrey;
  border-radius: 4px;

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

export const Button = styled(motion.button)`
  margin: 7px;
  padding: 10px;
  width: 220px;
  border-radius: 4px;
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  height: 42px;
  &:disabled {
    color: #414141; // Or any other styling to indicate it's disabled
    cursor: not-allowed;
  }
`;

export const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 14px;
  height: 14px;
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

export const ErrorMessage = styled(motion.span)`
  width: 100%;
  display: flex;
  color: #fc5656;
  font-size: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

export const ForgotMessage = styled(motion.span)`
  width: 200px;
  display: flex;
  color: #878787;
  font-size: 10px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0px;
  margin-bottom: 2px;
  cursor: pointer;
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
  width: 220px;
  padding: 8px;
  display: flex;
  align-items: center;
  border: 1px solid #aeaeae;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const LinkingText = styled(motion.span)`
  display: flex;
  color: #c7c7c7;
  font-size: 13px;
  text-align: center;
  /* border: 1px solid; */
  align-items: center;
  justify-content: center;

  /* align-items: ; */
  /* justify-content: flex-end; */
  margin-top: 2px;
  margin-bottom: 2px;
  cursor: pointer;
  width: 240px;
`;

export const LinkingCode = styled(motion.span)`
  font-size: 16px;
  letter-spacing: 4px;
  flex: 1;
  text-align: center;
  padding-left: 20px;
`;

export const LinkExisting = styled(motion.button)`
  margin: 7px;
  /* padding: 10px; */
  color: #66ffff;
  width: 170px;
  border-radius: 4px;
  background: #545353;
  /* box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1); */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  /* height: 42px; */
`;

export const ShareLink = styled(motion.button)`
  /* margin: 7px; */
  /* padding: 10px; */
  color: #75a9df;
  width: 90px;
  border-radius: 8px;
  /* background: #050505; */
  /* box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1); */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-bottom: 7px;

  /* height: 42px; */
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

export const LinkInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 260px; // Adjust based on your needs (8 boxes * 30px width + 7 gaps * 5px)
  border: 1px solid black;
  background-color: transparent;
  position: relative;
`;

export const LinkInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  letter-spacing: 28px;
  padding-left: 15px; // Adjust to center the first number
  font-size: 20px;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  text-align: center;

  &::placeholder {
    color: transparent;
  }
`;

export const Box = styled.input`
  height: 30px;
  min-width: 20px;
  border: 1px solid #929292;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  margin-right: 5px;
  margin-top: 8px;
  margin-bottom: 5px;

  &:last-child {
    margin-right: 0;
  }
`;
