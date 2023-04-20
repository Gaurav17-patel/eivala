import React from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { images, fonts, colors } from "../../themes";
import { FunctionUtils, NetworkUtils } from "../../utils";
import strings from "../../themes/strings";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { moderateScale } from "../../utils/ResponsiveUi";
import TextField from "../../components/TextField.js";
import Button from "../../components/Button.js";
const { height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import { debounce } from "lodash";
import Loader from "../../components/LoaderOpacity.js";

let TAG = "Forgot Password: ====";
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isLoading: false,
    };
  }

  componentDidMount() {
    this.goBack = debounce(this.goBack.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.sendClicked = debounce(this.sendClicked.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.sendSuceess = debounce(this.sendSuceess.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
  }

  changeText(text, field) {
    this.setState({ [field]: text });
  }

  sendClicked() {
    if (this.state.email.trim() == "") {
      FunctionUtils.showToast(strings.emailBlankError);
    } else if (!FunctionUtils.validateEmail(this.state.email)) {
      FunctionUtils.showToast(strings.emailValidError);
    } else {
      this.sendSuceess();
    }
  }

  async sendSuceess() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("email", this.state.email);
      this.props.forgotPassReq(formData).then(async () => {
        const { forgotPassResData, msgError, error } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        this.setState({ isLoading: false });
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        } 
        if (forgotPassResData != null) {
          FunctionUtils.showToast(forgotPassResData.message);
        } else if (value && value == 'Unauthenticated.') {
          FunctionUtils.clearLogin();
        } else if (errorData && errorData.email) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.email[0]);
        } else {
          FunctionUtils.showToast(forgotPassResData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  goBack() {
    Actions.pop();
  }

  render() {
    const { email, isLoading } = this.state;
    return (
      <View style={styles.mainView}>
        <SafeAreaView>
          <KeyboardAwareScrollView>
            <ScrollView>
              <TouchableOpacity
                style={styles.backImgView}
                onPress={() => this.goBack()}
              >
                <Image source={images.backLeftArr} style={styles.backLeftImg} />
              </TouchableOpacity>
              <View style={styles.logoImgView}>
                <Image source={images.logo_app} style={styles.logoImg} />
              </View>
              <View style={styles.mainTxtInputView}>
                <View style={styles.loginTitleView}>
                  <Text style={styles.title}>{strings.forgotPass}</Text>
                </View>
                <View style={styles.txtInnerView}>
                  <Text style={styles.staticTxt}>{strings.forgotPassText}</Text>
                  <TextField
                    onChangeText={(text) => this.changeText(text, "email")}
                    placeHolder={strings.userEmail}
                    isPassword={false}
                    icon={images.email_logo}
                    height={moderateScale(55)}
                    width={"100%"}
                    value={email}
                    marginBottom={20}
                    marginTop={20}
                  />
                </View>
              </View>
              <View style={styles.lastMainView}>
                <Button
                  buttonTitle={strings.send}
                  onButtonPress={() => this.sendClicked()}
                  height={moderateScale(55)}
                  width={"100%"}
                  backgroundColor={colors.redColor}
                  textStyle={styles.btnTxtStyle}
                />
                <Button
                  buttonTitle={strings.backToLogin}
                  height={moderateScale(30)}
                  width={"100%"}
                  backgroundColor={colors.transparent}
                  onButtonPress={() => this.goBack()}
                  textStyle={styles.redBottomTxt}
                />
              </View>
            </ScrollView>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    forgotPassResData: state.loginReducer.forgotPassResData, //accessing the redux state
    isloading: state.loginReducer.isLoading,
    msgError: state.loginReducer.msgError, //accessing the redux state
    error: state.loginReducer.error, //accessing the redux state
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backImgView: {
    height: moderateScale(17),
    width: moderateScale(25),
    marginLeft: moderateScale(20),
    marginTop: moderateScale(30),
  },
  backLeftImg: {
    height: moderateScale(17),
    width: moderateScale(25),
  },
  logoImgView: {
    height: height / 3.7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoImg: {
    height: moderateScale(90),
    width: moderateScale(90),
  },
  mainTxtInputView: {
    height: height / 2.9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loginTitleView: {
    height: "20%",
    width: "90%",
    justifyContent: "center",
    backgroundColor: colors.white,
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
  btnTxtStyle: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.PoppinsSemiBold,
    textTransform: "uppercase",
  },
  redBottomTxt: {
    color: colors.redColor,
    fontSize: moderateScale(14),
    fontFamily: fonts.PoppinsMedium,
  },
});
