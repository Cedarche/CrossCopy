import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Dimensions
} from "react-native";
import { styles } from "./Styles/SharedStyles";
import { db, auth, storage } from "../../Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
// import FastImage from 'react-native-fast-image';
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { GradientBorderButton } from "./Styles/GradientComponents";
import { SwipeListView } from "react-native-swipe-list-view";
import { FileStyles } from "./Styles/FileStyles";
import { ModalStyles } from "./Styles/ModalStyles";

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

export default function Files({ files, setFiles, paidUser }) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["30%", "99%"], []);

  useEffect(() => {
    const imageUrls = files.map((file) => {
      const actualFileName = file.name;
      if (
        actualFileName.endsWith("_jpeg") ||
        actualFileName.endsWith("_jpg") ||
        actualFileName.endsWith("_png")
      ) {
        const fileStorageRef = storageRef(
          storage,
          `uploads/${auth.currentUser.uid}/${file.name}`
        );
        return getDownloadURL(fileStorageRef);
      }
      return null;
    });

    Promise.all(imageUrls).then((urls) => {
      Image.prefetch(urls);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);


  const handlePresentModalPress = useCallback(
    (file) => {
      const actualFileName = file.name;
      if (
        actualFileName.endsWith("_jpeg") ||
        actualFileName.endsWith("_jpg") ||
        actualFileName.endsWith("_png")
      ) {
        const fileStorageRef = storageRef(
          storage,
          `uploads/${auth.currentUser.uid}/${file.name}`
        );
        getDownloadURL(fileStorageRef)
          .then((url) => {
            // console.log(url);
            setSelectedFileUrl(url);
            if (!isSheetVisible) {
              bottomSheetModalRef.current?.present();
              setIsSheetVisible(true);
            }
          })
          .catch((error) => {
            console.error("Error getting download URL: ", error);
          });
      } else {
        setSelectedFileUrl(file.url); // If it's not an image, use the provided URL
        if (!isSheetVisible) {
          bottomSheetModalRef.current?.present();
          setIsSheetVisible(true);
        }
      }
    },
    [isSheetVisible]
  );

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setIsSheetVisible(false);
  }, []);

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // This allows any file type
    });

    if (result.type === "success") {
      // Handle the selected file here
      // For example, you can set it to state or upload it to Firebase
      setSelectedFileUrl(result.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedFileUrl(result.assets[0].uri);
    }

    // if (result) {
    //   // Handle the selected image or file here
    //   // For example, you can set it to state or upload it to Firebase
    //   setSelectedFileUrl(result.uri);
    // }
  };

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderItem = ({ item }) => (
    <FileItem file={item} openSheet={handlePresentModalPress} />
  );

  const handleAddItemPress = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    const modalWidth = 225; // Assuming modal width is 150
    const modalHeight = 150; // Assuming modal height is 150
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
  
    // Calculate position to prevent overflow
    let calculatedX = pageX;
    let calculatedY = pageY;
  
    // Adjust X position if tapping near the right edge
    if (pageX + modalWidth > screenWidth) {
      calculatedX = screenWidth - modalWidth - 20; // 20 is a margin
    }
  
    // Adjust Y position if tapping near the bottom edge
    if (pageY + modalHeight > screenHeight) {
      calculatedY = screenHeight - modalHeight - 20; // 20 is a margin
    }
  
    setModalPosition({ x: calculatedX, y: calculatedY });
    setModalVisible(true);
  };
  

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => console.log(data)}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BottomSheetModalProvider>
        {/* <Button onPress={handlePresentModalPress} title="Present Modal" color="black" /> */}
        <View style={styles.subContainer}>
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>Files</Text>
            <TouchableOpacity style={[styles.bottomButton, { marginRight: 5 }]}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton}>
              <Text style={styles.buttonText}>Copy</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{
              overflow: "hidden",
              padding: 5,

              maxHeight: flatListHeight,
            }}
            contentContainerStyle={{ flex: 0 }}
            showsVerticalScrollIndicator={false}
            data={files}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onContentSizeChange={(width, height) => setFlatListHeight(height)} // Adjust height based on content
          />
          <View style={FileStyles.addItemContainer}>
            <TouchableOpacity
              style={FileStyles.addItemButton}
              onPress={handleAddItemPress}
            >
              <Feather
                name="file-plus"
                style={{ color: "#c6c6c6" }}
                size={40}
              />
              <Text style={FileStyles.addItemText}>
                Press to select photos or files
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
              // margin: 5,
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
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={ModalStyles.modalOverlay}>
              {/* Stop touch events from propagating to the overlay */}
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View
                  style={[
                    ModalStyles.modalContainer,
                    { top: modalPosition.y, left: modalPosition.x },, // Adjusted to center the modal on the press location
                  ]}
                >
                  <TouchableOpacity style={ModalStyles.modalRow}>

                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </BottomSheetModalProvider>
    </TouchableWithoutFeedback>
  );
}

function truncateFileName(fileName) {
  // Split the file name into name and extension
  const splitName = fileName.split("_");
  const extension = splitName.pop();
  let name = splitName.join(".");

  // If the name is longer than 30 characters, truncate it
  if (name.length > 20) {
    name = `${name.substring(0, 18)}(...)`;
  }

  // Return the truncated name with the extension
  return `${name}.${extension}`;
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const strTime =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm;
  return strTime;
};

const FileItem = ({ file, openSheet }) => {
  return (
    <TouchableOpacity
      style={FileStyles.itemContainer}
      onPress={() => openSheet(file)}
    >
      <View style={FileStyles.infoContainer}>
        <Text style={{ color: "#dedede" }}>{truncateFileName(file.name)}</Text>
        <View style={FileStyles.dataContainer}>
          <Text
            style={{
              fontSize: 10,
              marginRight: 4,
              fontWeight: 400,
              color: "lightblue",
            }}
          >
            {file.size / 1000 < 1000
              ? (file.size / 1000).toFixed(2) + "KB"
              : (file.size / 1000000).toFixed(2) + "MB"}
          </Text>
          <Text style={{ color: "#898989" }}>|</Text>
          <Text
            style={{
              fontSize: 10,
              marginLeft: 4,
              fontWeight: 300,
              color: "#00f7ff",
            }}
          >
            {formatTimestamp(file.uploadTimestamp)}
          </Text>
        </View>
      </View>
      <Feather name="more-vertical" size={25} color={"#727272"} />
    </TouchableOpacity>
  );
};
