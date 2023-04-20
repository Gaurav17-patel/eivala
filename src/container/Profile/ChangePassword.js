import React from "react";
import { View, StyleSheet, Dimensions, BackHandler } from "react-native";
import { debounce } from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { images, fonts, colors } from "../../themes";
import { FunctionUtils, NetworkUtils } from "../../utils";
import strings from "../../themes/strings";
import { moderateScale } from "../../utils/ResponsiveUi";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import InitialHeader from "../../components/InitialHeader";
import AbsoluteBtn from "../../components/AbsoluteBtn";
import TextField from "../../components/TextField.js";
import Loader from "../../components/LoaderOpacity.js";

let TAG = "Change password: ===";
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      // oldPass: "O13ruDv!_",
      // newPass: "Test@123",
      // confirmPass: "Test@123",
      oldPass: "",
      newPass: "",
      confirmPass: "",
      isLoading: false,
      hideShowPass: true,
      hideShowPass2: true,
      hideShowPass3: true,
    };
    this.newPassRef = this.updateRef.bind(this, 'newPass');
    this.confirmPassRef = this.updateRef.bind(this, 'confirmPass');
  }

  componentDidMount() {
    this.changePassBtnClick = debounce(
      this.changePassBtnClick.bind(this),
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

  changePassBtnClick() {
    if (this.state.oldPass.trim() == "") {
      FunctionUtils.showToast(strings.oldPassBlankError);
    } else if (this.state.newPass.trim() == "") {
      FunctionUtils.showToast(strings.newPassBlankError);
    } else if (!FunctionUtils.validatePasswordLength(this.state.newPass)) {
      FunctionUtils.showToast(strings.newPassLengthError);
    } else if (!FunctionUtils.validateStrongPassword(this.state.newPass)) {
      FunctionUtils.showToast(strings.newStrongPassError);
    } else if (this.state.confirmPass.trim() == "") {
      FunctionUtils.showToast(strings.confirmBlankError);
    } else if (this.state.newPass != this.state.confirmPass) {
      FunctionUtils.showToast(strings.passwordNotSameErr);
    } else {
      this.changePassSuccess();
    }
  }

  async changePassSuccess() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("old_password", this.state.oldPass);
      formData.append("new_password", this.state.newPass);
      formData.append("confirm_password", this.state.confirmPass);
      this.props.changePassReq(formData).then(async () => {
        const { changePassResData, error } = this.props;
        // let errorData;
        // {
        //   error ? (errorData = JSON.parse(error)) : null;
        // }
        if (changePassResData.message === "Password updated successfully") {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(changePassResData.message);
          Actions.pop();
        } else if (
          changePassResData.errors &&
          changePassResData.errors.old_password
        ) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(changePassResData.errors.old_password[0]);
        } else if (
          changePassResData.errors &&
          changePassResData.errors.new_password
        ) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(changePassResData.errors.new_password[0]);
        } else if (
          changePassResData.errors &&
          changePassResData.errors.confirm_password
        ) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(changePassResData.errors.confirm_password[0]);
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(changePassResData.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  changeText(text, field) {
    this.setState({ [field]: text });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  focusNewPasswordTextInput() {
    this.newPass.focus();
  }

  focusConfirmPasswordTextInput() {
    this.confirmPass.focus();
  }

  hideShowPassword() {
    this.setState({ hideShowPass: !this.state.hideShowPass });
  }

  hideShowPassword2() {
    this.setState({ hideShowPass2: !this.state.hideShowPass2 });
  }

  hideShowPassword3() {
    this.setState({ hideShowPass3: !this.state.hideShowPass3 });
  }

  render() {
    const { oldPass, newPass, confirmPass, isLoading } = this.state;
    return (
      <View style={styles.flexView}>
        <InitialHeader
          leftIconPress={() => Actions.pop()}
          icon={images.backLeftArr}
          headerTxtMain={strings.changePass}
        />
        <KeyboardAwareScrollView bounces={false}>
          <View style={styles.txtInputMainView}>
            <TextField
              onChangeText={(text) => this.changeText(text, "oldPass")}
              placeHolder={strings.oldPass}
              icon={images.password_logo}
              height={moderateScale(50)}
              width={"100%"}
              onSubmitEditing={() => {
                this.focusNewPasswordTextInput();
              }}
              isPasswordLength={this.state.oldPass.length}
              isHideShowPass={true}
              isPassword={this.state.hideShowPass}
              passwordStatus={this.state.hideShowPass}
              onPressHideShow={() => {
                this.hideShowPassword();
              }}
              returnKeyType="next"
              value={oldPass}
              marginBottom={moderateScale(13)}
            />
            <TextField
              onChangeText={(text) => this.changeText(text, "newPass")}
              placeHolder={strings.newPass}
              isHideShowPass={true}
              isPassword={this.state.hideShowPass2}
              passwordStatus={this.state.hideShowPass2}
              onPressHideShow={() => {
                this.hideShowPassword2();
              }}
              isPasswordLength={this.state.newPass.length}
              icon={images.password_logo}
              height={moderateScale(50)}
              width={"100%"}
              value={newPass}
              ref={this.newPassRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.focusConfirmPasswordTextInput();
              }}
              marginBottom={moderateScale(13)}
            />
            <TextField
              onChangeText={(text) => this.changeText(text, "confirmPass")}
              placeHolder={strings.confirmnewPass}
              isPasswordLength={this.state.confirmPass.length}
              isHideShowPass={true}
              isPassword={this.state.hideShowPass3}
              passwordStatus={this.state.hideShowPass3}
              onPressHideShow={() => {
                this.hideShowPassword3();
              }}
              icon={images.password_logo}
              height={moderateScale(50)}
              width={"100%"}
              ref={this.confirmPassRef}
              returnKeyType="done"
              value={confirmPass}
              marginBottom={moderateScale(13)}
            />
          </View>
        </KeyboardAwareScrollView>
        {isLoading && <Loader />}
        <AbsoluteBtn
          btnTxt={strings.changePass}
          onPressBtn={() => this.changePassBtnClick()}
        />
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    changePassResData: state.profileReducer.changePassResData, //accessing the redux state
    isloading: state.profileReducer.isLoading,
    error: state.profileReducer.error, //accessing the redux state
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

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
