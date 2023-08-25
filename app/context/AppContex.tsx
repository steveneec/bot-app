import { PropsWithChildren, createContext, useEffect, useRef } from "react";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from "@react-native-voice/voice";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpression,
  setIntent,
  setIsBusy,
  setIsListening,
  setSpeechResult,
  selectExpressionPosition,
  setExpressionPosition,
} from "../store/features/statusSlice";
import { StatusBar, PermissionsAndroid } from "react-native";
import { btMACAddress, faces } from "../resources";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { PorcupineManager } from "@picovoice/porcupine-react-native";

export const AppContext = createContext<{ porcupineManager: any }>({
  porcupineManager: null,
});

export function AppContextProvider({ children }: PropsWithChildren) {
  const porcupineManager = useRef<any>();

  async function detectionCallback(keywordIndex: number) {
    if (keywordIndex === 0) {
      console.log("[Wakeup keyword detected!]");
      RNBluetoothClassic.writeToDevice(btMACAddress, "wkup"); //wakeup movement
      await porcupineManager.current.stop();
      await Voice.start("es-ES");
    }
  }

  function proccessErrorCallback() {}

  async function initVoiceWakeup() {
    porcupineManager.current = await PorcupineManager.fromKeywordPaths(
      "OuwC7fVPYET2o/e33UhwBVEE/41t7Fy12V2BJ/yrbC2ppCwcm0gtgA==",
      ["porcupine/wakeupword/Pet-bot_es_android_v2_2_0.ppn"],
      detectionCallback,
      proccessErrorCallback,
      "porcupine/porcupine_params_es.pv"
    );
    await porcupineManager.current.start();
  }

  //On init
  useEffect(() => {
    initVoiceWakeup();

    PermissionsAndroid.request("android.permission.BLUETOOTH_CONNECT").then(
      (res) => {
        if (res === "granted") {
          RNBluetoothClassic.connectToDevice("00:21:13:00:26:7D").then((conn) =>
            console.log(conn)
          );
        }
      }
    );
  }, []);

  const dispatch = useDispatch();

  const expressionPosition = useSelector(selectExpressionPosition);

  useEffect(() => {
    console.log(expressionPosition);
  }, [expressionPosition]);

  useEffect(() => {
    StatusBar.setHidden(true);

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  function onSpeechStart(e: SpeechStartEvent) {
    dispatch(setSpeechResult(""));
    dispatch(setIntent(null));
    dispatch(setIsListening(true));
    dispatch(setExpression(faces.happy));
    dispatch(setExpressionPosition("first"));
  }

  function onSpeechEnd(e: SpeechEndEvent) {
    dispatch(setIsListening(false));
    dispatch(setIsBusy(true));
    dispatch(setExpression(faces.think));
  }

  function onSpeechResults(e: SpeechResultsEvent) {
    if (e.value) {
      dispatch(setSpeechResult(e.value[0]));
    } else {
      dispatch(setIsBusy(false));
    }
  }

  function onSpeechError(e: SpeechErrorEvent) {
    dispatch(setExpression(faces.sad));
    console.error(e);
    porcupineManager.current.start();
  }

  return (
    <AppContext.Provider value={{ porcupineManager }}>
      {children}
    </AppContext.Provider>
  );
}
