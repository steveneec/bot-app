import { Dimensions, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
} from "react-native-reanimated";
import {
  selectExpression,
  selectExpressionPosition,
} from "../store/features/statusSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Face() {
  const [widthScreen, setWidthScreen] = useState(0);
  const expression = useSelector(selectExpression);
  const expressionPosition = useSelector(selectExpressionPosition);
  const right = useSharedValue(Dimensions.get("screen").width / 4);
  const top = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    const width = Dimensions.get("screen").width;
    setWidthScreen(width);
    Dimensions.addEventListener("change", ({ window: { width, height } }) => {
      setWidthScreen(width);
      handleOnPositionChange();
    });
  }, []);

  useEffect(() => {
    handleOnPositionChange();
  }, [expressionPosition]);

  function handleOnPositionChange() {
    cancelAllAnimations();

    switch (expressionPosition) {
      case "first":
        toFirstPlane();
        break;
      case "second":
        toSecondPlane();
        break;
      default:
        toFirstPlane();
        break;
    }
  }

  function cancelAllAnimations() {
    cancelAnimation(right);
    cancelAnimation(top);
    cancelAnimation(scale);
  }

  const faceContainerStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: widthScreen * scale.value,
      height: widthScreen * scale.value,
      borderRadius: 20,
      margin: 20,
      justifyContent: "center",
      alignItems: "center",
      top: top.value,
      right: right.value,
      zIndex: 999,
      backgroundColor: "#00000060",
    };
  });

  function toSecondPlane() {
    right.value = withTiming(0, { duration: 500 });
    scale.value = withTiming(0.1, { duration: 500 });
  }

  function toFirstPlane() {
    right.value = withTiming(Dimensions.get("screen").width / 4, {
      duration: 500,
    });
    scale.value = withTiming(0.4, { duration: 500 });
  }

  function dance() {
    top.value = withRepeat(
      withSequence(
        withTiming(0),
        withTiming(10),
        withTiming(5),
        withTiming(12),
        withTiming(0)
      ),
      -1
    );
  }

  return (
    <Animated.View style={faceContainerStyle}>
      <Image
        source={expression}
        style={styles.faceImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  faceImage: {
    tintColor: "white",
    width: "100%",
  },
});
