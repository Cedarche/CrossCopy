// ImageCarousel.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import MobileFiles from '../assets/Mobile-Files.png';
import MobileText from '../assets/Mobile-Text.png';
import MobileHistory from '../assets/Mobile-History.png';
import {
  InfoContainer,
  ImageContainer,
  PhoneImage,
  IndicatorsContainer,
  Indicator,
  InfoHeader,
  InfoSubHeader,
  NavigationButton,
} from './MobileLandingElements';

const images = [MobileFiles, MobileText, MobileHistory];

const slides = [
  {
    src: MobileFiles,
    header: 'Files',
    subheader: 'Files uploaded on your mobile or browser are instantly synced',
  },
  {
    src: MobileText,
    header: 'Text',
    subheader: 'Sick of emailing yourself? Your links, images, and text accessible anywhere',
  },
  {
    src: MobileHistory,
    header: 'History',
    subheader: 'Effortlessly keep track of text and links with dated paste history.',
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

export default function ImageCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <>
      <NavigationButton className="prev" onClick={() => paginate(-1)}>
        {'‣'}
      </NavigationButton>

      <NavigationButton className="next" onClick={() => paginate(1)}>
        {'‣'}
      </NavigationButton>
      <AnimatePresence initial={false} custom={direction}>
        <ImageContainer
          layout
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            // x: { type: 'spring', stiffness: 300, damping: 30 },
            x: { type: 'linear', duration: 0.2, ease: 'easeInOut' },

            opacity: { duration: 0.2 },
          }}
          // drag="x"
          // dragConstraints={{ left: 0, right: 0 }}
          // dragElastic={1}
          // onDragEnd={(e, { offset, velocity }) => {
          //   const swipe = swipePower(offset.x, velocity.x);
          //   if (swipe < -swipeConfidenceThreshold) {
          //     paginate(1);
          //   } else if (swipe > swipeConfidenceThreshold) {
          //     paginate(-1);
          //   }
          // }}
        >
          <InfoContainer>
            <InfoHeader>{slides[imageIndex].header}</InfoHeader>
            <InfoSubHeader>{slides[imageIndex].subheader}</InfoSubHeader>
          </InfoContainer>

          <PhoneImage src={images[imageIndex]} />
        </ImageContainer>
      </AnimatePresence>
      <IndicatorsContainer>
        {images.map((_, index) => (
          <Indicator key={index} isActive={page % images.length === index} />
        ))}
      </IndicatorsContainer>
    </>
  );
}
