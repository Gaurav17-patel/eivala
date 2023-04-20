import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  NativeModules,
  findNodeHandle,
  Platform,
} from "react-native";
import { Actions } from "react-native-router-flux";
import ParallaxScrollView from "react-native-parallax-scroll-view";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../themes";
import { moderateScale } from "../../utils/ResponsiveUi";
import strings from "../../themes/strings";
import InitialHeader from "../../components/InitialHeader";
import ParallaxHeader from "../../components/ParallaxHeader";
import AbsoluteBtn from "../../components/AbsoluteBtn";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { ConstantUtils } from "../../utils";
import RNPickerSelect from "react-native-picker-select";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../redux/actions';
import { FunctionUtils, NetworkUtils } from '../../utils';
import * as globals from '../../utils/globals';
import Loader from '../../components/LoaderOpacity.js';
import TextFieldWithoutIcon from '../../components/TextFieldWithoutIcon.js';

class CompleteModifyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      domcileCountry: this.props.userDomcileCountryId
        ? this.props.userDomcileCountryId
        : 0,
      domcileState: this.props.userDomcileProvienceId
        ? this.props.userDomcileProvienceId
        : 0,
      domcilepinCode: this.props.userDomcileZipCode
        ? this.props.userDomcileZipCode
        : '',
      domcileMFD: this.props.userDomcileMFD ? this.props.userDomcileMFD : '',
      domcileAddress: this.props.userDomcileAdd
        ? this.props.userDomcileAdd
        : '',
      postCodeAddress: this.props.userResidAdd ? this.props.userResidAdd : '',
      userCountryCode: this.props.userResidanceID
        ? this.props.userResidanceID
        : 0,
      resiStateCode: 0,
      resiPostCode: '',
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      showPopover: false,
      italyCountryId: 0,
      currentIndexDataValue: 0,
      CFRValue: this.props.userCFR ? this.props.userCFR : '',
      userStateList: [],
      isDomicile: false,
      userCountryList: [],
      userStateID: "",
      userPostCode: this.props.usersPostCode ? this.props.usersPostCode : '',
      isLoading: false,
      isDomId: 1,
      valueData: [
        {
          id: 1,
          name: strings.yes,
        },
        {
          id: 0,
          name: strings.no,
        },
      ],
    };
  }

  componentDidMount() {
    console.log('---------componentDidMount', this.props);
    this.countryAPIList();
  }

  gettingHomeStateAPI() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserStateList(globals.tokenValue, 1).then(async () => {
        const { stateList } = this.props;
        if (stateList.data && stateList.data.length > 0) {
          var cb = [];
          stateList.data.map((item) => {
            cb.push({
              label: item.name,
              value: item.id,
              id: item.id,
            });
          });
          this.setState({
            userStateList: cb,
          });
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  setFilterOptionsView = (e) => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } });
      });
    }
  };

  userCurrentValueData(domId, index) {
    this.setState({
      currentIndexDataValue: index,
      isDomId: domId,
      isDomicile: index === 1 ? true : false,
    });
  }

  _renderValueData(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() => this.userCurrentValueData(item.id, index)}
        >
          <Image
            source={
              index === this.state.currentIndexDataValue
                ? images.radioSelect
                : images.radioUnselect
            }
            style={styles.filterSelectionImg}
          />
        </TouchableOpacity>
        <Text style={styles.filterOptionName}>{item.name}</Text>
      </View>
    );
  }

  socialValidationCheck() {
    const { userCountryCode, postCodeAddress, CFRValue } = this.state;
    if (
      userCountryCode == "" ||
      userCountryCode == null ||
      userCountryCode == undefined
    ) {
      FunctionUtils.showToast(strings.birthStateBlankError);
    } else if (CFRValue == "") {
      FunctionUtils.showToast(strings.CFRBlankError);
    } else if (postCodeAddress == "") {
      FunctionUtils.showToast(strings.HeadQAddBlankValidation);
    } else {
      this.updateCustomerSocialAPICall();
    }
  }

  naturalValidationCheck() {
    const {
      userCountryCode,
      userPostCode,
      postCodeAddress,
      CFRValue,
      resiStateCode,
      domcileCountry,
      domcileState,
      domcilepinCode,
      domcileMFD,
      domcileAddress,
    } = this.state;
    console.log('naturalValidationCheck', postCodeAddress);
    if (
      userCountryCode == "" ||
      userCountryCode == null ||
      userCountryCode == undefined
    ) {
      FunctionUtils.showToast(strings.birthStateBlankError);
    } else if (CFRValue == "") {
      FunctionUtils.showToast(strings.CFRBlankError);
    } else if (userPostCode == "") {
      FunctionUtils.showToast(strings.postCodeBlankError);
    } else if (postCodeAddress == "") {
      FunctionUtils.showToast(strings.HeadQAddBlankValidation);
    } else {
      this.updateNewCustomerNaturalAPICall();
    }
  }

  updateCustomerSocialAPICall() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    const { userCountryCode, postCodeAddress, CFRValue } = this.state;
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append('customer_id', this.props.selectUserID);
      formData.append("subject_type", this.props.selectedUserID);
      formData.append("fiscal_code", this.props.fiscalCodeValue);
      formData.append('vat_number', this.props.vatCodeValue);
      formData.append('business_name', this.props.businesNameValue);
      formData.append('business_sector', this.props.BSValue);
      formData.append('relation_end_date', this.props.userERD);
      formData.append('legal_nature', this.props.legalValue);
      formData.append('ateco_code', this.props.atecoCodeId);

      formData.append('headquartr_country', userCountryCode);
      formData.append('muncipality_foreign_headquarters', CFRValue);
      formData.append('headqrtr_address', postCodeAddress);
      this.props.updateCustomerAPI(formData).then(async () => {
        const { UpdateCustomerResponce, error } = this.props;
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (UpdateCustomerResponce) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(UpdateCustomerResponce.message);
          this.props.getUpdatedUsersList();
          Actions.CustomerList();
        } else if (errorData && errorData.fiscal_code) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.fiscal_code[0]);
        } else if (errorData && errorData.legal_nature) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.legal_nature[0]);
        } else if (errorData && errorData.vat_number) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.vat_number[0]);
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(UpdateCustomerResponce.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  updateNewCustomerNaturalAPICall() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    const {
      userCountryCode,
      userPostCode,
      postCodeAddress,
      CFRValue,
      resiStateCode,
      domcileCountry,
      domcileState,
      domcilepinCode,
      domcileMFD,
      domcileAddress,
      isDomicile,
      isDomId,
    } = this.state;
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append('subject_type', this.props.selectedUserID);
      formData.append('customer_id', this.props.selectUserID);
      formData.append('fiscal_code', this.props.fiscalCodeValue);
      formData.append('vat_number', this.props.vatCodeValue);
      formData.append('first_name', this.props.firstNameValue);
      formData.append('last_name', this.props.lastNameValue);
      formData.append('date_of_birth', this.props.userDOB);
      formData.append('common_foreign_birth', this.props.CFBValue);
      formData.append('birth_state', this.props.userCountryCode);
      formData.append('birth_province', this.props.userStateCode);
      formData.append('ateco_code', this.props.atecoCodeId);
      // formData.append('ateco_code', this.props.atecoCodeValue);
      formData.append('relation_end_date', this.props.userERD);
      formData.append('performed_activity', this.props.perActivityValue);
      formData.append('business_name', this.props.businesNameValue);

      formData.append('residence_address', postCodeAddress);
      formData.append('residence_state', userCountryCode);
      formData.append('residence_province', resiStateCode);
      formData.append('postcode_residence', userPostCode);
      formData.append('common_foreign_residence', CFRValue);
      formData.append('domicile_equal_residence', isDomId);

      if (isDomicile) {
        formData.append('domicile_country', domcileCountry);
        formData.append('domicile_state', domcileState);
        formData.append('municipal_foreign_domicile', domcileMFD);
        formData.append('domicile_zipcode', domcilepinCode);
        formData.append('domicile_home_address', domcileAddress);
      }
      this.props.updateCustomerAPI(formData).then(async () => {
        const { UpdateCustomerResponce, error } = this.props;
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (UpdateCustomerResponce) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(UpdateCustomerResponce.message);
          Actions.CustomerList();
        } else if (errorData && errorData.fiscal_code) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.fiscal_code[0]);
        } else if (errorData && errorData.legal_nature) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.legal_nature[0]);
        } else if (errorData && errorData.vat_number) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.vat_number[0]);
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(UpdateCustomerResponce.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  countryAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getCountryList(globals.tokenValue).then(async () => {
        const { countryList, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (countryList && countryList.data && countryList.data.length > 0) {
          var cb = [];
          countryList.data.map((item) => {
            cb.push({
              label: item.name,
              value: item.id,
              id: item.id,
            });
          });
          this.setState({
            userCountryList: cb,
          });
        } else if (value && value == "Unauthenticated.") {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  stateValueSetting(value) {
    this.setState({ userCountryCode: value, italyCountryId: value });
    this.gettingHomeStateAPI();
  }

  renderDomicileView() {
    const {
      userStateList,
      italyCountryId,
      userCountryList,
      domcileAddress,
      domcileMFD,
      domcilepinCode,
    } = this.state;
    return (
      <View style={{ marginHorizontal: moderateScale(15) }}>
        <View>
          <Text numberOfLines={1} style={styles.uploadDocText}>
            {strings.domData}
          </Text>
        </View>
        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{
                label: this.props.userDomcileCountry
                  ? this.props.userDomcileCountry
                  : strings.domCountry,
                value: null,
              }}
              onValueChange={(value) =>
                this.setState({ domcileCountry: value })
              }
              items={userCountryList}
              style={{ ...pickerCalenderStyles }}
            />
            {Platform.OS == "ios" ? (
              <View style={styles.endView}>
                <Image
                  source={images.down}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(10),
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
        <View>
          {italyCountryId === 107 ? (
            <View style={styles.secondBoxMainView}>
              <View style={styles.commonCalenderBoxHeight}>
                <RNPickerSelect
                  placeholder={{
                    label: this.props.userDomcileProvience
                      ? this.props.userDomcileProvience
                      : strings.domProvince,
                    value: null,
                  }}
                  onValueChange={(value) =>
                    this.setState({ domcileState: value })
                  }
                  items={userStateList}
                  style={{ ...pickerCalenderStyles }}
                />
                {Platform.OS == "ios" ? (
                  <View style={styles.endView}>
                    <Image
                      source={images.down}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(10),
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}
          <View style={styles.thirdBoxView}>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={styles.textInputBoxDesign}
                placeholder={strings.domMFD}
                value={domcileMFD}
                onChangeText={(text) => {
                  this.setState({ domcileMFD: text });
                }}
              />
              {/* {domcileMFD.length > 0 ? null : (
                <Text style={styles.redStarDesign}>{strings.Star}</Text>
              )} */}
            </View>
          </View>
          <View style={styles.thirdBoxView}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.domZipCode}
              maxLength={6}
              value={domcilepinCode}
              onChangeText={(text) => {
                this.setState({ domcilepinCode: text });
              }}
            />
          </View>
          <TextFieldWithoutIcon
            onChangeText={(text) => this.setState({ domcileAddress: text })}
            placeHolder={strings.domHomeAdd}
            isPassword={false}
            icon={images.email_logo}
            height={moderateScale(123)}
            width={'100%'}
            value={domcileAddress}
            // ref={this.ticketDetailsRef}
            // blurOnSubmit={false}
            marginBottom={moderateScale(13)}
            marginTop={moderateScale(13)}
            isMultiline={true}
            paddingTop={moderateScale(10)}
            paddingLeft={moderateScale(10)}
          />
        </View>
      </View>
    );
  }

  naturalViewDesign() {
    const {
      valueData,
      userStateList,
      CFRValue,
      postCodeAddress,
      userPostCode,
      italyCountryId,
    } = this.state;
    return (
      <View>
        {italyCountryId === 107 ? (
          <View style={styles.secondBoxMainView}>
            <View style={styles.commonCalenderBoxHeight}>
              <RNPickerSelect
                placeholder={{ label: strings.BP, value: null }}
                onValueChange={(value) =>
                  this.setState({ resiStateCode: value })
                }
                items={userStateList}
                style={{ ...pickerCalenderStyles }}
              />
              {Platform.OS == "ios" ? (
                <View style={styles.endView}>
                  <Image
                    source={images.down}
                    style={{
                      width: moderateScale(15),
                      height: moderateScale(10),
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        ) : null}
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.CFR}
              value={CFRValue}
              onChangeText={(text) => {
                this.setState({ CFRValue: text });
              }}
            />
            {CFRValue.length > 0 ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <TextInput
            style={styles.textInputBoxDesign}
            placeholder={strings.PR}
            maxLength={6}
            value={userPostCode}
            onChangeText={(text) => {
              this.setState({ userPostCode: text });
            }}
          />
        </View>
        <TextFieldWithoutIcon
          onChangeText={(text) => this.setState({ postCodeAddress: text })}
          placeHolder={strings.ResiAdd}
          isPassword={false}
          icon={images.email_logo}
          height={moderateScale(123)}
          width={'100%'}
          value={postCodeAddress}
          // ref={this.ticketDetailsRef}
          // blurOnSubmit={false}
          marginBottom={moderateScale(13)}
          marginTop={moderateScale(13)}
          isMultiline={true}
          paddingTop={moderateScale(10)}
          paddingLeft={moderateScale(10)}
        />
        <View>
          <Text numberOfLines={1} style={styles.uploadDocText}>
            {strings.DER}
          </Text>
        </View>
        <View style={[styles.thirdBoxView, { height: moderateScale(70) }]}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: "column" }}>
              {valueData.map((item, index) => {
                return this._renderValueData(item, index);
              })}
            </View>
          </View>
        </View>
      </View>
    );
  }

  socialViewDesign() {
    const { CFRValue, postCodeAddress } = this.state;
    return (
      <View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.CFR}
              value={CFRValue}
              onChangeText={(text) => {
                this.setState({ CFRValue: text });
              }}
            />
            {CFRValue.length > 0 ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <TextFieldWithoutIcon
          onChangeText={(text) => this.setState({ postCodeAddress: text })}
          placeHolder={strings.HeadQAdd}
          isPassword={false}
          icon={images.email_logo}
          height={moderateScale(123)}
          width={'100%'}
          value={postCodeAddress}
          // ref={this.ticketDetailsRef}
          // blurOnSubmit={false}
          marginBottom={moderateScale(13)}
          marginTop={moderateScale(13)}
          isMultiline={true}
          paddingTop={moderateScale(10)}
          paddingLeft={moderateScale(10)}
        />
      </View>
    );
  }

  render() {
    const { isLoading, isDomicile, userCountryList } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          scrollEvent={(event) => {
            this.setFilterOptionsView();
            if (
              event.nativeEvent.contentOffset.y <= 0 &&
              this.state.stickHeaderHeight > 0
            ) {
              this.setState({ stickHeaderHeight: 0 });
            } else if (
              event.nativeEvent.contentOffset.y > 0 &&
              this.state.stickHeaderHeight === 0
            ) {
              this.setState({
                stickHeaderHeight: moderateScale(100),
              });
            }
          }}
          stickyHeaderHeight={this.state.stickHeaderHeight}
          renderForeground={() => (
            <InitialHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.modifyCust}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.modifyCust}
            />
          )}
        >
          <SafeAreaView>
            <View
              style={{
                borderWidth: 0,
                marginHorizontal: moderateScale(15),
              }}
            >
              <View>
                <Text numberOfLines={1} style={styles.uploadDocText}>
                  {strings.Residncy}
                </Text>
              </View>
              <View style={styles.secondBoxMainView}>
                <View style={styles.commonCalenderBoxHeight}>
                  <RNPickerSelect
                    placeholder={{
                      label: this.props.userResidanceName
                        ? this.props.userResidanceName
                        : strings.ReState,
                      value: null,
                    }}
                    onValueChange={(value) => this.stateValueSetting(value)}
                    items={userCountryList}
                    style={{ ...pickerCalenderStyles }}
                  />
                  {Platform.OS == "ios" ? (
                    <View style={styles.endView}>
                      <Image
                        source={images.down}
                        style={{
                          width: moderateScale(15),
                          height: moderateScale(10),
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              {this.props.selectedUserID === 1
                ? this.naturalViewDesign()
                : this.socialViewDesign()}
            </View>
            {isDomicile ? this.renderDomicileView() : null}
            <TouchableOpacity
              onPress={() => {
                Actions.pop();
              }}
              style={styles.btnCancel}
            >
              <Image source={images.backLeftArr} style={styles.btnArrowImg} />
              <Text style={styles.cancelTxt}>{strings.previous}</Text>
            </TouchableOpacity>
            <View style={{ marginTop: moderateScale(120) }}>
              <AbsoluteBtn
                btnTxt={strings.add}
                onPressBtn={() => {
                  this.props.selectedUserID === 1
                    ? this.naturalValidationCheck()
                    : this.socialValidationCheck();
                }}
                marginRight={0}
              />
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    stateList: state.customerReducer.stateList, //accessing the redux state
    countryList: state.customerReducer.countryList, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    UpdateCustomerResponce: state.customerReducer.UpdateCustomerResponce, //accessing the redux state
    error: state.customerReducer.error, //accessing the redux state
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteModifyCustomer);

const pickerCalenderStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(30),
    color: colors.colorGray,
    left: moderateScale(10),
    // width: moderateScale(440),
    // paddingTop: moderateScale(10),
  },
  inputAndroid: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(30),
    color: colors.colorGray,
    left: moderateScale(10),
    // width: moderateScale(440),
    // paddingTop: moderateScale(10),
  },
});

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  pickerCalenderStyles: {
    borderWidth: 1,
    fontSize: moderateScale(12),
    height: moderateScale(30),
    color: colors.colorGray,
    left: moderateScale(10),
    // width: moderateScale(440),
    // paddingTop: moderateScale(10),
  },
  cancelTxt: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.redColor,
    borderWidth: 0,
    fontWeight: "bold",
  },
  btnArrowImg: {
    height: moderateScale(10),
    width: moderateScale(15),
    tintColor: colors.redColor,
    marginRight: 5,
  },
  redStarDesign: {
    fontSize: moderateScale(15),
    top: moderateScale(10),
    left: moderateScale(10),
    color: colors.redColor,
  },
  endView: {
    alignSelf: "flex-end",
    borderWidth: 0,
    // height: moderateScale(50),
    // alignItems:'center',
    // alignContent:'center',
    top: moderateScale(-25),
    marginRight: moderateScale(15),
  },
  commonBoxHeight: {
    height: moderateScale(40),
  },
  btnCancel: {
    height: moderateScale(40),
    backgroundColor: colors.white,
    borderWidth: 0.7,
    margin: moderateScale(18),
    flexDirection: "row",
    marginBottom: moderateScale(-6),
    borderColor: colors.redColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(7),
  },
  firstTochDesign: {
    width: moderateScale(300),
    flexDirection: "row",
  },
  textInputBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(35),
    color: colors.colorGray,
    left: moderateScale(10),
  },
  calenderTextBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(35),
    color: colors.colorGray,
    left: moderateScale(10),
    paddingTop: moderateScale(10),
  },
  commonCalenderBoxHeight: {
    height: moderateScale(30),
    borderWidth: 0,
  },
  textBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(35),
    color: colors.colorGray,
    marginLeft: moderateScale(10),
  },
  secondBoxMainView: {
    flex: 1,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    //width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    height: moderateScale(50),
    marginTop: moderateScale(16),
    justifyContent: "center",
  },
  filterModalView: {
    height: height * 0.22,
    marginLeft: moderateScale(3),
  },
  thirdBoxView: {
    flex: 1,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(8),
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    padding: moderateScale(5),
    marginTop: moderateScale(16),
  },
  uploadDocText: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: "500",
    flex: 1,
    top: moderateScale(10),
    marginBottom: moderateScale(-4),
    marginLeft: moderateScale(5),
  },
  filterOptionName: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  filterOptionRenderMainView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    padding: moderateScale(6),
    width: width * 0.75,
  },
});
