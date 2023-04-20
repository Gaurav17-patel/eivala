/* eslint-disable quotes */
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
import { FunctionUtils, NetworkUtils, WebService } from "../../utils";
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
import HandleBack from "../BackHandler/BackHandler";

let TAG = "UniqueId: ==";
class UniqueId extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueID: WebService.UNIQUE_ID_URL,
      isLoading: false,
      // uniqueID: "clienta-alavie.project-demo-server.com",
    };
  }

  componentDidMount() {
    this.navigateTo = debounce(this.navigateTo.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
  }

  changeText(text, field) {
    this.setState({ [field]: text });
  }

  async navigateTo() {
    if (this.state.uniqueID.trim() == "") {
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
      formData.append("client_portal_url", this.state.uniqueID);
      this.props.clientPortalAuth(formData).then(async () => {
        const { clientPortalResData } = this.props;
        console.log(TAG, " clientPortalAuth--> ", clientPortalResData);
        if (clientPortalResData.hasOwnProperty("client_data") === true) {
          FunctionUtils.showToast(clientPortalResData.message);
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.UNIQUEID,
            this.state.uniqueID
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.XDOMAIN,
            clientPortalResData.client_data.client_domain
          );
          await PreferenceManager.setPreferenceValue(
            PreferenceKey.CLIENTLOGO,
            clientPortalResData.data.client_logo
          );
          this.setState({ isLoading: false }, Actions.Login());
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

  //call when back button press
  onBack = () => {
    FunctionUtils.appExitMsg();
    return true;
  };

  render() {
    const { uniqueID, isLoading } = this.state;
    return (
      <HandleBack onBack={this.onBack}>
        <View style={styles.mainView}>
          <SafeAreaView>
            <KeyboardAwareScrollView>
              <ScrollView>
                <View style={styles.logoImgView}>
                  <Image source={images.logo_app} style={styles.logoImg} />
                </View>
                <View style={styles.mainTxtInputView}>
                  {/* <View style={styles.loginTitleView}>
                    <Text style={styles.title}>{strings.uniquePortalId}</Text>
                  </View> */}
                  <View style={styles.txtInnerView}>
                    <Text style={styles.staticTxt}>
                      {strings.uniqueIdStatic}
                    </Text>
                    <TextField
                      onChangeText={(text) => this.changeText(text, "uniqueID")}
                      placeHolder={strings.placeHolderPortalId}
                      isPassword={false}
                      icon={images.clientIdTxtLogo}
                      height={moderateScale(55)}
                      width={"100%"}
                      value={uniqueID}
                      marginBottom={20}
                      marginTop={20}
                    />
                  </View>
                </View>
                <View style={styles.lastMainView}>
                  <TouchableOpacity
                    onPress={() => this.navigateTo()}
                    style={styles.btnMainView}
                  >
                    <Text style={styles.btnTxt}>{strings.next}</Text>
                    <Image
                      source={images.backLeftArr}
                      style={[styles.btnArrowImg]}
                    />
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
    clientPortalResData: state.loginReducer.clientPortalResData, //accessing the redux state
    isloading: state.loginReducer.isLoading,
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(UniqueId);

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
    borderWidth: 0,
  },
  logoImg: {
    height: moderateScale(100),
    width: moderateScale(100),
    top: moderateScale(20),
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
});
