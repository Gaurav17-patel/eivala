import { View, StyleSheet, StatusBar } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { colors } from "../themes";
import { ConstantUtils } from "../utils";

const StatusbarComponent = ({ backgroundColor, ...props }) => {
  return (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    height: moderateScale(56),
    width: "100%",
    backgroundColor: colors.redColor,
  },
  statusBar: { height: ConstantUtils.STATUSBAR_HEIGHT },
});

export default StatusbarComponent;
