import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { FunctionUtils, NetworkUtils } from "../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { images, fonts, colors } from "../../themes";
import strings from "../../themes/strings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "../../utils/ResponsiveUi";
import TextField from "../../components/TextField.js";
const { height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import { PreferenceKey, PreferenceManager } from "../../utils";
import { debounce } from "lodash";
import Loader from "../../components/LoaderOpacity.js";
import HandleBack from '../BackHandler/BackHandler';

let TAG = "uniqueCode: ==";
class Otp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueCode: "",
      isLoading: false,
      data: this.props.data,
      clientDynmicLogo: '',
    };
  }

  componentDidMount() {
    this.navigateTo = debounce(this.navigateTo.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.getUniqueId();
  }

  async getUniqueId() {
    let clientLogoImage = await PreferenceManager.getPreferenceValue(
      PreferenceKey.CLIENTLOGO
    );
    this.setState({ clientDynmicLogo: clientLogoImage });
  }

  changeText(text, field) {
    this.setState({ [field]: text });
  }

  async navigateTo() {
    if (this.state.uniqueCode.trim() == "") {
      FunctionUtils.showToast(strings.portalurlBlankErr);
    } else {
      this.nextBtnClick();
    }
  }

  async nextBtnClick() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("client_portal_url", this.state.uniqueCode);
      this.props.clientPortalAuth(formData).then(async () => {
        const { clientPortalResData } = this.props;
        if (clientPortalResData.hasOwnProperty("data")) {
          FunctionUtils.showToast(clientPortalResData.message);
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.uniqueCode,
            this.state.uniqueCode
          );
          this.setState({ isLoading: false }, Actions.Login());
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(clientPortalResData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  async resendOtpClick() {
    const { data } = this.state;
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      this.props.loginReq(formData).then(async () => {
        const { loginResData } = this.props;
        if (loginResData.data.hasOwnProperty("code_token")) {
          FunctionUtils.showToast(loginResData.message);
          this.setState({ isLoading: false, uniqueCode: '' });
        } else {
          this.setState({ isLoading: false, uniqueCode: '' });
          FunctionUtils.showToast(loginResData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  async verifyOtpClick() {
    const { data, uniqueCode } = this.state;
    if (uniqueCode.length === 0) {
      FunctionUtils.showToast(strings.otpBlankError);
      return;
    } else if (uniqueCode.length !== 5) {
      FunctionUtils.showToast(strings.otpLengthError);
      return;
    }
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("code_token", data.code_token);
      formData.append("entered_auth_code", uniqueCode);
      formData.append("email", data.email);
      this.props.verifyOtp(formData).then(async () => {
        const { otpResData, otpErrorData } = this.props;
        console.log(
          '---------otpResData',
          otpResData.user_data.id,
          otpResData,
          otpErrorData
        );
        if (otpResData && otpResData.hasOwnProperty("user_data") === true) {
          FunctionUtils.showToast(otpResData.message);
          AsyncStorage.setItem("@isLogin", "true");
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.USER_TOKEN,
            otpResData.token
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.USER_DATA,
            otpResData.sender
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.SOCKETIP,
            otpResData.socket_ip
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.SOCKETPORT,
            otpResData.socket_port
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.USER_ID,
            otpResData.user_data.id.toString()
          );
          this.setState({ isLoading: false }, Actions.Dashboard());
        } else if (otpErrorData.entered_auth_code) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(otpErrorData.entered_auth_code[0]);
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(otpResData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  //call when back button press
  onBack = () => {
    this.props.navigation.goBack();
    return true;
  };

  render() {
    const { uniqueCode, isLoading, clientDynmicLogo } = this.state;
    return (
      <HandleBack onBack={this.onBack}>
        <View style={styles.mainView}>
          <SafeAreaView>
            <KeyboardAwareScrollView>
              <ScrollView>
                <TouchableOpacity
                  style={styles.backImgView}
                  onPress={() => Actions.pop()}
                >
                  <Image
                    source={images.backLeftArr}
                    style={styles.backLeftImg}
                  />
                </TouchableOpacity>
                <View style={styles.logoImgView}>
                  <Image source={images.logo_app} style={styles.logoImg} />
                </View>
                <View style={styles.mainTxtInputView}>
                  <View style={styles.loginTitleView}>
                    <Text style={styles.title}>{strings.verificationCode}</Text>
                    <Image
                      source={{ uri: clientDynmicLogo }}
                      style={{
                        height: moderateScale(30),
                        width: moderateScale(75),
                      }}
                    />
                  </View>
                  <View style={styles.txtInnerView}>
                    <Text style={styles.staticTxt}>
                      {strings.verificationCodeDetails}
                    </Text>
                    <TextField
                      onChangeText={(text) =>
                        this.changeText(
                          text.replace(/[^0-9]/g, ''),
                          'uniqueCode'
                        )
                      }
                      placeHolder={strings.placeHolderOtp}
                      isPassword={false}
                      icon={images.password_logo}
                      height={moderateScale(55)}
                      width={"100%"}
                      value={uniqueCode}
                      marginBottom={20}
                      marginTop={20}
                      numberpad={true}
                      maxLength={5}
                    />
                    <TouchableOpacity
                      onPress={() => this.resendOtpClick()}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(90),
                        right: 0,
                        alignSelf: "flex-end",
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorRed,
                          fontSize: moderateScale(14),
                          fontFamily: fonts.PoppinsRegular,
                          fontWeight: "500",
                        }}
                      >
                        {strings.resendOtp}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.lastMainView}>
                  <TouchableOpacity
                    onPress={() => this.verifyOtpClick()}
                    style={styles.btnMainView}
                  >
                    <Text style={styles.btnTxt}>{strings.verifyOtp}</Text>
                  </TouchableOpacity>
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
    otpResData: state.loginReducer.otpResData, //accessing the redux state
    error: state.loginReducer.error, //accessing the redux state
    otpErrorData: state.loginReducer.otpErrorData, //accessing the redux state
    isloading: state.loginReducer.isLoading,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Otp);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backLeftImg: {
    height: moderateScale(17),
    width: moderateScale(25),
    marginLeft: moderateScale(10),
    marginTop: moderateScale(10),
  },
  logoImgView: {
    height: height / 3.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  logoImg: {
    height: moderateScale(90),
    width: moderateScale(90),
  },
  mainTxtInputView: {
    height: height / 3.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  loginTitleView: {
    height: "30%",
    width: "90%",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  title: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(25),
  },
  txtInnerView: {
    height: "70%",
    width: "90%",
    backgroundColor: colors.white,
  },
  staticTxt: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.colorGray,
  },
  btnMainView: {
    height: moderateScale(55),
    width: "100%",
    backgroundColor: colors.redColor,
    borderRadius: moderateScale(13),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  lastMainView: {
    height: height / 3,
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  btnTxt: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: fonts.PoppinsSemiBold,
  },
  btnArrowImg: {
    height: moderateScale(10),
    width: moderateScale(15),
    tintColor: colors.white,
    marginLeft: 5,
    transform: [{ rotateY: "180deg" }],
  },
  backImgView: {
    height: moderateScale(40),
    width: moderateScale(40),
    marginLeft: moderateScale(10),
    marginTop: moderateScale(30),
  },
});
