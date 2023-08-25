import { Dimensions, StyleSheet, View } from "react-native";
import {
  selectIntent,
  selectSpeechResult,
  setExpression,
  setExpressionPosition,
  setIntent,
} from "../store/features/statusSlice";
import { useSelector } from "react-redux";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import { useEffect, useRef, useContext, useState } from "react";
import { getIntent } from "../services/intents.service";
import { useDispatch } from "react-redux";
import Face from "../components/Face";
import { btMACAddress, faces } from "../resources";
import MusicPlayer from "../components/MusicPlayer";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { AppContext } from "../context/AppContex";

export default function Home() {
  const [widthScreen, setWidthScreen] = useState(0);
  const [heightScreen, setHeightScreen] = useState(0);
  const [rotation, setRotation] = useState("portrait");
  //from store
  const speechResult = useSelector(selectSpeechResult);
  const intent = useSelector(selectIntent);
  const dispatch = useDispatch();
  const { porcupineManager } = useContext(AppContext);

  useEffect(() => {
    const width = Dimensions.get("screen").width;
    setWidthScreen(width);
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setWidthScreen(width);
      setHeightScreen(height);
      if (width > height) {
        setRotation("landscape");
      } else {
        setRotation("portrait");
      }
    });
  }, []);

  //Refs
  const videoPlayerRef = useRef<YoutubeIframeRef>(null);

  //when intent change
  useEffect(() => {
    if (intent) {
      porcupineManager.current.start();
      dispatch(setIntent(intent));
      onIntentChange();
    }
  }, [intent]);

  function onIntentChange() {
    switch (intent.intent) {
      case "playVideo":
        dispatch(setExpressionPosition("second"));
        dispatch(setExpression(faces.happy));
        break;
      case "playMusic":
        dispatch(setExpressionPosition("second"));
        dispatch(setExpression(faces.happy));
        break;
      case "moveIntent":
        dispatch(setExpressionPosition("first"));
        dispatch(setExpression(faces.serius));
        if (intent.moveTo) {
          RNBluetoothClassic.writeToDevice(btMACAddress, intent.moveTo);
        }
        break;
    }
  }

  useEffect(() => {
    if (handleLocaleFastIntents()) {
      return;
    }

    if (speechResult && speechResult !== "") {
      getIntent(speechResult).then((result) => dispatch(setIntent(result)));
    }
  }, [speechResult]);

  function handleOnEndVideo(state: string) {
    if (state === "ended") {
      dispatch(setIntent(null));
      dispatch(setExpression(faces.sleep));
      dispatch(setExpressionPosition("first"));
    }
  }

  function handleLocaleFastIntents() {
    let isLocalFastIntent = false;

    //Check for local intents
    switch (speechResult) {
      case "derecha":
        dispatch(setIntent({ intent: "moveIntent", moveTo: "right" }));
        isLocalFastIntent = true;
        break;
      case "izquierda":
        dispatch(setIntent({ intent: "moveIntent", moveTo: "left" }));
        isLocalFastIntent = true;
        break;
      case "atrás":
        dispatch(setIntent({ intent: "moveIntent", moveTo: "back" }));
        isLocalFastIntent = true;
        break;
      case "adelante":
        dispatch(setIntent({ intent: "moveIntent", moveTo: "forward" }));
        isLocalFastIntent = true;
        break;
      case "foto":
        dispatch(setIntent({ intent: "takePhotoIntent" }));
        isLocalFastIntent = true;
        break;
      case "captura de pantalla":
        dispatch(setIntent({ intent: "takeSSIntent" }));
        isLocalFastIntent = true;
        break;
    }

    return isLocalFastIntent;
  }

  return (
    <View style={styles.layout}>
      {intent && intent.intent === "playMusic" && <MusicPlayer />}
      <Face />
      {intent && intent.id && (
        <YoutubePlayer
          videoId={intent.id}
          height={
            intent.intent === "playVideo"
              ? rotation === "portrait"
                ? widthScreen
                : heightScreen
              : 0
          }
          width={
            intent.intent === "playVideo"
              ? rotation === "portrait"
                ? widthScreen
                : widthScreen - heightScreen / 2
              : 0
          }
          play
          ref={videoPlayerRef}
          onChangeState={(state) => handleOnEndVideo(state)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    backgroundColor: "black",
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  faceImage: {
    tintColor: "white",
    width: "100%",
  },
});
