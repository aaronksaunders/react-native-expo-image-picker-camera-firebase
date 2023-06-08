import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { listFiles, uploadToFirebase } from "./firebase-config";
import { useState, useEffect } from "react";
import MyFilesList from "./MyList";

export default function App() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    listFiles().then((listResp) => {
      const files = listResp.map((value) => {
        return { name: value.fullPath };
      });

      setFiles(files);
    });
  }, []);

  console.log(files);

  /**
   *
   */
  const takePhoto = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0];
        const fileName = uri.split("/").pop();
        const uploadResp = await uploadToFirebase(uri, fileName, (v) =>
          console.log(v)
        );
        console.log(uploadResp);

        listFiles().then((listResp) => {
          const files = listResp.map((value) => {
            return { name: value.fullPath };
          });

          setFiles(files);
        });
      }
    } catch (e) {
      Alert.alert("Error Uploading Image " + e.message);
    }
  };

  // permission check
  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text>Permission Not Granted - {permission?.status}</Text>
        <StatusBar style="auto" />
        <Button title="Request Permission" onPress={requestPermission}></Button>
      </View>
    );
  }

  // main UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Working With Firebase and Image Picker</Text>
        <MyFilesList files={files} />
        <StatusBar style="auto" />
        <Button title="Take Picture" onPress={takePhoto}></Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
