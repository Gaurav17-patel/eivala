import { TextInput, View, TouchableOpacity, Image } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { images, fonts, colors } from "../themes";

const TextField = React.forwardRef((props, ref) => {
  return (
    <View
      style={{
        height: props.height,
        width: props.width,
        backgroundColor: colors.white,
        flexDirection: "row",
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginRight: props.marginRight,
        marginLeft: props.marginLeft,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: moderateScale(1),
        },
        shadowOpacity: moderateScale(0.12),
        shadowRadius: moderateScale(10),
        elevation: moderateScale(5),
        borderRadius: moderateScale(10),
      }}
    >
      <View
        style={{
          height: props.height,
          //width: '16%',
          marginHorizontal: moderateScale(13),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={props.icon}
          style={{
            height: moderateScale(20),
            width: moderateScale(20),
            resizeMode: "contain",
          }}
        />
      </View>
      <View
        style={{
          height: props.height - moderateScale(10),
          flex: 1,
          //width: '82%',
          flexDirection: 'row',
          // backgroundColor: "pink",
          alignSelf: "center",
        }}
      >
        <TextInput
          style={{
            height: "100%",
            width: "85%",
            backgroundColor: "white",
            fontFamily: fonts.PoppinsRegular,
            fontSize: moderateScale(13),
            paddingBottom: 0,
            paddingTop: 0,
            borderWidth: 0,
            color: colors.lightBlack,
          }}
          editable={props.availToEdit ? props.availToEdit : true}
          placeholder={props.placeHolder}
          secureTextEntry={props.isPassword ? true : false}
          onChangeText={(text) => props.onChangeText(text)}
          value={props.value}
          onSubmitEditing={props.onSubmitEditing}
          ref={ref}
          returnKeyType={props.returnKeyType}
          maxLength={props.maxLength}
          keyboardType={props.isEmail ? "email-address" : props.numberpad ? "phone-pad" : "default"}
          autoCapitalize={props.autoCapitalize}
        />
        {/* {props.isHideShowPass && props.isPasswordLength > 0 ? ( */}

        {props.isHideShowPass ? (
          <TouchableOpacity onPress={() => props.onPressHideShow()}>
            <Image
              source={
                props.passwordStatus
                  ? images.password_hide
                  : images.password_show
              }
              style={{
                height: moderateScale(28),
                width: moderateScale(28),
                top: moderateScale(5),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});
export default TextField;
