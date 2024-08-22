import React, { useState, useEffect } from "react";
import {
  Container,
  HeadingContainer,
  Header,
  SubHeading,
  ButtonContainer,
  Button,
  ButtonText,
  InfoText,
  TextContainer,
  HeroContainer,
  WebAppImage,
  PhoneImage,
  BottomButtonContainer,
  ExtensionImage,
  RectLeft,
  CloseButton,
  TryButton,
  ChromeButton,
  Spinner,
  spinner,
} from "./LandingElements";
import { trackButtonClick, trackViews } from "../firebase";
import { BottomContainer, BottomButton } from "../Home/HomeElements";
import { FiArrowLeft, FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { AiFillChrome } from "react-icons/ai";
import CC_Phone from "../assets/CC_Phone.png";
import Extension from "../assets/Extension.png";
import WebApp from "../assets/WebApp.png";

import { AnimatePresence, useAnimation } from "framer-motion";

import { useNavigate } from "react-router-dom";
import MobileLanding from "./MobileLanding";

export function interpolateColor(color1, color2, factor) {
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

export default function LandingPage() {
  const [loadedImagesCount, setLoadedImagesCount] = useState(0); // State to track loaded images
  const [clickedImage, setClickedImage] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [showAuth, setShowAuth] = useState(false);
  const [mobile, setMobile] = useState(null); // Add a device state

  const navigate = useNavigate();

  const rectData = Array.from({ length: 9 }, (_, i) => ({
    rightWidth: 55 - i * 10,
    bottomWidth: (mobile ? 110 : 75) - i * 10, // Set to 100 if mobile, else 75, then subtract i * 10
    height: 100,
    color: interpolateColor("#24242411", "#00ffff11", i / 8),
  }));

  useEffect(() => {
    trackViews("LandingPage");
    const checkDevice = () => {
      if (window.innerWidth <= 900) {
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
  const totalImages = 3;
  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  if (loading || loadedImagesCount < totalImages) {
    // console.log('Images loaded:', loadedImagesCount); // Log the loading state

    return (
      <>
        <img
          key="111"
          src={CC_Phone}
          alt="Phone"
          onLoad={handleImageLoad}
          style={{ display: "none" }}
        />
        <img
          key="112"
          src={Extension}
          alt="Extension"
          onLoad={handleImageLoad}
          style={{ display: "none" }}
        />
        <img
          key="113"
          src={WebApp}
          alt="WebApp"
          onLoad={handleImageLoad}
          style={{ display: "none" }}
        />
        <Container style={{ justifyContent: "center" }} key="114">
          <Spinner animate={spinner.loop} /> {/* Your spinner component */}
        </Container>
      </>
    );
  }

  if (mobile) {
    return <MobileLanding />;
  }

  return (
    <Container style={{ overflow: "hidden" }}>
      <AnimatePresence>
        <>
          <HeadingContainer>
            <Header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              CROSS COPY
            </Header>
            <SubHeading
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              Seamlessly share text, files, and photos between platforms -
              always free.{" "}
            </SubHeading>
          </HeadingContainer>
          <ButtonContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!mobile && (
              <ButtonText>
                No account required. Click below to learn more or:
              </ButtonText>
            )}
            <Button
              onClick={() => {
                trackButtonClick("homeLogin"), navigate("/login");
              }}
            >
              Try it out / Login
            </Button>
            <a
              href="https://chrome.google.com/webstore/detail/cross-copy/klbdmjmclllnpfedhjghiglcbmnianbo"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <ChromeButton
                style={{
                  width: "160px",
                  marginTop: "0px",
                  marginLeft: "8px",
                  height: "30px",
                }}
                onClick={() => trackButtonClick("extensionLink")}
              >
                {" "}
                <AiFillChrome size={20} style={{ marginRight: "5px" }} />
                Open Extension
              </ChromeButton>
            </a>
          </ButtonContainer>
        </>

        <HeroContainer
          key="4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WebAppImage
            className="webapp-image"
            src={WebApp}
            alt="WebAppImage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setClickedImage("webapp")}
            clicked={clickedImage}
            top="50px"
            left="0"
            right="0"
          />
          <PhoneImage
            className="phone"
            src={CC_Phone}
            alt="Phone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setClickedImage("phone")}
            clicked={clickedImage}
          />
          <ExtensionImage
            className="extension"
            src={Extension}
            alt="Extension"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => setClickedImage("extension")}
            clicked={clickedImage}
          />

          {clickedImage && clickedImage === "phone" && (
            <TextContainer
              style={{ right: "50px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SubHeading>No more emails to yourself</SubHeading>
              <InfoText>
                Photos, files, and text uploaded from your mobile or tablet
                appear instantly on your desktop browser or Chrome Extension.
              </InfoText>
              <InfoText>
                Share full-resolution photos across platforms without the need
                for AirDrop, Emails, or Drop Box.
              </InfoText>
              <InfoText>
                Effortlessly keep track of text and links with synced paste
                history.{" "}
              </InfoText>
              <ButtonContainer style={{ marginTop: "12px" }}>
                <CloseButton onClick={() => setClickedImage(null)}>
                  <FiArrowLeft
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                  />
                  Go Back
                </CloseButton>
                <TryButton
                  style={{ maxHeight: "38px", outline: "none" }}
                  onClick={() => {
                    trackButtonClick("tryitButton"), navigate("/login");
                  }}
                >
                  Try it out
                  <FiArrowUpRight
                    style={{ marginLeft: "5px", marginBottom: "2px" }}
                  />
                </TryButton>
              </ButtonContainer>
            </TextContainer>
          )}
          {clickedImage && clickedImage === "extension" && (
            <TextContainer
              style={{ left: "50px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SubHeading>Full control from an extension</SubHeading>
              <InfoText>
                Transfer photos, files, and text between your mobile devices and
                Chromium Browser instantly, all in one streamlined process.
              </InfoText>
              <InfoText>
                Share high-resolution images and documents across different
                platforms without relying on traditional methods like AirDrop,
                Emails, or cloud services.
              </InfoText>
              <InfoText style={{ width: "100%", marginLeft: "22px" }}>
                All features in one easy pop-up.
              </InfoText>
              <a
                href="https://chrome.google.com/webstore/detail/cross-copy/klbdmjmclllnpfedhjghiglcbmnianbo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <ChromeButton onClick={() => trackButtonClick("extensionLink")}>
                  {" "}
                  <AiFillChrome size={20} style={{ marginRight: "5px" }} />
                  Open Extension
                </ChromeButton>
              </a>
              <ButtonContainer style={{ marginTop: "12px" }}>
                <TryButton
                  style={{ maxHeight: "38px", outline: "none" }}
                  onClick={() => {
                    trackButtonClick("tryitButton"), navigate("/login");
                  }}
                >
                  Try out Cross Copy
                  <FiArrowUpRight
                    style={{ marginLeft: "5px", marginBottom: "2px" }}
                  />
                </TryButton>
                <CloseButton onClick={() => setClickedImage(null)}>
                  Go Back
                  <FiArrowRight
                    style={{ marginLeft: "5px", marginBottom: "2px" }}
                  />
                </CloseButton>
              </ButtonContainer>
            </TextContainer>
          )}
          {clickedImage && clickedImage === "webapp" && (
            <BottomButtonContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ButtonContainer>
                <CloseButton onClick={() => setClickedImage(null)}>
                  <FiArrowLeft
                    style={{ marginRight: "5px", marginBottom: "2px" }}
                  />
                  Go Back
                </CloseButton>
                <TryButton
                  style={{ maxHeight: "38px", outline: "none" }}
                  onClick={() => {
                    trackButtonClick("tryitButton"), navigate("/login");
                  }}
                >
                  Try it out
                  <FiArrowUpRight
                    style={{ marginLeft: "5px", marginBottom: "2px" }}
                  />
                </TryButton>
              </ButtonContainer>
            </BottomButtonContainer>
          )}
        </HeroContainer>

        <BottomContainer key="5">
          <BottomButton
            style={{ zIndex: 5, marginLeft: "0px" }}
            onClick={() => navigate("/privacy")}
          >
            Privacy Policy
          </BottomButton>
        </BottomContainer>
      </AnimatePresence>
      {rectData.map((rect, index) => (
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
      ))}
    </Container>
  );
}
