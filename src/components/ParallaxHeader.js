import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { images, fonts, strings, colors } from "../themes";
const { width, height } = Dimensions.get("window");
import StatusbarComponent from "./Statusbar";
import { ConstantUtils } from "../utils";

const ParallaxHeader = ({
  icon,
  rightIcon,
  headerTxtMain,
  leftIconPress,
  rightIconPress,
  firstRightIconPress,
  isSkip,
  isTwoRightIcon,
  searchBar,
  isSkipRegistration,
  searchBarClose,
  searchValue,
  onChangeSearchText,
  onSearchTextClear,
  onBackLeftPress,
  notificationsCount,
}) => {
  return (
    <View style={styles.mainView}>
      <StatusbarComponent
        backgroundColor={colors.redColor}
        barStyle="light-content"
      />
      <View key="sticky-header" style={styles.stickySection}>
        {!searchBar ? (
          <TouchableOpacity
            hitSlop={ConstantUtils.hitSlop.twenty}
            onPress={leftIconPress}
            style={{ borderWidth: 0 }}
          >
            <Image
              source={icon}
              style={[styles.drawerImg, { tintColor: colors.white }]}
            />
          </TouchableOpacity>
        ) : null}
        <View style={{ borderWidth: 0, flexDirection: 'column' }}>
          {searchBar ? (
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 0,
                top: moderateScale(-35),
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 0,
                  top: moderateScale(35),
                  left: moderateScale(8),
                  marginRight: moderateScale(6),
                }}
                onPress={searchBarClose}
              >
                <Image source={images.backLeftArr} style={styles.backBtn} />
              </TouchableOpacity>
              <View
                style={[
                  styles.searchViewDesign,
                  { borderWidth: 0, top: moderateScale(18) },
                ]}
              >
                <Image source={images.search} style={styles.searchIcon} />
                <TextInput
                  placeholder={'Search'}
                  placeholderTextColor={colors.colorGray}
                  onChangeText={onChangeSearchText}
                  value={searchValue}
                  style={styles.searchTexts}
                />
                {searchValue.length > 0 ? (
                  <TouchableOpacity
                    style={{
                      borderWidth: 0,
                      right: moderateScale(10),
                    }}
                    onPress={onSearchTextClear}
                  >
                    <Image
                      source={images.close}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(20),
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}
          <View
            style={{
              borderWidth: 0,
              alignSelf: 'center',
              top: searchBar == true ? moderateScale(-48) : null,
            }}
          >
            {!searchBar ? (
              <Text style={[styles.headerTitleTxt, { color: colors.white }]}>
                {headerTxtMain}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {isTwoRightIcon ? (
            <TouchableOpacity
              hitSlop={ConstantUtils.hitSlop.twenty}
              style={
                searchBar
                  ? {
                      // top: moderateScale(-4),
                      left: moderateScale(-16),
                      borderWidth: 0,
                    }
                  : null
              }
              onPress={firstRightIconPress}
            >
              <Image
                source={isTwoRightIcon}
                style={isSkip ? styles.skipBtn : styles.drawerImg}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            hitSlop={ConstantUtils.hitSlop.twenty}
            onPress={rightIconPress}
            style={{ borderWidth: 0, left: moderateScale(-10) }}
          >
            {notificationsCount && notificationsCount !== 0 ? (
              <View style={styles.notification}>
                <Text style={{ color: colors.colorBlack }}>
                  {notificationsCount}
                </Text>
              </View>
            ) : null}
            {/* {searchValue && searchValue.length < 0 ? ( */}
            <Image
              source={rightIcon}
              style={isSkip ? styles.skipBtn : styles.drawerImg}
            />
            {/* ) : null} */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ParallaxHeader;

const styles = StyleSheet.create({
  headerMainView: {
    height: height * 0.19,
    borderWidth: 1,
    borderColor: colors.lightGrayDown,
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.03,
    shadowRadius: moderateScale(10),
    elevation: 1.5,
    // backgroundColor:'red',
    // shadowColor: colors.blackShade,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 5,
    // borderBottomLeftRadius: moderateScale(25),
    // borderBottomRightRadius: moderateScale(25),
  },
  notification: {
    backgroundColor: colors.white,
    height: moderateScale(18),
    width: moderateScale(18),
    top: moderateScale(10),
    left: moderateScale(23),
    zIndex: moderateScale(1),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    height: moderateScale(16),
    width: moderateScale(16),
    left: moderateScale(10),
    tintColor: colors.colorGray,
    borderWidth: 0,
  },
  searchTexts: {
    fontSize: 15,
    width: '90%',
    borderWidth: 0,
    paddingLeft: 25,
    paddingBottom: 4,
  },
  searchViewDesign: {
    height: 40,
    width: '86%',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 0,
    padding: moderateScale(5),
    // left: moderateScale(20),
    margin: moderateScale(10),
    marginRight: moderateScale(-20),
    borderRadius: moderateScale(23),
    alignItems: 'center',
  },
  headerMainTopView: {
    height: (height * 0.19) / 2.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: height * 0.04,
  },

  headerMainBottomView: {
    //flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerShadowLine: {
    height: 0.5,
    shadowColor: colors.blackShade,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
  },
  drawerImg: {
    height: moderateScale(23),
    width: moderateScale(23),
    resizeMode: "contain",
    // left:moderateScale(-150),
    marginHorizontal: moderateScale(12),
    tintColor: colors.white,
  },
  skipBtn: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: "contain",
    top: moderateScale(-12),
    marginRight: moderateScale(10),
    // marginHorizontal: moderateScale(12),
    tintColor: colors.white,
  },
  backBtn: {
    height: moderateScale(15),
    width: moderateScale(20),
  },
  logoImg: {
    height: moderateScale(40),
    width: moderateScale(80),
    resizeMode: "contain",
  },
  headerTitleTxt: {
    fontSize: moderateScale(20),
    fontWeight: "500",
    fontFamily: fonts.PoppinsRegular,
    color: colors.colorBlack,
  },
  stickySection: {
    backgroundColor: colors.redColor,
    height: moderateScale(50),
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "center",
    borderWidth: 0,
    marginVertical: moderateScale(height * 0.02),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    top: moderateScale(-2),
  },
  mainView: {
    backgroundColor: colors.redColor,
    height: moderateScale(50),
  },
});
