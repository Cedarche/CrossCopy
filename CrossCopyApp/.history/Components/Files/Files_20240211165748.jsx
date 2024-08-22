import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { styles } from "../SharedStyles";
import { db, auth, storage, database } from "../../Firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import useFileUploader from "./Hooks/useFileUploader";
import useFileDelete from "./Hooks/useFileDelete";
import CustomBottomSheetModal from "./FileDisplaySheet";
import { FileStyles } from "./FileStyles";
import { ModalStyles } from "./ModalStyles";
import ReceiveSharingIntent from "react-native-receive-sharing-intent";
import { ProgressBar, DownloadBar } from "./ProgressBars";
import { FileItem } from "./FileItem";
import useGetDocument from "./Hooks/useGetDocument";
import OptionsSheet from "./OptionsSheet";
import { Image } from "expo-image";


export default function Files({ files, setFiles, paidUser }) {
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isOptionsVisible, setOptionsVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([])

  // ReceiveSharingIntent.getReceivedFiles(
  //   (files) => {
  //     // files returns as JSON Array example
  //     console.log(files);
  //     //[{ filePath: null, text: null, weblink: null, mimeType: null, contentUri: null, fileName: null, extension: null }]
  //   },
  //   (error) => {
  //     console.log(error);
  //   },
  //   "com.cedarche.CrossCopyApp" // share url protocol (must be unique to your app, suggest using your apple bundle id)
  // );
  // useEffect(() => {}, []);

  const { uploadFileToFirebase, fileProgresses, error } = useFileUploader(
    storage,
    database,
    auth
  );
  const { removeFile, removeAllFiles } = useFileDelete(
    storage,
    database,
    auth,
    files,
    setFiles
  );

  const { pickFile, pickImages, takePhoto, scanDocument } = useGetDocument(
    uploadFileToFirebase,
    setModalVisible
  );

    useEffect(() => {
      console.log(files)
    }, [files])

  // Compute cumulative upload progress
  const uploadProgress = useMemo(() => {
    const progressValues = Object.values(fileProgresses);
    return progressValues.length > 0
      ? progressValues.reduce((total, progress) => total + progress, 0) /
          progressValues.length
      : 0;
  }, [fileProgresses]);

  useEffect(() => {
    const prefetchImages = async () => {
      const imageUrls = await Promise.all(
        files.map((file) => {
          if (
            file.name.endsWith("_jpeg") ||
            file.name.endsWith("_jpg") ||
            file.name.endsWith("_png")
          ) {
            const fileStorageRef = storageRef(
              storage,
              `uploads/${auth.currentUser.uid}/${file.name}`
            );
            return getDownloadURL(fileStorageRef);
          }
          return null;
        })
      );
  
      imageUrls.forEach((url) => {
        if (url) {
          Image.prefetch(url).then(() => {
            console.log(`Prefetched: ${url}`);
          }).catch(err => {
            console.error(`Failed to prefetch: ${url}`, err);
          });
        }
      });
    };
  
    prefetchImages();
  }, [files]);
  

  const handlePresentModalPress = useCallback(
    (file) => {
      const actualFileName = file.name;
      if (
        actualFileName.endsWith("_jpeg") ||
        actualFileName.endsWith("_jpg") ||
        actualFileName.endsWith("_png") ||
        actualFileName.endsWith("_pdf")
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
              // bottomSheetModalRef.current?.present();
              setIsSheetVisible(true);
            }
          })
          .catch((error) => {
            console.error("Error getting download URL: ", error);
          });
      } else {
        setSelectedFileUrl(file.url); // If it's not an image, use the provided URL
        console.log(file);
        if (!isSheetVisible) {
          // bottomSheetModalRef.current?.present();
          setIsSheetVisible(true);
        }
      }
    },
    [isSheetVisible]
  );

  const handleOptionsPress = useCallback(
    (file) => {
      setSelectedFile(file);
      if (!isOptionsVisible) {
        setOptionsVisible(true);
      }
    },
    [isOptionsVisible]
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedFiles.some((selectedFile) => selectedFile.name === item.name);
  
    return (
      <FileItem
        file={item}
        openSheet={handlePresentModalPress}
        openOptions={handleOptionsPress}
        handleRemoveFile={removeFile}
        isSelectable={isSelectable}
        setSelectedFiles={setSelectedFiles}
        isSelected={isSelected}
      />
    );
  };
  

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BottomSheetModalProvider>
        {/* <Button onPress={handlePresentModalPress} title="Present Modal" color="black" /> */}
        <View style={styles.subContainer}>
          <View style={styles.bottomContainer}>
            <Text style={styles.bottomText}>Files</Text>
            <TouchableOpacity
              style={[
                !isSelectable ? styles.borderButton : styles.bottomButton,
                { marginRight: 5 },
              ]}
              onPress={() => setIsSelectable(!isSelectable)}
            >
              <Text
                style={
                  !isSelectable ? styles.borderButtonText : styles.buttonText
                }
              >
                Select Multiple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomButton, { marginRight: -1 }]}
            >
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <ProgressBar uploadProgress={uploadProgress} />

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
        />
        <OptionsSheet
          isOptionsVisible={isOptionsVisible}
          setOptionsVisible={setOptionsVisible}
          selectedFile={selectedFile}
          handleRemoveFile={removeFile}
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
