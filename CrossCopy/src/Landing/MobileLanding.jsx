import React, { useState, useEffect } from 'react';

import {
  Container,
  CarouselContainer,
  HeroContainer,
  HeroImages,
  NavBar,
  HeadingContainer,
  TagLine,
  SubHeading,
  Button,
  PhoneImage,
  HeroPhone,
  HeroWeb,
  HeroExtension,
  HeroExtension2,
  TextBox,
  RectRight,
} from './MobileLandingElements';
import { Header, Spinner, spinner, TryButton } from './LandingElements';
import { BottomContainer, BottomButton } from '../Home/HomeElements';
import { trackButtonClick, trackViews } from '../firebase';
import CC_Phone from '../assets/CC_Phone.png';
import Extension from '../assets/Extension.png';
import WebApp from '../assets/WebApp.png';
import MobileFiles from '../assets/Mobile-Files.png';
import MobileText from '../assets/Mobile-Text.png';
import MobileHistory from '../assets/Mobile-History.png';
import ImageCarousel from './ImageCarousel'; // Make sure the path is correct
import { interpolateColor } from './LandingPage';
import { FiArrowLeft, FiArrowUpRight, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function MobileLanding() {
  const [loadedImagesCount, setLoadedImagesCount] = useState(0); // State to track loaded images
  const [activeImage, setActiveImage] = useState(null); // "phone", "web", or "extension"
  useEffect(() => {
    trackViews('MobileLandingPage');
  }, []);
  const navigate = useNavigate();

  const rectData = Array.from({ length: 9 }, (_, i) => ({
    leftWidth: 100 - i * 10, // Adjust this as needed
    topWidth: 75 - i * 10, // Adjust this as needed
    height: 100,
    color: interpolateColor('#24242411', '#00ffff11', i / 8),
  }));

  const totalImages = 3;
  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => prevCount + 1);
  };

  if (loadedImagesCount < totalImages) {
    return (
      <>
        <img
          src={MobileFiles}
          alt="MobileFiles"
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
        />
        <img
          src={MobileText}
          alt="MobileText"
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
        />
        <img
          src={MobileHistory}
          alt="MobileHistory"
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
        />
        <Container style={{ justifyContent: 'center' }}>
          <Spinner animate={spinner.loop} /> {/* Your spinner component */}
        </Container>
      </>
    );
  }

  return (
    <Container>
      <NavBar key="1">
        <Header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '25px', margin: '0px' }}
        >
          CROSS COPY
        </Header>
        <Button
          onClick={() => {
            trackButtonClick('mobileHomeLogin'), navigate('/login');
          }}
        >
          Login / Signup
        </Button>
      </NavBar>
      <HeroContainer key="2">
        <HeadingContainer>
          <TagLine>No more emails to yourself</TagLine>
          <SubHeading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Seamlessly share text, files, and photos between your mobile and browser. <br />
            <br />
            Free to use - no account required
          </SubHeading>

          <Button
            style={{ maxHeight: '30px', maxWidth: '94px', alignItems: 'center' }}
            onClick={() => {
              trackButtonClick('tryitButton'), navigate('/login');
            }}
          >
            Try it out
            <FiArrowUpRight style={{ marginLeft: '5px', marginBottom: '-2px' }} size={13} />
          </Button>
        </HeadingContainer>
        <HeroImages>
          <TextBox style={{ top: '-23px', right: '15px' }}>Browser Application</TextBox>

          <HeroWeb src={WebApp} onClick={() => setActiveImage('web')} />

          <TextBox style={{ bottom: '145px', right: '70px' }}>Chrome Extension</TextBox>

          <HeroExtension src={Extension} onClick={() => setActiveImage('extension')} />

          <TextBox style={{ top: '73px', left: '65px' }}>Mobile</TextBox>

          <HeroPhone src={CC_Phone} onClick={() => setActiveImage('phone')} />
        </HeroImages>
        <HeadingContainer style={{ paddingTop: '20px' }}>
          <SubHeading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '0px', color: '#fff', fontSize: '22px' }}
          >
            Designed for mobile
          </SubHeading>
          <SubHeading style={{ fontWeight: '500', paddingRight: '20px' }}>
            It's never been easier to send files to yourself or others
          </SubHeading>
        </HeadingContainer>
        <CarouselContainer>
          <ImageCarousel />
        </CarouselContainer>
        <HeadingContainer>
          <SubHeading
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: '0px', color: '#fff', fontSize: '22px' }}
          >
            Full control from an extension
          </SubHeading>
          <SubHeading style={{ fontWeight: '500', paddingRight: '20px' }}>
            Get all of your links and files from any web page
          </SubHeading>
        </HeadingContainer>
        <HeroImages style={{ height: '280px' }}>
          <HeroExtension2 src={Extension} />
        </HeroImages>
        <BottomContainer style={{ marginBottom: '5px' }}>
          <BottomButton style={{ zIndex: 5, marginLeft: '0px' }}>
            &copy; Cross Copy 2023{' '}
          </BottomButton>
          <BottomButton
            style={{ zIndex: 5, marginLeft: '0px' }}
            onClick={() => navigate('/privacy')}
          >
            Privacy Policy
          </BottomButton>
        </BottomContainer>
      </HeroContainer>
      {rectData.map((rect, index) => (
        <>
          <RectRight
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            leftWidth={rect.leftWidth}
            topWidth={rect.topWidth}
            height={rect.height}
            color={rect.color}
          />
        </>
      ))}
    </Container>
  );
}
