import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";

const useGetDocument = (uploadFileToFirebase, setModalVisible) => {
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*", // This allows any file type
    });

    console.log(result);
    if (result.canceled === false) {
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
      const fileSize = result.assets[0].size;

      // Upload the file to Firebase
      uploadFileToFirebase(fileUri, fileName, fileSize);
      setModalVisible(false);
    }
  };

  const pickImages = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo", // Limit to photos only to avoid picking videos
      compressImageQuality: 1, // Adjust compression as needed
      forceJpg: true, // Force conversion to JPG
    })
      .then((images) => {
        images.forEach((image) => {
          console.log(image);
          const fileUri = image.path; // Use the 'path' property for the file URI
          const fileName = `${Date.now()}.jpg`; // Replace any existing extension with '.jpg'
          // const imageName = image.path.substring(image.path.lastIndexOf("/") + 1);
          // Proceed with the upload...
          uploadFileToFirebase(fileUri, fileName, image.size);
          setModalVisible(false);
        });
      })
      .catch((error) => {
        console.error("Error picking images:", error);
      });
  };

  const takePhoto = () => {
    ImagePicker.openCamera({
      cropping: false,
    }).then((image) => {
      console.log(image);
      // Ensure the file URI is pointing to a JPG file
      const fileUri = image.path;

      // Extract the filename without extension, then append '.jpg'
      // const fileName = (image.filename ? image.filename.split('.').slice(0, -1).join('.') : fileUri.split('/').pop().split('.').slice(0, -1).join('.')) + '.jpg';
      const fileName = image.filename.replace(/HEIC/g, "jpg");
      // const fileName = "test.jpg";
      // const fileName = image.filename
      // Proceed with the upload...
      uploadFileToFirebase(fileUri, fileName, image.size);
      setModalVisible(false);
    });
  };

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();
    console.log(scannedImages);
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      scannedImages.forEach(async (fileUri) => {
        // Use FileSystem.getInfoAsync to get file information, including size
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        // console.log(`Image path: ${imagePath}, Size: ${fileInfo.size} bytes`);
        const fileName = `IMG_${Math.floor(Math.random() * 90000) + 10000}`;
        uploadFileToFirebase(fileUri, fileName, fileInfo?.size);
        setModalVisible(false);
        // Do something with the size, like storing it or displaying it
        // For example, setting the state (make sure your state handling logic is set up for this)
        // setScannedImageInfo(prev => [...prev, { path: imagePath, size: fileInfo.size }]);
      });
    }
  };
  return { pickFile, pickImages, takePhoto, scanDocument };
};


export default useGetDocument;