// import { TextInput, View, TouchableOpacity, Image } from "react-native";
// import React, { Component } from "react";
// import { moderateScale } from "../utils/ResponsiveUi";
// import { images, fonts, colors } from "../themes";

/* eslint-disable no-dupe-keys */
import { TextInput, Text, View } from "react-native";
import React, { Component } from "react";
import { moderateScale } from "../utils/ResponsiveUi";
import { images, fonts, colors } from "../themes";

const TextFieldWithoutIcon = React.forwardRef((props, ref) => {
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
      <TextInput
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          fontFamily: fonts.PoppinsRegular,
          fontSize: moderateScale(13),
          paddingBottom: 0,
          paddingTop: 0,
          color: colors.lightBlack,
          paddingLeft: moderateScale(props.paddingLeft ? props.paddingLeft : 13),
          textAlignVertical: 'top',
          paddingTop: moderateScale(props.paddingTop),
        }}
        placeholder={props.placeHolder}
        secureTextEntry={props.isPassword ? true : false}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        onSubmitEditing={props.onSubmitEditing}
        ref={ref}
        returnKeyType={props.returnKeyType}
        maxLength={props.maxLength}
        keyboardType={props.numberpad ? "phone-pad" : "default"}
      />
    </View>
  );
});

export default TextFieldWithoutIcon;

// const TextFieldWithoutIcon = ({
//   onChangeText,
//   placeHolder,
//   isPassword,
//   icon,
//   height,
//   width,
//   value,
//   marginBottom,
//   marginTop,
//   marginRight,
//   marginLeft,
//   numberpad,
//   isMultiline,
//   paddingTop,
//   paddingLeft,
// }) => {
//   return (
//     <View
//       style={{
//         height,
//         width,
//         backgroundColor: colors.white,
//         flexDirection: "row",
//         marginTop,
//         marginBottom,
//         marginRight,
//         marginLeft,
//         shadowColor: "#000",
//         shadowOffset: {
//           width: 0,
//           height: moderateScale(1),
//         },
//         shadowOpacity: moderateScale(0.12),
//         shadowRadius: moderateScale(4),
//         elevation: moderateScale(5),
//         borderRadius: moderateScale(10),
//       }}
//     >
//       <TextInput
//         style={{
//           height: "100%",
//           width: "100%",
//           backgroundColor: "white",
//           fontFamily: fonts.PoppinsRegular,
//           fontSize: moderateScale(13),
//           paddingBottom: 0,
//           paddingTop: 0,
//           color: colors.lightBlack,
//           paddingLeft: moderateScale(paddingLeft ? paddingLeft : 13),
//           textAlignVertical: 'top',
//           paddingTop: moderateScale(paddingTop),
//         }}
//         multiline={isMultiline}
//         placeholder={placeHolder}
//         secureTextEntry={isPassword ? true : false}
//         onChangeText={(text) => onChangeText(text)}
//         value={value}
//         keyboardType={numberpad ? "phone-pad" : "default"}
//       />
//     </View>
//   );
// };
