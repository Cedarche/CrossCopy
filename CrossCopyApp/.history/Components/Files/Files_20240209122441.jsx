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
  Dimensions,
} from "react-native";
import { styles } from "../Home/Styles/SharedStyles";
import { db, auth, storage } from "../../Firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
// import FastImage from 'react-native-fast-image';
import { Image } from "expo-image";
// import * as ImagePicker from "expo-image-picker";
import CustomBottomSheetModal from "./FileDisplaySheet"; // Adjust the path as necessary
import * as DocumentPicker from "expo-document-picker";
import { GradientBorderButton } from "../Home/Styles/GradientComponents";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";
import { SwipeListView } from "react-native-swipe-list-view";
import { FileStyles } from "./FileStyles";
import { ModalStyles } from "./ModalStyles";

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
  const [isSheetVisible, setIsSheetVisible] = useState(true);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [scannedImage, setScannedImage] = useState();

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

  const pickImages = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then((images) => {
      console.log(images);
    });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
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
    const modalHeight = 180; // Assuming modal height is 150
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

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
            <TouchableOpacity
              style={[styles.bottomButton, { marginRight: -1 }]}
            >
              <Text style={styles.buttonText}>Clear</Text>
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
        <CustomBottomSheetModal
          isSheetVisible={isSheetVisible}
          setIsSheetVisible={setIsSheetVisible}
          selectedFileUrl={selectedFileUrl}
          setSelectedFileUrl={setSelectedFileUrl}
          snapPoints={snapPoints}
        />
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
                    { top: modalPosition.y, left: modalPosition.x }, // Adjusted to center the modal on the press location
                    ,
                  ]}
                >
                  <TouchableOpacity
                    style={ModalStyles.modalRow}
                    onPressIn={pickImages}
                  >
                    <Text style={ModalStyles.modalText}>Photo Library</Text>
                    <Feather name="image" style={{ color: "#fff" }} size={20} />
                  </TouchableOpacity>
                  <View style={ModalStyles.divider} />
                  <TouchableOpacity
                    style={ModalStyles.modalRow}
                    onPressIn={takePhoto}
                  >
                    <Text style={ModalStyles.modalText}>
                      Take photo or video
                    </Text>
                    <Feather
                      name="camera"
                      style={{ color: "#fff" }}
                      size={20}
                    />
                  </TouchableOpacity>
                  <View style={ModalStyles.divider} />
                  <TouchableOpacity
                    style={ModalStyles.modalRow}
                    onPressIn={scanDocument}
                  >
                    <Text style={ModalStyles.modalText}>Scan document</Text>
                    <MaterialIcons
                      name="document-scanner"
                      size={20}
                      style={{ color: "#fff" }}
                    />
                  </TouchableOpacity>
                  <View style={ModalStyles.divider} />
                  <TouchableOpacity
                    style={[ModalStyles.modalRow, { borderBottomWidth: 0 }]}
                    onPressIn={pickFile}
                  >
                    <Text style={ModalStyles.modalText}>Pick file</Text>
                    <Feather name="file" style={{ color: "#fff" }} size={20} />
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
