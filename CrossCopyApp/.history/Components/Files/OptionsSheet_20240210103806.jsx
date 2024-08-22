import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const CustomBackgroundComponent = ({ style }) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: "#676767",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        },
      ]}
    />
  );
};

const OptionsSheet = ({ isOptionsVisible, setOptionsVisible, selectedFile }) => {
  const optionsRef = useRef(null);

  const handleDismissModalPress = () => {
    optionsRef.current?.dismiss();
    setIsSheetVisible(false);
  };

  useEffect(() => {
    if (isOptionsVisible && selectedFile) {
        optionsRef.current?.present();
    } else {
        optionsRef.current?.dismiss();
    }
  }, [isOptionsVisible, file]);

  return (
    <BottomSheetModal
      ref={optionsRef}
      index={1}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) {
          setOptionsVisible(false);
        }
      }}
      style={{ zIndex: 10 }}
      backgroundComponent={CustomBackgroundComponent}
    >
      <Text>ShareSheet</Text>
    </BottomSheetModal>
  );
};

export default OptionsSheet;
