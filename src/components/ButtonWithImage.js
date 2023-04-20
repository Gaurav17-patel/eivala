import { TouchableOpacity, Text, View, Image } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { colors, images } from "../themes";

const Button = ({
  buttonTitle,
  height,
  width,
  backgroundColor,
  textStyle,
  onButtonPress,
  borderRadiusApply,
  icon,
  marginTop,
  marginBottom,
  marginRight,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onButtonPress()}
      style={{
        height,
        width,
        backgroundColor: backgroundColor,
        flexDirection: "row",
        shadowColor: "#000",
        marginTop,
        marginBottom,
        shadowOffset: {
          width: 0,
          height: moderateScale(1),
        },
        shadowOpacity: moderateScale(0.12),
        shadowRadius: moderateScale(4),
        elevation: moderateScale(5),
        borderRadius: moderateScale(10),
      }}
    >
      <View style={{ flexDirection: 'row', height: '100%', width: '100%' }}>
        <View
          style={{ height: '100%', width: '80%', justifyContent: 'center' }}
        >
          <Text
            style={{
              paddingLeft: 13,
              color: colors.colorGray,
              fontSize: moderateScale(12),
              left: moderateScale(8),
            }}
          >
            {buttonTitle}
          </Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "20%",
            justifyContent: "center",
            alignItems: marginRight ? 'flex-start' : "center",
          }}
        >
          <Image
            source={images.menuDownArrow}
            style={{
              height: marginRight ? moderateScale(8) : moderateScale(12),
              width: marginRight ? moderateScale(8) : moderateScale(12),
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Button;
