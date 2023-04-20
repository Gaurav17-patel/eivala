import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Platform,
  NativeModules,
  findNodeHandle,
  Modal,
  BackHandler,
  Keyboard,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const { width, height } = Dimensions.get('window');
import { images, fonts, colors } from '../../themes';
import { moderateScale } from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
// import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { FunctionUtils, NetworkUtils } from "../../utils";
import * as globals from "../../utils/globals";

class ManuallyAddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.inputRefs = {};
    this.state = {
      stickHeaderHeight: 0,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      showPopover: false,
      italyCountryId: '',
      ageValidationYear: '',
      ageValidationMonth: '',
      ageValidationDay: '',
      selectedUserValue: '',
      userDOB: '',
      userERD: '',
      userSelectedAteco: '',
      fiscalCodeValue: '',
      vatCodeValue: '',
      firstNameValue: '',
      lastNameValue: '',
      CFBValue: '',
      perActivityValue: '',
      businesNameValue: '',
      legalValue: '',
      BSValue: '',
      MFHValue: '',
      userStateCode: '',
      userHomeStateCode: '',
      userCountryCode: '',
      atecoCodeId: '',
      userCountryList: [],
      userStateList: [],
      settingCustomerList: [],
      atecoCodeListData: [],
      getLegalNatureList: [],
      selectedStateID: 1,
      selectedUserID: 1,
      radioBtnSelect: true,
      ERDCalenderOpen: false,
      modalVisible: false,
    };
    this.vatCodeValueRef = this.updateRef.bind(this, 'vatCodeValue');
    this.firstNameValueRef = this.updateRef.bind(this, 'firstNameValue');
    this.lastNameValueRef = this.updateRef.bind(this, 'lastNameValue');
    this.CFBValueRef = this.updateRef.bind(this, 'CFBValue');
    this.perActivityValueRef = this.updateRef.bind(this, 'perActivityValue');
    this.businesNameValueRef = this.updateRef.bind(this, 'businesNameValue');
    this.legalValueRef = this.updateRef.bind(this, 'legalValue');
    this.BSValueRef = this.updateRef.bind(this, 'BSValue');
    this.MFHValueRef = this.updateRef.bind(this, 'MFHValue');
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    this.countryAPIList();
    this.atecoCodeAPIList();
    this.customerAPIList();
    this.legalNatureAPIList();
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
    var date = new Date();
    var date1 = date.getUTCDate();
    var month = date.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
    var year = date.getUTCFullYear() - 18;
    this.setState({
      ageValidationYear: year,
      ageValidationMonth: month,
      ageValidationDay: date1,
    });
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

  legalNatureAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getLegalNatureList(globals.tokenValue).then(async () => {
        const { getLegalNatureData, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          getLegalNatureData &&
          getLegalNatureData.data &&
          getLegalNatureData.data.length > 0
        ) {
          var cb = [];
          getLegalNatureData.data.map((item) => {
            cb.push({
              label: item.legal_nature_name,
              value: item.id,
              id: item.id,
            });
          });
          this.setState({
            getLegalNatureList: cb,
          });
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          FunctionUtils.showToast(getLegalNatureData.message);
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
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          FunctionUtils.showToast(countryList.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  customerAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getMyCustomerList(globals.tokenValue).then(async () => {
        const { customerListData } = this.props;
        if (
          customerListData &&
          customerListData.customer_data.data &&
          customerListData.customer_data.data.length > 0
        ) {
          var cb = [];
          customerListData.customer_data.data.map((item) => {
            if (item.first_name !== null) {
              cb.push({
                label: item.first_name + ' ' + item.last_name,
                value: item.id,
                id: item.id,
              });
            }
          });
          this.setState({
            settingCustomerList: cb,
          });
        } else {
          FunctionUtils.showToast(customerListData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  stateValueSetting(value) {
    this.setState({ userCountryCode: value, italyCountryId: value });
    this.stateAPIList(value);
  }

  legalNatureValueSetting(value) {
    this.setState({ legalValue: value });
  }

  stateAPIList(id) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserStateList(globals.tokenValue, id).then(async () => {
        const { stateList } = this.props;
        if (stateList && stateList.data && stateList.data.length > 0) {
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

  atecoCodeAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getAtecoCodeList(globals.tokenValue).then(async () => {
        const { atecoCodeList } = this.props;
        if (
          atecoCodeList &&
          atecoCodeList.data &&
          atecoCodeList.data.length > 0
        ) {
          this.setState({
            atecoCodeListData: atecoCodeList.data,
          });
        } else {
          FunctionUtils.showToast(atecoCodeList.message);
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

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  showERDDatePicker = () => {
    this.setERDDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  hideERDDatePicker = () => {
    this.setERDDatePickerVisibility(false);
  };

  setERDDatePickerVisibility = (status) => {
    this.setState({ ERDCalenderOpen: status });
  };

  setDatePickerVisibility = (status) => {
    this.setState({ calenderOpenstatus: status });
  };

  handleConfirm = (date) => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({ userDOB: date.format("DD/MM/YYYY") });
    this.hideDatePicker();
  };

  handleERDConfirm = (date) => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({ userERD: date.format("DD/MM/YYYY") });
    this.hideDatePicker();
  };

  changeRadioBtnStatus(stateVarName, value) {
    this.setState({
      radioBtnSelect: !this.state.radioBtnSelect,
      selectedUserID: value,
    });
  }

  validationCheckNatural() {
    const {
      fiscalCodeValue,
      vatCodeValue,
      firstNameValue,
      lastNameValue,
      CFBValue,
      perActivityValue,
      businesNameValue,
      userHomeStateCode,
      userCountryCode,
      selectedUserID,
      userStateCode,
      userDOB,
      userERD,
      atecoCodeId,
    } = this.state;
    if (fiscalCodeValue == "") {
      FunctionUtils.showToast(strings.fiscalCodeBlankError);
    } else if (vatCodeValue == '') {
      FunctionUtils.showToast(strings.vatCodeBlankError);
    } else if (firstNameValue == '') {
      FunctionUtils.showToast(strings.firstNameBlankError);
    } else if (lastNameValue == '') {
      FunctionUtils.showToast(strings.lastNameBlankError);
    } else if (userDOB == "") {
      FunctionUtils.showToast(strings.userDOBBlankError);
    }
    // else if (!FunctionUtils.validateUserAgeLength(userDOB)) {
    //   FunctionUtils.showToast(strings.ageValidError);
    // }
    else if (CFBValue == "") {
      FunctionUtils.showToast(strings.commonForeignBlankError);
    } else if (
      userCountryCode == "" ||
      userCountryCode == null ||
      userCountryCode == undefined
    ) {
      FunctionUtils.showToast(strings.birthCounteryBlankError);
    } else if (
      userStateCode == '' ||
      userStateCode == null ||
      userStateCode == undefined
    ) {
      FunctionUtils.showToast(strings.birthStateBlankError);
    } else if (
      atecoCodeId == '' ||
      atecoCodeId == null ||
      atecoCodeId == undefined
    ) {
      FunctionUtils.showToast(strings.atecoCodeBlankError);
    } else if (userERD == "") {
      FunctionUtils.showToast(strings.userERDBlankError);
    } else if (perActivityValue == '') {
      FunctionUtils.showToast(strings.performedActivityBlankError);
    } else if (businesNameValue == '') {
      FunctionUtils.showToast(strings.businessNameBlankError);
    } else {
      Actions.CompleteManuallyAddCustomer({
        fiscalCodeValue: fiscalCodeValue,
        vatCodeValue: vatCodeValue,
        selectedUserValue: this.state.selectedUserValue,
        firstNameValue: firstNameValue,
        lastNameValue: lastNameValue,
        CFBValue: CFBValue,
        perActivityValue: perActivityValue,
        businesNameValue: businesNameValue,
        userDOB: userDOB,
        userERD: userERD,
        userStateCode: userStateCode,
        userHomeStateCode: userHomeStateCode,
        userCountryCode: userCountryCode,
        selectedUserID: selectedUserID,
        atecoCodeValue: atecoCodeId,
      });
    }
  }

  validationCheckSociaty() {
    const {
      fiscalCodeValue,
      vatCodeValue,
      businesNameValue,
      userStateCode,
      userCountryCode,
      userERD,
      legalValue,
      BSValue,
      atecoCodeId,
      selectedUserID,
    } = this.state;
    if (fiscalCodeValue == "") {
      FunctionUtils.showToast(strings.fiscalCodeBlankError);
    } else if (vatCodeValue == '') {
      FunctionUtils.showToast(strings.vatCodeBlankError);
    } else if (businesNameValue == '') {
      FunctionUtils.showToast(strings.businessNameBlankError);
    } else if (BSValue == "") {
      FunctionUtils.showToast(strings.businessSectorBlankError);
    } else if (
      userCountryCode == "" ||
      userCountryCode == null ||
      userCountryCode == undefined
    ) {
      FunctionUtils.showToast(strings.birthCounteryBlankError);
    } else if (legalValue == '') {
      FunctionUtils.showToast(strings.legalNatureBlankError);
    } else if (!FunctionUtils.validateNumber(legalValue)) {
      FunctionUtils.showToast(strings.numberOnlyError);
    } else if (userERD == "") {
      FunctionUtils.showToast(strings.userERDBlankError);
    } else if (
      atecoCodeId == '' ||
      atecoCodeId == null ||
      atecoCodeId == undefined
    ) {
      FunctionUtils.showToast(strings.atecoCodeBlankError);
    } else {
      Actions.CompleteManuallyAddCustomer({
        fiscalCodeValue: fiscalCodeValue,
        vatCodeValue: vatCodeValue,
        selectedUserValue: this.state.selectedUserValue,
        businesNameValue: businesNameValue,
        legalValue: legalValue,
        BSValue: BSValue,
        userERD: this.state.userERD,
        userStateCode: userStateCode,
        userCountryCode: userCountryCode,
        atecoCodeValue: atecoCodeId,
        selectedUserID: selectedUserID,
      });
    }
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  atecoCodeSetup(status, value, secondLevelDef) {
    this.setState({
      atecoCodeId: value.id,
      userSelectedAteco: secondLevelDef,
      modalVisible: status,
    });
  }

  atecoCodeViewDesign(atecoItem, index) {
    return (
      <View>
        <Text style={styles.text}>
          {atecoItem.ac_first_level_code} -{' '}
          {atecoItem.ac_first_level_description}
        </Text>
        {atecoItem.second_levels && atecoItem.second_levels.length > 0
          ? atecoItem.second_levels.map((item, index) => {
              return this.atecoCodeSecondViewDesign(
                item,
                atecoItem.ac_first_level_code,
                atecoItem.ac_first_level_description
              );
            })
          : null}
      </View>
    );
  }

  atecoCodeSecondViewDesign(item, codeLevel, secondLevelDef) {
    return (
      <View>
        <Text style={styles.text}>
          {codeLevel}.{item.ac_second_level_code} -{' '}
          {item.ac_second_level_description}
        </Text>
        {item.ateco_codes && item.ateco_codes.length > 0
          ? item.ateco_codes.map((item, index) => {
              return this.atecoCodeMainViewDesign(item, index, secondLevelDef);
            })
          : null}
      </View>
    );
  }

  atecoCodeMainViewDesign(item, index, secondLevelDef) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.atecoCodeSetup(false, item, secondLevelDef);
        }}
        style={{ left: moderateScale(12), borderWidth: 0 }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.text, { color: colors.colorBlack }]}>
            {item.ateco_code} -{' '}
          </Text>
          <Text style={[styles.text, { color: colors.colorBlack }]}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  naturalViewDesign() {
    const {
      fiscalCodeValue,
      vatCodeValue,
      firstNameValue,
      lastNameValue,
      CFBValue,
      perActivityValue,
      businesNameValue,
      userCountryList,
      userSelectedAteco,
      userStateList,
      userDOB,
      userERD,
      ageValidationYear,
      ageValidationMonth,
      ageValidationDay,
      italyCountryId,
    } = this.state;
    console.log(
      '========',
      ageValidationYear,
      ageValidationMonth,
      ageValidationDay
    );
    return (
      <View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.fiscal}
              value={fiscalCodeValue}
              onChangeText={(text) => {
                this.setState({ fiscalCodeValue: text });
              }}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.vatCodeValue.focus();
              }}
              blurOnSubmit={false}
            />
            {fiscalCodeValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.vatNo}
              value={vatCodeValue}
              onChangeText={(text) => {
                this.setState({ vatCodeValue: text });
              }}
              ref={this.vatCodeValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.firstNameValue.focus();
              }}
              blurOnSubmit={false}
            />
            {vatCodeValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.firstN}
              value={firstNameValue}
              ref={this.firstNameValueRef}
              onChangeText={(text) => {
                this.setState({
                  firstNameValue: text.replace(/[^a-zA-Z]/g, ''),
                });
              }}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.lastNameValue.focus();
              }}
              blurOnSubmit={false}
            />
            {firstNameValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.lastN}
              value={lastNameValue}
              onChangeText={(text) => {
                this.setState({
                  lastNameValue: text.replace(/[^a-zA-Z]/g, ''),
                });
              }}
              ref={this.lastNameValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.CFBValue.focus();
              }}
              blurOnSubmit={false}
            />
            {lastNameValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={styles.commonBoxHeight}>
            <Text style={styles.calenderTextBoxDesign}>
              {userDOB ? userDOB : strings.DOB}
              {userDOB == '' ? (
                <Text style={styles.redStarDesign}>{strings.Star}</Text>
              ) : null}
            </Text>
            <View style={styles.endView}>
              <TouchableOpacity
                onPress={() => {
                  this.showDatePicker();
                }}
              >
                <Image
                  source={images.calender}
                  style={styles.sideDropDownArrImg}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={this.state.calenderOpenstatus}
              mode="date"
              date={
                new Date(
                  ageValidationYear,
                  ageValidationMonth,
                  ageValidationDay
                )
              }
              maximumDate={
                new Date(
                  ageValidationYear,
                  ageValidationMonth,
                  ageValidationDay
                )
              }
              // maximumDate={new Date(Date.now() - 86400000)}
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.commonFB}
              value={CFBValue}
              onChangeText={(text) => {
                this.setState({ CFBValue: text });
              }}
              ref={this.CFBValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.perActivityValue.focus();
              }}
              blurOnSubmit={false}
            />
            {CFBValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{ label: strings.BS, value: null }}
              onValueChange={(value) => this.stateValueSetting(value)}
              items={userCountryList}
              style={{ ...pickerCalenderStyles }}
            />
            {Platform.OS == 'ios' ? (
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

        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{ label: strings.BP, value: null }}
              onValueChange={(value) => this.setState({ userStateCode: value })}
              items={userStateList}
              style={{ ...pickerCalenderStyles }}
            />
            {Platform.OS == 'ios' ? (
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
        {italyCountryId === 107 ? (
          <View style={styles.secondBoxMainView}>
            <View style={styles.commonCalenderBoxHeight}>
              <RNPickerSelect
                placeholder={{ label: strings.HS, value: null }}
                onValueChange={(value) =>
                  this.setState({ userHomeStateCode: value })
                }
                items={userStateList}
                style={{ ...pickerCalenderStyles }}
              />
              {Platform.OS == 'ios' ? (
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
        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <TouchableOpacity onPress={() => this.toggleModal(true)}>
              <Text
                style={{
                  color: colors.colorGray,
                  paddingLeft: moderateScale(13),
                  paddingTop: moderateScale(5),
                }}
              >
                {userSelectedAteco ? userSelectedAteco : strings.AC}
              </Text>
            </TouchableOpacity>
            <View style={styles.endView}>
              <Image
                source={images.down}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(10),
                  top: moderateScale(10),
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={styles.commonBoxHeight}>
            <Text style={styles.calenderTextBoxDesign}>
              {userERD ? userERD : strings.ERD}
              {userERD == '' ? (
                <Text style={styles.redStarDesign}>{strings.Star}</Text>
              ) : null}
            </Text>
            <View style={styles.endView}>
              <TouchableOpacity
                onPress={() => {
                  this.showERDDatePicker();
                }}
              >
                <Image
                  source={images.calender}
                  style={styles.sideDropDownArrImg}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={this.state.ERDCalenderOpen}
              mode="date"
              onConfirm={this.handleERDConfirm}
              onCancel={this.hideERDDatePicker}
            />
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.performAct}
              value={perActivityValue}
              onChangeText={(text) => {
                this.setState({ perActivityValue: text });
              }}
              ref={this.perActivityValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.businesNameValue.focus();
              }}
              blurOnSubmit={false}
            />
            {perActivityValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.businesN}
              value={businesNameValue}
              onChangeText={(text) => {
                this.setState({ businesNameValue: text });
              }}
              ref={this.businesNameValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                // this.BSValue.focus();
              }}
              blurOnSubmit={false}
            />
            {businesNameValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  sociatyViewDesign() {
    const {
      fiscalCodeValue,
      vatCodeValue,
      businesNameValue,
      userCountryList,
      userERD,
      userSelectedAteco,
      getLegalNatureList,
      BSValue,
    } = this.state;
    return (
      <View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.fiscal}
              value={fiscalCodeValue}
              onChangeText={(text) => {
                this.setState({ fiscalCodeValue: text });
              }}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.vatCodeValue.focus();
              }}
              blurOnSubmit={false}
            />
            {fiscalCodeValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.vatNo}
              value={vatCodeValue}
              onChangeText={(text) => {
                this.setState({ vatCodeValue: text });
              }}
              ref={this.vatCodeValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.firstNameValue.focus();
              }}
              blurOnSubmit={false}
            />
            {vatCodeValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.businesN}
              value={businesNameValue}
              onChangeText={(text) => {
                this.setState({ businesNameValue: text });
              }}
              ref={this.businesNameValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.BSValue.focus();
              }}
              blurOnSubmit={false}
            />
            {businesNameValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.businesS}
              value={BSValue}
              onChangeText={(text) => {
                this.setState({ BSValue: text });
              }}
              ref={this.BSValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.MFHValue.focus();
              }}
              blurOnSubmit={false}
            />
            {BSValue != "" ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{ label: strings.BS, value: null }}
              onValueChange={(value) => this.stateValueSetting(value)}
              items={userCountryList}
              style={{ ...pickerCalenderStyles }}
            />
            {Platform.OS == 'ios' ? (
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

        <View style={styles.thirdBoxView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{ label: strings.legalN, value: null }}
              onValueChange={(value) => this.legalNatureValueSetting(value)}
              items={getLegalNatureList}
              style={{ ...pickerCalenderStyles }}
            />
            {Platform.OS == 'ios' ? (
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
        <View style={styles.thirdBoxView}>
          <View style={styles.commonBoxHeight}>
            <Text style={styles.calenderTextBoxDesign}>
              {userERD ? userERD : strings.ERD}
              {userERD == '' ? (
                <Text style={styles.redStarDesign}>{strings.Star}</Text>
              ) : null}
            </Text>
            <View style={styles.endView}>
              <TouchableOpacity
                onPress={() => {
                  this.showERDDatePicker();
                }}
              >
                <Image
                  source={images.calender}
                  style={styles.sideDropDownArrImg}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={this.state.ERDCalenderOpen}
              mode="date"
              onConfirm={this.handleERDConfirm}
              onCancel={this.hideERDDatePicker}
            />
          </View>
        </View>
        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <TouchableOpacity onPress={() => this.toggleModal(true)}>
              <Text
                style={{
                  color: colors.colorGray,
                  paddingLeft: moderateScale(13),
                  paddingTop: moderateScale(5),
                }}
              >
                {userSelectedAteco ? userSelectedAteco : strings.AC}
              </Text>
            </TouchableOpacity>
            <View style={styles.endView}>
              <Image
                source={images.down}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(10),
                  top: moderateScale(10),
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { selectedUserID, radioBtnSelect, atecoCodeListData } = this.state;
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
              headerTxtMain={strings.manuallAddCust}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.manuallAddCust}
            />
          )}
        >
          <SafeAreaView>
            <View
              style={{
                borderWidth: 0,
                // marginTop:moderateScale(-40),
                marginHorizontal: moderateScale(15),
              }}
            >
              <View style={styles.firstBoxMainView}>
                <View style={styles.firstRowView}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', borderWidth: 0 }}
                    onPress={() => {
                      this.changeRadioBtnStatus(true, 1);
                    }}
                  >
                    <Image
                      source={
                        radioBtnSelect
                          ? images.radioSelect
                          : images.radioUnselect
                      }
                      style={styles.locationPIN}
                    />
                    <Text numberOfLines={1} style={styles.customerName}>
                      {strings.naturalPerson}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => {
                      this.changeRadioBtnStatus(false, 2);
                    }}
                  >
                    <Image
                      source={
                        radioBtnSelect
                          ? images.radioUnselect
                          : images.radioSelect
                      }
                      style={styles.locationPIN}
                    />
                    <Text style={styles.dateTimeModal}>{strings.sociaty}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                animationType={"slide"}
                // style={{ borderWidth: 10 }}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}
                  style={styles.modal}
                >
                  <View style={styles.mainBoxView}>
                    <FlatList
                      data={atecoCodeListData}
                      renderItem={({ item, index }) =>
                        this.atecoCodeViewDesign(item, index)
                      }
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
              <View>
                <Text numberOfLines={1} style={styles.uploadDocText}>
                  {strings.mainData}
                </Text>
              </View>
              {selectedUserID == 1
                ? this.naturalViewDesign()
                : this.sociatyViewDesign()}
            </View>
            <TouchableOpacity
              onPress={() => {
                selectedUserID == 1
                  ? this.validationCheckNatural()
                  : this.validationCheckSociaty();
              }}
              style={styles.btnCancel}
            >
              <Text style={styles.cancelTxt}>{strings.next}</Text>
              <Image source={images.backLeftArr} style={styles.btnArrowImg} />
            </TouchableOpacity>
          </SafeAreaView>
        </ParallaxScrollView>
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    countryList: state.customerReducer.countryList, //accessing the redux state
    stateList: state.customerReducer.stateList, //accessing the redux state
    atecoCodeList: state.customerReducer.atecoCodeList, //accessing the redux state
    customerDetail: state.customerReducer.customerDetail, //accessing the redux state
    customerListData: state.customerReducer.customerListData, //accessing the redux state
    getLegalNatureData: state.customerReducer.getLegalNatureData, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManuallyAddCustomer);

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
  cancelTxt: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: colors.redColor,
  },
  btnArrowImg: {
    height: moderateScale(12),
    width: moderateScale(18),
    top: moderateScale(-2),
    tintColor: colors.redColor,
    marginLeft: 6,
    transform: [{ rotateY: "180deg" }],
  },
  modal: {
    alignItems: 'center',
    // flex: 1,
    // padding: 100,
    borderWidth: 0,
    top: moderateScale(60),
    height: '100%',
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  mainBoxView: {
    alignItems: "center",
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    height: '50%',
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    padding: 10,
    margin: moderateScale(20),
    alignSelf: 'center',
    // flex: 1,
    // paddingHorizontal: 10,
    // marginHorizontal: moderateScale(5),
    // marginBottom: moderateScale(15),
    marginTop: moderateScale(160),
  },
  text: {
    color: colors.colorGray,
    marginTop: 10,
  },
  redStarDesign: {
    fontSize: moderateScale(15),
    top: moderateScale(10),
    left: moderateScale(10),
    color: colors.redColor,
  },
  redCalenderStarDesign: {
    fontSize: moderateScale(15),
    top: moderateScale(10),
    left: moderateScale(10),
    borderWidth: 0,
    marginRight: moderateScale(80),
    color: colors.redColor,
  },
  endView: {
    alignSelf: 'flex-end',
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
  commonCalenderBoxHeight: {
    height: moderateScale(30),
    borderWidth: 0,
  },
  sideDropDownArrImg: {
    height: moderateScale(16),
    width: moderateScale(16),
    resizeMode: 'contain',
  },
  btnCancel: {
    height: moderateScale(40),
    backgroundColor: colors.white,
    borderWidth: 0.7,
    margin: moderateScale(18),
    borderColor: colors.redColor,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: moderateScale(7),
  },
  secondTochDesign: {
    width: moderateScale(40),
  },
  firstTochDesign: {
    width: moderateScale(300),
  },
  firstBoxMainView: {
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
    height: height * 0.12,
    //width: width - moderateScale(30),
    marginBottom: moderateScale(10),
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
    fontSize: moderateScale(11),
    height: moderateScale(35),
    color: colors.colorGray,
    left: moderateScale(10),
    paddingTop: moderateScale(10),
  },
  redBottomTxt: {
    color: colors.redColor,
    fontSize: moderateScale(14),
    fontFamily: fonts.PoppinsSemiBold,
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
    justifyContent: 'center',
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
    fontWeight: '500',
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
  customerName: {
    fontSize: moderateScale(13),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(10),
  },
  filterOptionRenderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
    width: width * 0.75,
  },
  locationPIN: {
    height: moderateScale(15),
    width: moderateScale(15),
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
    marginTop: moderateScale(3),
  },
  galleryImageDesign: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: 'contain',
    marginLeft: moderateScale(50),
    marginTop: moderateScale(25),
  },
  middleText: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
    textAlign: 'center',
    top: moderateScale(20),
    textAlignVertical: 'center',
  },
  fourthViewText: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
  },
  cameraImageDesign: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: 'contain',
    marginRight: moderateScale(50),
    marginTop: moderateScale(25),
  },
  customerAdd: {
    fontSize: moderateScale(13),
    // color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(8),
    flex: 1,
  },
  dateTimeModal: {
    fontSize: moderateScale(13),
    // color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(8),
  },
  firstRowView: {
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
