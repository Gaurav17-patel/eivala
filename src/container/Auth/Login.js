/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import { debounce } from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { images, fonts, colors } from "../../themes";
import {
  FunctionUtils,
  NetworkUtils,
  PreferenceManager,
  PreferenceKey,
} from "../../utils";
import strings from "../../themes/strings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "../../utils/ResponsiveUi";
import TextField from "../../components/TextField.js";
import Button from "../../components/Button.js";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import Modal from "react-native-modal";
import Loader from "../../components/LoaderOpacity.js";
import HandleBack from "../BackHandler/BackHandler";

let TAG = "LOGIN :====";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
    this.state = {
      // email: "firsttest@mailinator.com", // test1@yopmail.com
      // password: "Test@123",
      email: "",
      password: "",
      // email: "marrie@yopmail.com",
      // password: "Qwerty@123",
      uniqueId: "",
      hideShowPass: true,
      modalVisible: false,
      isLoading: false,
      uniqueURL: "",
      clientDynmicLogo: "",
    };
    this.passwordRef = this.updateRef.bind(this, "password");
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    this.loginClicked = debounce(this.loginClicked.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.forgotPasswordClick = debounce(
      this.forgotPasswordClick.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      }
    );
    this.changeClientIdModalVisible = debounce(
      this.changeClientIdModalVisible.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      }
    );
    this.getUniqueId();
  }

  async getUniqueId() {
    let value = await PreferenceManager.getPreferenceValue(
      PreferenceKey.UNIQUEID
    );
    let clientLogoImage = await PreferenceManager.getPreferenceValue(
      PreferenceKey.CLIENTLOGO
    );
    this.setState({ uniqueId: value, clientDynmicLogo: clientLogoImage });
  }

  changeText(text, field) {
    this.setState({ [field]: text });
  }

  loginClicked() {
    if (this.state.email.trim() == "") {
      FunctionUtils.showToast(strings.emailBlankError);
    } else if (!FunctionUtils.validateEmail(this.state.email)) {
      FunctionUtils.showToast(strings.emailValidError);
    } else if (this.state.password.trim() == "") {
      FunctionUtils.showToast(strings.passwordBlankError);
    } else {
      this.loginBtnClick();
    }
  }

  async loginBtnClick() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("email", this.state.email);
      formData.append("password", this.state.password);
      this.props.loginReq(formData).then(async () => {
        const { loginResData, msgError, error } = this.props;
        let errorData;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        this.setState({ isLoading: false });
        if (
          loginResData &&
          loginResData.data != null &&
          loginResData.data &&
          loginResData.data.hasOwnProperty("code_token") === true
        ) {
          FunctionUtils.showToast(loginResData.message);
          this.setState(
            { isLoading: false },
            Actions.Otp({ data: loginResData.data })
          );
        } else if (
          loginResData &&
          loginResData.errors &&
          loginResData.errors.email
        ) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(loginResData.errors.email[0]);
        } else if (
          loginResData &&
          loginResData.errors &&
          loginResData.errors.password
        ) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(loginResData.errors.password[0]);
        } else if (errorData && errorData.email) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.email[0]);
        } else if (errorData && errorData.password) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.password[0]);
        } else if (value && value == "Unauthenticated.") {
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(loginResData.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  forgotPasswordClick() {
    Actions.ForgotPassword();
  }

  changeClientIdModalVisible() {
    this.setState({ modalVisible: true });
  }

  setModalVisible = () => {
    this.setState({ modalVisible: false });
    this.getUniqueId();
  };

  changeUniqueCode = () => {
    this.setState({ modalVisible: false });
    this.updateUniqueId();
  };

  async updateUniqueId() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("client_portal_url", this.state.uniqueId);
      this.props.clientPortalAuth(formData).then(async () => {
        const { clientPortalResData } = this.props;
        if (clientPortalResData.hasOwnProperty("client_data") === true) {
          FunctionUtils.showToast(clientPortalResData.message);
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.UNIQUEID,
            this.state.uniqueId
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.XDOMAIN,
            clientPortalResData.client_data.client_domain
          );
          this.setState({ modalVisible: false, isLoading: false });
          // this.setState({ isLoading: false }, Actions.Login());
        } else {
          this.setState(
            { isLoading: false },
            FunctionUtils.showToast(clientPortalResData.message)
          );
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  hideShowPassword() {
    this.setState({ hideShowPass: !this.state.hideShowPass });
  }

  //call when back button press
  onBack = () => {
    FunctionUtils.appExitMsg();
    return true;
  };

  renderBgModel() {
    const { modalVisible, uniqueId } = this.state;
    return (
      <Modal
        testID={"modal"}
        isVisible={modalVisible}
        backdropColor="black"
        backdropOpacity={0.8}
        animationType="slide"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onRequestClose={this.setModalVisible}
      >
        <View style={styles.modalMainView}>
          <View style={styles.modalInnerMainView}>
            <View style={{ height: "28%", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.PoppinsRegular,
                  fontSize: moderateScale(25),
                  color: colors.lightBlack,
                }}
              >
                {strings.uniquePortalId}
              </Text>
            </View>
            <View style={{ height: "20%", justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: fonts.PoppinsRegular,
                  fontSize: moderateScale(13),
                  color: colors.darkGray,
                }}
              >
                {strings.uniqueIdStatic}
              </Text>
            </View>
            <View style={{ height: "25%", justifyContent: "center" }}>
              <TextField
                onChangeText={(text) => this.changeText(text, "uniqueId")}
                placeHolder={strings.placeHolderPortalId}
                icon={images.clientIdTxtLogo}
                height={moderateScale(40)}
                width={"100%"}
                value={uniqueId}
                marginBottom={0}
              />
            </View>
            <View style={styles.btnMainView}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={this.setModalVisible}
              >
                <Text style={styles.cancelTxt}>{strings.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnChange}
                onPress={this.changeUniqueCode}
              >
                <Text style={styles.changeTxt}>{strings.change}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    // this.textInput.current.focus();
    this.password.focus();
  }

  render() {
    const { email, password, isLoading, clientDynmicLogo } = this.state;
    return (
      <HandleBack onBack={this.onBack}>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <SafeAreaView>
            <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
              <ScrollView keyboardShouldPersistTaps="handled">
                {this.renderBgModel()}
                <View
                  style={{
                    height: height / 3.5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <Image
                    source={images.logo_app}
                    style={{
                      height: moderateScale(90),
                      width: moderateScale(90),
                    }}
                  />
                </View>
                <View
                  style={{
                    height: height / 2.7,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <View
                    style={{
                      height: "20%",
                      width: "90%",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.PoppinsRegular,
                        fontSize: moderateScale(25),
                      }}
                    >
                      {strings.login}
                    </Text>
                    <Image
                      source={{ uri: clientDynmicLogo }}
                      style={{
                        height: moderateScale(30),
                        width: moderateScale(75),
                      }}
                    />
                  </View>
                  <View
                    style={{
                      height: "80%",
                      width: "90%",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      onChangeText={(text) => this.changeText(text, "email")}
                      placeHolder={strings.userEmail}
                      isPassword={false}
                      isEmail={true}
                      autoCapitalize={false}
                      icon={images.email_logo}
                      height={moderateScale(55)}
                      width={"100%"}
                      value={email}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        this.focusTextInput();
                      }}
                      blurOnSubmit={false}
                      marginBottom={moderateScale(30)}
                    />
                    <TextField
                      onChangeText={(text) => this.changeText(text, "password")}
                      placeHolder={strings.password}
                      ref={this.passwordRef}
                      icon={images.password_logo}
                      height={moderateScale(55)}
                      width={"100%"}
                      isPasswordLength={this.state.password.length}
                      value={password}
                      isHideShowPass={true}
                      isPassword={this.state.hideShowPass}
                      passwordStatus={this.state.hideShowPass}
                      onPressHideShow={() => {
                        this.hideShowPassword();
                      }}
                      marginBottom={0}
                      returnKeyType="done"
                    />
                    <Button
                      buttonTitle={strings.forgotPassword}
                      height={moderateScale(30)}
                      width={"100%"}
                      backgroundColor={colors.transparent}
                      onButtonPress={() => this.forgotPasswordClick()}
                      textStyle={{
                        color: colors.redColor,
                        fontSize: moderateScale(14),
                        fontFamily: fonts.PoppinsRegular,
                        fontWeight: "500",
                        alignSelf: "flex-end",
                        marginTop: moderateScale(10),
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    height: height / 3,
                    width: "90%",
                    alignSelf: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    buttonTitle={strings.login}
                    height={moderateScale(55)}
                    width={"100%"}
                    backgroundColor={colors.redColor}
                    onButtonPress={() => this.loginClicked()}
                    textStyle={{
                      color: colors.white,
                      fontSize: moderateScale(16),
                      fontFamily: fonts.PoppinsRegular,
                      fontWeight: "500",
                      textTransform: "uppercase",
                    }}
                  />
                  <Button
                    buttonTitle={strings.changePortalURL}
                    height={moderateScale(30)}
                    width={"100%"}
                    backgroundColor={colors.transparent}
                    onButtonPress={() => this.changeClientIdModalVisible()}
                    textStyle={{
                      color: colors.redColor,
                      fontSize: moderateScale(14),
                      fontFamily: fonts.PoppinsMedium,
                    }}
                  />
                </View>
              </ScrollView>
            </KeyboardAwareScrollView>
          </SafeAreaView>
          {isLoading && <Loader />}
        </View>
      </HandleBack>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    loginResData: state.loginReducer.loginResData, //accessing the redux state
    isloading: state.loginReducer.isLoading,
    error: state.loginReducer.error, //accessing the redux state
    msgError: state.loginReducer.msgError, //accessing the redux state
    clientPortalResData: state.loginReducer.clientPortalResData,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  modalMainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalInnerMainView: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: colors.colorGray2,
    borderRadius: moderateScale(10),
    height: height / 2.6,
    width: width / 1.2,
    padding: moderateScale(15),
  },
  btnCancel: {
    width: "50%",
    height: moderateScale(40),
    backgroundColor: colors.white,
    marginRight: moderateScale(7.5),
    borderWidth: 0.7,
    borderColor: colors.redColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(7),
  },
  btnChange: {
    flex: 1,
    height: moderateScale(40),
    backgroundColor: colors.redColor,
    marginLeft: moderateScale(7.5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(7),
  },
  cancelTxt: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.redColor,
  },
  changeTxt: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.white,
  },
  btnMainView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
