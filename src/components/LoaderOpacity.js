import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../themes';
import { moderateScale } from "../utils/ResponsiveUi";

const LoaderOpacity = () => {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
      }}
    >
      <View
        style={{
          backgroundColor: colors.redColor,
          height: moderateScale(100),
          width: moderateScale(100),
          borderRadius: moderateScale(15),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size={"large"}
          animating={true}
          color={colors.white}
        />
        <Text
          style={{
            marginTop: moderateScale(10),
            color: colors.white,
            fontSize: moderateScale(15),
            fontFamily: fonts.PoppinsMedium,
          }}
        >
          {"Loading"}
        </Text>
      </View>
    </View>
  );
};

export default LoaderOpacity;
