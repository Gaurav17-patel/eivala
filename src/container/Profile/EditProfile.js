import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { images, fonts, colors } from "../../themes";
import { FunctionUtils, ConstantUtils, NetworkUtils } from '../../utils';
import strings from "../../themes/strings";
import { moderateScale } from "../../utils/ResponsiveUi";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import InitialHeader from "../../components/InitialHeader";
import AbsoluteBtn from "../../components/AbsoluteBtn";
import TextField from "../../components/TextField.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import Loader from "../../components/LoaderOpacity.js";
import * as globals from "../../utils/globals";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      phnNum: "",
      profileImage: "",
      isLoading: false,
    };
    this.lnameRef = this.updateRef.bind(this, 'lname');
    this.emailRef = this.updateRef.bind(this, 'email');
    this.phnNumRef = this.updateRef.bind(this, 'phnNum');
  }

  updateRef(name, ref) {
    this[name] = ref;
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
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    this.getMyProfile();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    Actions.pop();
    return true;
  }

  async getMyProfile() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getMyProfile(globals.tokenValue).then(async () => {
        const { myProfileData } = this.props;
        if (myProfileData.hasOwnProperty("data")) {
          if (myProfileData.data.status == 1) {
            this.setState({
              fname: myProfileData.data.first_name,
              lname: myProfileData.data.last_name,
              email: myProfileData.data.email,
              phnNum: myProfileData.data.phone,
              profileImage: myProfileData.data.profile_image_url,
            });
          }
          this.setState({ isLoading: false });
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

  editProfileBtnPress() {
    if (this.state.fname.trim() == "") {
      FunctionUtils.showToast(strings.firstNameBlankError);
    } else if (this.state.lname.trim() == "") {
      FunctionUtils.showToast(strings.lastNameBlankError);
    } else if (!FunctionUtils.validateEmail(this.state.email)) {
      FunctionUtils.showToast(strings.emailValidError);
    } else if (this.state.phnNum.trim() == "") {
      FunctionUtils.showToast(strings.contactNumBlankError);
    } else if (this.state.phnNum.trim().length < 10) {
      FunctionUtils.showToast(strings.contactNumLengthError);
    } else {
      this.updateUserProfile();
    }
  }

  async updateUserProfile() {
    const { fname, lname, profileImage, phnNum } = this.state;
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      var photo = {
        uri: profileImage,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
      formData.append("first_name", fname);
      formData.append("last_name", lname);
      formData.append("phone", phnNum);
      formData.append("profile_image", photo);
      this.props.updateMyProfile(formData).then(async () => {
        const { updateProfileData, error } = this.props;
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        this.setState({ isLoading: false });
        if (updateProfileData) {
          FunctionUtils.showToast(updateProfileData.message);
          this.props.getUserProfile();
          Actions.pop();
        } else if (errorData && errorData.first_name) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.first_name[0]);
        } else if (errorData && errorData.last_name) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.last_name[0]);
        } else if (errorData && errorData.phone) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.phone[0]);
        } else if (errorData && errorData.profile_image) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.profile_image[0]);
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  /* Upload Picture */
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  _onImagePicker(index) {
    if (index == 0) {
      this.imagePicker("library");
    } else if (index == 1) {
      this.imagePicker("camera");
    }
  }

  imagePicker(type) {
    if (type == "library") {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        this.setState({ profileImage: image.path });
      });
    } else {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        this.setState({ profileImage: image.path });
      });
    }
  }

  validateName(text, type) {
    if (text != "") {
      let reg = /^[a-zA-Z]+$/;
      if (reg.test(text) === false) {
        // functionUtils.showToast(strings.validStockNumErr)
        let name = text.replace(/[^a-zA-Z]/g, "");
        if (type == "fname") {
          this.setState({ fname: name });
        } else {
          this.setState({ lname: name });
        }
        return false;
      } else {
        if (type == "fname") {
          this.setState({ fname: text });
        } else {
          this.setState({ lname: text });
        }
      }
    } else {
      if (type == "fname") {
        this.setState({ fname: "" });
      } else {
        this.setState({ lname: "" });
      }
    }
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    // this.textInput.current.focus();
    this.lname.focus();
  }

  focusEmailTextInput() {
    this.email.focus();
  }

  changeText(text) {
    this.setState({ phnNum: text });
  }

  focusPhoneNumberTextInput() {
    this.phnNum.focus();
  }

  render() {
    const { fname, isLoading, profileImage, lname, email, phnNum } = this.state;
    return (
      <View style={styles.flexView}>
        <InitialHeader
          leftIconPress={() => Actions.pop()}
          icon={images.backLeftArr}
          headerTxtMain={strings.editProfile}
        />
        <KeyboardAwareScrollView bounces={false}>
          {/* Media picker component */}
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={strings.selectMediaType}
            options={ConstantUtils.IMAGE_AND_VIDEO_OPTION}
            cancelButtonIndex={2}
            onPress={(index) => this._onImagePicker(index)}
          />

          <View style={styles.userDetailsMainView}>
            <View style={styles.profileimgView}>
              <View style={styles.userImgStyle}>
                <Image
                  source={{
                    uri: profileImage ? profileImage : null,
                  }}
                  style={styles.userImgStyle}
                />
                <TouchableOpacity
                  hitSlop={ConstantUtils.hitSlop.twenty}
                  onPress={this.showActionSheet}
                  style={styles.cameraIconStyle}
                >
                  <Image source={images.camera} style={styles.cameraImg} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.txtInputMainView}>
              <View style={{ flexDirection: "row" }}>
                <TextField
                  onChangeText={(text) => this.validateName(text, "fname")}
                  placeHolder={strings.userFName}
                  isPassword={false}
                  icon={images.email_logo}
                  height={moderateScale(50)}
                  width={"48%"}
                  returnKeyType="next"
                  value={fname}
                  onSubmitEditing={() => {
                    this.focusTextInput();
                  }}
                  marginBottom={moderateScale(13)}
                />
                <TextField
                  onChangeText={(text) => this.validateName(text, "lname")}
                  placeHolder={strings.userLName}
                  isPassword={false}
                  ref={this.lnameRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.focusPhoneNumberTextInput();
                  }}
                  icon={images.email_logo}
                  marginLeft={width * 0.03}
                  height={moderateScale(50)}
                  width={"48%"}
                  value={lname}
                  marginBottom={0}
                />
              </View>
              <View pointerEvents="none">
                <TextField
                  onChangeText={(text) => this.setState({ email: text })}
                  placeHolder={strings.userEmail}
                  isPassword={false}
                  ref={this.emailRef}
                  icon={images.email}
                  availToEdit={false}
                  height={moderateScale(50)}
                  width={"100%"}
                  returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   this.focusPhoneNumberTextInput();
                  // }}
                  value={email}
                  marginBottom={moderateScale(13)}
                />
              </View>
              <TextField
                onChangeText={(text) =>
                  this.changeText(text.replace(/[^0-9]/g, ""))
                }
                placeHolder={strings.userPhn}
                isPassword={false}
                ref={this.phnNumRef}
                icon={images.contactNumLogo}
                height={moderateScale(50)}
                width={"100%"}
                value={phnNum}
                returnKeyType="done"
                numberpad={true}
                maxLength={10}
                marginBottom={moderateScale(1)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <AbsoluteBtn
          btnTxt={strings.updateProfile}
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
    updateProfileData: state.profileReducer.updateProfileData, //accessing the redux state
    isloading: state.profileReducer.isLoading,
    error: state.profileReducer.error, //accessing the redux state
    myProfileData: state.profileReducer.myProfileData, //accessing the redux state
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  userDetailsMainView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(20),
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
  cameraIconStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  cameraImg: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  txtInputMainView: {
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(15),
  },
});
