// CustomBottomSheetModal.js
import React, {useEffect, useRef} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { GradientBorderButton } from "../Home/Styles/GradientComponents";


const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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

const CustomBottomSheetModal = ({ isSheetVisible, setIsSheetVisible, selectedFileUrl, setSelectedFileUrl, snapPoints }) => {
  const bottomSheetModalRef = useRef(null);

  const handleDismissModalPress = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsSheetVisible(false);
  };

  useEffect(() => {
    if (isSheetVisible && selectedFileUrl) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isSheetVisible, selectedFileUrl]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={(index) => {
        if (index === -1) {
          setIsSheetVisible(false);
          setSelectedFileUrl(null); // Reset the selected file URL
        }
      }}
      style={{ zIndex: 10 }}
      backgroundComponent={CustomBackgroundComponent}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {selectedFileUrl &&
        (selectedFileUrl.includes("_jpeg") ||
          selectedFileUrl.includes("_jpg") ||
          selectedFileUrl.includes("_png")) ? (
          <Image
            style={{ width: "95%", height: "90%" }}
            source={selectedFileUrl}
            placeholder={blurhash}
            contentFit="contain"
            transition={100}
            cachePolicy={"memory-disk"}
          />
        ) : (
          <Text>{selectedFileUrl}</Text>
        )}

        <GradientBorderButton
          title="Close"
          textStyle={{ fontSize: 15, color: "#fff" }}
          fill={false}
          onPress={handleDismissModalPress}
          gradientColors={["#00b3ff", "#0066ff"]}
          width={"90%"}
          style={{ marginBottom: 0, borderRadius: 12 }}
        />
      </View>
    </BottomSheetModal>
  );
};

export default CustomBottomSheetModal;
