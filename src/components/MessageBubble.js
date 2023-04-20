import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { moderateScale } from '../utils/ResponsiveUi';
import { fonts, colors } from '../themes';

// Props info list
// 1. mine (bool) => renders blue bubble on right
// 2. text (string) => renders text message
// 3. image (image file) => renders image inside bubble

// Declare component
class MessageBubble extends React.Component {
  render() {
    return (
      <View
        style={[
          styles.message,
          this.props.mine ? styles.mine : styles.not_mine,
        ]}
      >
        <View
          style={[
            styles.cloud,
            {
              backgroundColor: this.props.mine ? 'white' : colors.redColor,
            },
          ]}
        >
          {this.props.image ? (
            <Image
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                alignSelf: this.props.mine ? "flex-start" : "flex-end",
              }}
              borderRadius={10}
              source={{ uri: this.props.image }}
            />
          ) : null}
          {this.props.text ? (
            <Text
              style={[
                styles.text,
                {
                  color: this.props.mine ? 'black' : 'white',
                },
              ]}
            >
              {this.props.text}
            </Text>
          ) : null}
          {this.props.date ? (
            <Text
              style={[
                styles.textDate,
                {
                  color: this.props.mine ? 'black' : 'white',
                },
              ]}
            >
              {this.props.date}
            </Text>
          ) : null}

          <View
            style={[
              styles.arrow_container,
              this.props.mine
                ? styles.arrow_left_container
                : styles.arrow_right_container,
            ]}
          >
            <Svg
              style={this.props.mine ? styles.arrow_left : styles.arrow_right}
              width={moderateScale(15.5, 0.6)}
              height={moderateScale(17.5, 0.6)}
              viewBox="32.484 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5"
              stroke={this.props.mine ? colors.lightGray : colors.redColor}
            >
              <Path
                d={
                  this.props.mine
                    ? 'M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z'
                    : 'M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z'
                }
                fill={this.props.mine ? 'white' : colors.redColor}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
        <View
          style={{
            height: moderateScale(24),
            width: moderateScale(24),
            borderRadius: moderateScale(12),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.darkGray,
            alignSelf: 'flex-end',
            top: moderateScale(5),
            left: moderateScale(5),
          }}
        >
          {this.props.mine ? (
            <Text
              style={{
                fontWeight: '800',
                fontFamily: fonts.PoppinsRegular,
                color: colors.white,
                fontSize: moderateScale(10),
              }}
            >
              {this.props.userName}
            </Text>
          ) : (
            <Image
              source={{ uri: this.props.image }}
              style={styles.customerStatusImg}
            />
          )}
        </View>
      </View>
    );
  }
}

export default MessageBubble;

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    marginVertical: moderateScale(7, 2),
  },
  mine: {
    marginLeft: 20,
  },
  not_mine: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  cloud: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  textDate: {
    paddingTop: 3,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: fonts.PoppinsRegular,
    color: colors.white,
    fontSize: moderateScale(9),
    textAlign: 'right',
  },
  text: {
    paddingTop: 3,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: fonts.PoppinsRegular,
    color: colors.white,
    fontSize: moderateScale(13),
  },
  customerStatusImg: {
    height: moderateScale(24),
    width: moderateScale(24),
    resizeMode: "contain",
    // borderWidth: 2,
    // borderColor: colors.colorGray,
  },
  arrow_container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrow_left_container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  arrow_right_container: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  arrow_left: {
    left: moderateScale(-6, 0.5),
  },
  arrow_right: {
    right: moderateScale(-6, 0.5),
  },
});
