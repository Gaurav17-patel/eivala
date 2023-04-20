import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions,
} from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { images, fonts, colors } from "../themes";
const { height } = Dimensions.get("window");
import StatusbarComponent from "./Statusbar";
import { ConstantUtils } from "../utils";
import { PreferenceKey, PreferenceManager } from "../utils";

const InitialHeader = ({
  icon,
  rightIcon,
  headerTxtMain,
  leftIconPress,
  rightIconPress,
  firstRightIconPress,
  isSkipRegistration,
  isTwoRightIcon,
  searchBar,
  searchBarClose,
  searchValue,
  onChangeSearchText,
  onSearchTextClear,
  onBackLeftPress,
  notificationsCount,
}) => {
  return (
    <View style={styles.headerMainView}>
      <StatusbarComponent
        backgroundColor={colors.white}
        barStyle="light-content"
      />
      <View style={styles.headerMainTopView}>
        {!searchBar ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              hitSlop={ConstantUtils.hitSlop.twenty}
              onPress={leftIconPress}
            >
              <Image source={icon} style={styles.drawerImg} />
            </TouchableOpacity>
            {searchBar ? null : (
              <Image source={images.mainLogo} style={styles.logoImg} />
            )}
          </View>
        ) : null}
        <View style={{ borderWidth: 0 }}>
          {searchBar ? (
            <View
              style={{
                flexDirection: 'row',
                borderWidth: 0,
              }}
            >
              <TouchableOpacity
                style={{
                  borderWidth: 0,
                  top: moderateScale(10),
                  left: moderateScale(20),
                }}
                onPress={searchBarClose}
              >
                <Image source={images.backLeftArr} style={styles.backBtn} />
              </TouchableOpacity>
              <View style={styles.searchViewDesign}>
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
                      right: moderateScale(20),
                    }}
                    onPress={onSearchTextClear}
                  >
                    <Image
                      source={images.close}
                      style={{
                        borderWidth: 0,
                        height: moderateScale(20),
                        width: moderateScale(20),
                      }}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {isTwoRightIcon ? (
            <TouchableOpacity
              hitSlop={ConstantUtils.hitSlop.twenty}
              onPress={firstRightIconPress}
              style={{ borderWidth: 0, left: moderateScale(-10) }}
            >
              <Image
                source={isTwoRightIcon}
                style={isSkipRegistration ? styles.skipBtn : styles.drawerImg}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            hitSlop={ConstantUtils.hitSlop.twenty}
            onPress={rightIconPress}
          >
            {notificationsCount && notificationsCount !== 0 ? (
              <View style={styles.notification}>
                <Text style={{ color: colors.white, fontSize: moderateScale(10) }}>
                  {notificationsCount}
                </Text>
              </View>
            ) : null}
            <Image
              source={rightIcon}
              style={isSkipRegistration ? styles.skipBtn : styles.drawerImg}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerMainBottomView}>
        <Text
          style={[styles.headerTitleTxt, { marginBottom: moderateScale(2) }]}
        >
          {headerTxtMain}
        </Text>
      </View>
    </View>
  );
};

export default InitialHeader;

const styles = StyleSheet.create({
  headerMainView: {
    height: moderateScale(120),
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    shadowColor: colors.gray,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 5,
    backgroundColor: '#fff',
  },
  notification: {
    backgroundColor: colors.redColor,
    height: moderateScale(20),
    width: moderateScale(20),
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
    paddingBottom: 3,
    paddingTop: moderateScale(5),
  },
  searchViewDesign: {
    height: 40,
    width: '85%',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    padding: moderateScale(5),
    left: moderateScale(25),
    // margin: moderateScale(10),
    // marginLeft: moderateScale(30),
    // marginRight: moderateScale(-20),
    borderRadius: moderateScale(23),
    alignItems: 'center',
  },
  backBtn: {
    height: moderateScale(15),
    width: moderateScale(20),
  },
  headerMainTopView: {
    height: moderateScale(120) / 2.8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateScale(7),
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
    marginHorizontal: moderateScale(12),
  },
  skipBtn: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: "contain",
    top: moderateScale(-6),
    marginRight: moderateScale(10),
    marginHorizontal: moderateScale(12),
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
    height: Platform.OS == "ios" ? height * 0.11 : height * 0.08,
    flexDirection: "row",
    justifyContent: "space-between",
    //alignItems: "center",
    marginVertical: moderateScale(height * 0.02),
  },
});
