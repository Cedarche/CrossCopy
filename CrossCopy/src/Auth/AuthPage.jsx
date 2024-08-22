import React, { useState, useEffect } from "react";
import {
  Container as WebContainer,
  RectLeft,
  CloseButton,
} from "../Landing/LandingElements";
import {
  Container as MobileContainer,
  RectRight,
} from "../Landing/MobileLandingElements";
import { useNavigate } from "react-router-dom";
import LoginPage from "./AuthHome";
import { interpolateColor } from "../Landing/LandingPage";
import { FiArrowLeft, FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { auth, onAuthStateChanged } from "../firebase";

function AuthPage() {
  const [mobile, setMobile] = useState(null); // Add a device state
  const [loading, setLoading] = useState(true); // Add a loading state
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const mobileRectData = Array.from({ length: 9 }, (_, i) => ({
    leftWidth: 100 - i * 10, // Adjust this as needed
    topWidth: 75 - i * 10, // Adjust this as needed
    height: 100,
    color: interpolateColor("#24242411", "#00ffff11", i / 8),
  }));

  const webRectData = Array.from({ length: 9 }, (_, i) => ({
    rightWidth: 55 - i * 10,
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once Firebase returns the user's auth status
      if (user) {
        navigate("/home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div></div>; // Render a loading message while loading
  }

  if (mobile) {
    return (
      <MobileContainer key="mobile">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            paddingBottom: "200px",
            width: "100vw",
            height: "100vh",
            position: "relative",
          }}
        >
          <LoginPage />
          <CloseButton
            onClick={() => navigate("/")}
            style={{ zIndex: "10", marginBottom: "0px" }}
          >
            <FiArrowLeft style={{ marginRight: "5px", marginBottom: "2px" }} />
            Go Back
          </CloseButton>
        </div>
        {mobileRectData.map((rect, index) => (
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
      </MobileContainer>
    );
  }

  return (
    <WebContainer key="web">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <LoginPage style={{ marginBottom: "40px" }} />
        <CloseButton
          onClick={() => navigate("/")}
          style={{ zIndex: "10", marginBottom: "10px" }}
        >
          <FiArrowLeft style={{ marginRight: "5px", marginBottom: "2px" }} />
          Go Back
        </CloseButton>
      </div>
      {webRectData.map((rect, index) => (
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
    </WebContainer>
  );
}

export default AuthPage;
