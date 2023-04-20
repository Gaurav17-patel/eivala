import { TouchableOpacity, Text } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";

const Button = ({
  buttonTitle,
  height,
  width,
  backgroundColor,
  marginBottom,
  textStyle,
  onButtonPress,
  borderWidth,
  borderRadiusApply,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onButtonPress()}
      style={{
        height: height,
        width: width,
        borderWidth: borderWidth,
        backgroundColor: backgroundColor,
        borderRadius: borderRadiusApply ? moderateScale(borderRadiusApply)  : moderateScale(13),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={textStyle}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default Button;
