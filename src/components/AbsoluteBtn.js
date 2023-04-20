import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { moderateScale } from "../utils/ResponsiveUi";
import { images, fonts, colors } from "../themes";
const { width, height } = Dimensions.get("window");
import strings from "../themes/strings";

const AbsoluteBtn = ({
  btnTxt,
  onPressBtn,
  btnType,
  onPressBtnLeft,
  onPressBtnRight,
  btnRightTxt,
  btnLeftTxt,
}) => {
  return (
    <View>
      {btnType == "half" ? (
        <View
          style={{ flexDirection: "row", marginHorizontal: moderateScale(15) }}
        >
          <TouchableOpacity
            style={styles.buttonStyleHalfLeft}
            onPress={onPressBtnLeft}
          >
            <Text style={styles.btnTxt}>{btnLeftTxt}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyleHalfRight}
            onPress={onPressBtnRight}
          >
            <Text style={styles.btnTxt}>{btnRightTxt}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.buttonStyle} onPress={onPressBtn}>
          <Text style={styles.btnTxt}>{btnTxt}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AbsoluteBtn;

const styles = StyleSheet.create({
  buttonStyle: {
    height: moderateScale(45),
    // width: width - moderateScale(30),
    backgroundColor: colors.redColor,
    borderRadius: moderateScale(12),
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  buttonStyleHalfLeft: {
    height: moderateScale(45),
    flex: 1,
    marginRight: moderateScale(7.5),
    //width: width *0.5,
    backgroundColor: colors.redColor,
    borderRadius: moderateScale(12),
    marginTop: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  buttonStyleHalfRight: {
    height: moderateScale(45),
    flex: 1,
    marginLeft: moderateScale(7.5),
    //width: width *0.5,
    backgroundColor: colors.redColor,
    borderRadius: moderateScale(12),
    marginTop: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  btnTxt: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.PoppinsRegular,
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
