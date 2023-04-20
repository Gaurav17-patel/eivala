import { Text, View, Image } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { colors, images } from "../themes";

const NoDataView = ({ dataTitle }) => {
  return (
    <View
      style={{
        height: moderateScale(550),
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={images.noData}
        style={{
          height: moderateScale(300),
          width: moderateScale(300),
          resizeMode: 'contain',
        }}
      />
      {/* <Text style={{ fontSize: moderateScale(20), color: colors.colorRed }}>
        {dataTitle}
      </Text> */}
    </View>
  );
};

export default NoDataView;
