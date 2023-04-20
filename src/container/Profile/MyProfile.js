import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { images, fonts, colors } from "../../themes";
import strings from "../../themes/strings";
import { moderateScale } from "../../utils/ResponsiveUi";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import {
  NetworkUtils,
  FunctionUtils,
  PreferenceManager,
  PreferenceKey,
} from "../../utils";
import InitialHeader from "../../components/InitialHeader";
import AbsoluteBtn from "../../components/AbsoluteBtn";
import * as globals from "../../utils/globals";
import Loader from "../../components/LoaderOpacity.js";

let TAG = "My Profile:==";
class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      contactNum: "",
      isLoading: false,
      userProfilePic: '',
    };
  }

  componentDidMount() {
    this.editProfileBtnPress = debounce(
      this.editProfileBtnPress.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      }
    );
    this.getMyProfileData();
  }

  async getMyProfileData() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getMyProfile(globals.tokenValue).then(async () => {
        const { myProfileData, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (myProfileData && myProfileData.hasOwnProperty("data")) {
          this.setState({
            fname: myProfileData.data.first_name,
            lname: myProfileData.data.last_name,
            email: myProfileData.data.email,
            contactNum: myProfileData.data.phone,
            userProfilePic: myProfileData.data.profile_image_url,
            isLoading: false,
          });
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(myProfileData.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  getUserProfile = () => {
    setTimeout(() => {
      this.getMyProfileData();
    }, 10);
  };

  editProfileBtnPress() {
    Actions.EditProfile({ getUserProfile: this.getUserProfile });
  }

  render() {
    const {
      fname,
      lname,
      contactNum,
      email,
      userProfilePic,
      isLoading,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <InitialHeader
          leftIconPress={() => Actions.drawerOpen(this.props.open)}
          icon={images.drawer}
          headerTxtMain={strings.myProfile}
        />
        <ScrollView bounces={false} style={{ flex: 1 }}>
          <View style={styles.userDetailsMainView}>
            <View style={styles.profileimgView}>
              <Image
                source={{ uri: userProfilePic }}
                key={userProfilePic}
                style={styles.userImgStyle}
              />
            </View>
            <Text numberOfLines={1} style={styles.userName}>
              {fname} {lname}
            </Text>
            <Text numberOfLines={1} style={styles.userEmail}>
              {email}
            </Text>
            <Text numberOfLines={1} style={styles.userEmail}>
              {contactNum}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.changePasswordView}
            onPress={() => Actions.ChangePassword()}
          >
            <Text style={styles.chngPassTxt}>{strings.changePass}</Text>
            <Image source={images.rightSideArr} style={styles.sideArr} />
          </TouchableOpacity>
        </ScrollView>
        <AbsoluteBtn
          btnTxt={strings.editProfile}
          onPressBtn={() => this.editProfileBtnPress()}
        />
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    myProfileData: state.profileReducer.myProfileData, //accessing the redux state
    isloading: state.profileReducer.isLoading,
    msgError: state.transcationReducer.msgError, //accessing the redux state
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userDetailsMainView: {
    height: height * 0.33,
    // width: width - moderateScale(30),
    backgroundColor: colors.white,
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.12),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
  },
  changePasswordView: {
    height: height * 0.065,
    //width: width - moderateScale(30),
    backgroundColor: colors.white,
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.12),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateScale(15),
  },
  chngPassTxt: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    fontWeight: "500",
  },
  sideArr: {
    height: moderateScale(12),
    width: moderateScale(12),
    resizeMode: "contain",
  },
  profileimgView: {
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: (height * 0.15) / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.7,
    borderColor: colors.colorGray,
  },
  userImgStyle: {
    height: height * 0.15,
    width: height * 0.15,
    borderRadius: (height * 0.15) / 2,
    resizeMode: "contain",
  },
  buttonStyle: {
    height: 50,
    // width: width - moderateScale(30),
    backgroundColor: colors.redColor,
    borderRadius: moderateScale(12),
    marginTop: moderateScale(15),
    marginHorizontal: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  userName: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontWeight: "500",
    marginRight: moderateScale(10),
    marginTop: moderateScale(15),
  },
  userEmail: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.colorGray,
    marginRight: moderateScale(10),
  },
  btnTxt: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.PoppinsRegular,
    textTransform: "uppercase",
  },
});
