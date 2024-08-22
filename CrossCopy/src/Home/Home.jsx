import React, { useState, useEffect, useRef } from "react";

import "react-quill/dist/quill.snow.css"; // import the styles
import FileDropzone from "./Files";
import { Signout } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Container,
  SubContainer,
  TextSide,
  FileSide,
  Heading,
  Button,
  Header,
  BottomContainer,
  BottomButton,
} from "./HomeElements";
import TextSection from "./TextSection"; // import the new QuillEditor component
import MobileHomePage from "./MobileHome";
import { AiFillChrome } from "react-icons/ai";
import { RectLeft } from "../Landing/LandingElements";

import { useFetchData } from "../Hooks/useFetchData";

// const MemoizedFileDropzone = React.memo(FileDropzone);

function HomePage() {
  const [mobile, setMobile] = useState(null); // Add a device state
  const [loading, setLoading] = useState(true); // Add a loading state


  const navigate = useNavigate();
  const {
    userData,
    files,
    history,
    paidUser,
    setFiles,
    setHistory,
    refetchUserData,
    refetchFiles,
    refetchHistory,
  } = useFetchData();

  const rectData = Array.from({ length: 9 }, (_, i) => ({
    rightWidth: (mobile ? 35 : 55) - i * 10,
    bottomWidth: (mobile ? 110 : 75) - i * 10, // Set to 100 if mobile, else 75, then subtract i * 10
    height: 100,
    color: interpolateColor("#24242411", "#00ffff11", i / 8),
  }));

  useEffect(() => {
    const checkDevice = () => {
      if (window.innerWidth <= 1200) {
        setMobile(true);
      } else {
        setMobile(false);
      }
      setLoading(false); // Set loading to false after mobile is set
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (loading) {
    return <div></div>; // Render a loading message while loading
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header>CROSS COPY</Header>
      {!mobile ? (
        <>
          <SubContainer key="Sub1">
            <TextSide key="TextSide">
              <TextSection
                mobile={mobile}
                history={history}
                setHistory={setHistory}
              />
            </TextSide>
            <FileSide key="FileSide">
              <FileDropzone
                mobile={mobile}
                files={files}
                setFiles={setFiles}
                paidUser={paidUser}
              />{" "}
            </FileSide>
          </SubContainer>
          <BottomContainer style={{ height: "60px", zIndex: 1 }}>
            <BottomButton
              onClick={() => Signout("Are you sure you want to Sign Out?")}
            >
              Sign Out
            </BottomButton>
            {/* <BottomButton onClick={() => Signout(userData.linkingCode)}>Sign Out</BottomButton> */}
            <BottomButton onClick={() => navigate("/privacy")}>
              Privacy Policy
            </BottomButton>
            <a
              href="https://chrome.google.com/webstore/detail/cross-copy/klbdmjmclllnpfedhjghiglcbmnianbo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }} // Optional, to remove underline from the link
            >
              <BottomButton
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#3bfc00",
                }}
              >
                <AiFillChrome
                  size={15}
                  style={{ marginBottom: "3px", marginRight: "5px" }}
                />
                Chrome Extension
              </BottomButton>
            </a>
          </BottomContainer>
        </>
      ) : (
        <>
          <MobileHomePage
            key="Sub2"
            mobile={mobile}
            files={files}
            setFiles={setFiles}
            paidUser={paidUser}
            history={history}
            setHistory={setHistory}
          />
        </>
      )}
      {!mobile &&
        rectData.map((rect, index) => (
          <>
            <RectLeft
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              rightWidth={rect.rightWidth}
              bottomWidth={rect.bottomWidth}
              height={rect.height}
              color={rect.color}
            />
          </>
        ))}
    </Container>
  );
}

export default HomePage;

function interpolateColor(color1, color2, factor) {
  const result = color1
    .slice(1)
    .match(/.{2}/g)
    .map((byte, i) =>
      Math.round(
        parseInt(byte, 16) +
          factor *
            (parseInt(color2.slice(1).match(/.{2}/g)[i], 16) -
              parseInt(byte, 16))
      )
    );

  return `#${result.map((byte) => `0${byte.toString(16)}`.slice(-2)).join("")}`;
}

