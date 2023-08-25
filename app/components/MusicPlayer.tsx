import { StyleSheet, Text, View } from "react-native";
import { selectIntent } from "../store/features/statusSlice";
import { useSelector } from "react-redux";
import IonIcon from "react-native-vector-icons/Ionicons";
import WebView from "react-native-webview";

export default function MusicPlayer() {
  const intent = useSelector(selectIntent);

  return (
    <View style={styles.container}>
      <View style={styles.visualizer}>
        <WebView source={require("../resources/html/visualizer.html")} />
      </View>
      <View style={styles.overlay}></View>
      <View style={styles.nowPlaying}>
        <IonIcon name="musical-notes" size={56} />
        <View>
          <Text style={styles.label}>Estás escuchando</Text>
          <Text style={styles.nowPlayingText}>
            <Text style={styles.title}>{intent.title}</Text> de{" "}
            <Text style={styles.artist}>{intent.artist}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    gap: 10,
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    color: "#fefefe",
  },
  nowPlayingText: {
    fontSize: 24,
  },
  title: {
    color: "#ec407a",
    textTransform: "uppercase",
  },
  artist: {
    color: "#ab47bc",
    textTransform: "uppercase",
  },
  visualizer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  nowPlaying: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "transparent",
  },
});
