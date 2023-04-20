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
  Modal,
  Keyboard,
  findNodeHandle,
  FlatList,
  ScrollView,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const {width, height} = Dimensions.get('window');
import {images, fonts, colors} from '../../themes';
import {moderateScale} from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from '../../redux/actions';
import {FunctionUtils, NetworkUtils} from '../../utils';
import * as globals from '../../utils/globals';
import Loader from '../../components/LoaderOpacity.js';
import NoDataView from '../../components/NoDataView';
import DocumentPicker from 'react-native-document-picker';
import AbsoluteBtn from '../../components/AbsoluteBtn';

class ModifyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      stickHeaderHeight: 0,
      customerType: 1,
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      showPopover: false,
      selectedUserValue: '',
      userDOB: '',
      userERD: '',
      userERDate: '',
      ageValidationYear: '',
      ageValidationMonth: '',
      ageValidationDay: '',
      fiscalCodeValue: '',
      tradName: '',
      vatCodeValue: '',
      firstNameValue: '',
      lastNameValue: '',
      CFBValue: '',
      munBirthabroad: '',
      perActivityValue: '',
      cityofRes: '',
      postalCode: '',
      businesNameValue: '',
      legalValue: '',
      BSValue: '',
      MFHValue: '',
      userStateCode: '',
      userStateName: strings.BP,
      userProvianceName: strings.BP,
      userAtecoCode: '',
      userHomeStateCode: '',
      userHomeStateName: strings.HS,
      userCountryCode: '',
      countryId: '',
      stateCodeId: '',
      naturalBirthProv: '',
      userCountryName: strings.BS,
      legalNatureName: strings.legalN,
      CFRValue: '',
      PCodeValue: '',
      residanceAddress: '',
      residanceAddressId: '',
      userCountryList: [],
      userStateList: [],
      settingCustomerList: [],
      atecoCodeListData: [],
      getLegalNatureList: [],
      selectedStateID: '1',
      selectedUserID: '',
      modalVisible: false,
      subjectType: '',
      domicileResidence: '',
      isLoading: false,
      test: 0,
      italyCountryId: 107,
      CFRUserData: '',
      postCode: '',
      userResidanceAdd: '',
      ERDCalenderOpen: false,
      atecoCodeId: '',
      userDomcileCountry: '',
      userDomcileCountryId: '',
      userDomcileProvience: '',
      userDomcileProvienceId: '',
      userDomcileZipCode: '',
      userDomcileAdd: '',
      userDomcileMFD: '',
      radioBtnSelect: true,
      updateRadioBtnSelect: true,
      DomicileresidenceBtn: true,
      docType: '',
      docName: '',
      updateBtnValue: 2,
      domicileValue: 1,
      subjectTypeValue: 1,
      attorneyRadioBtnSelect: true,
      attorneyBtnValue: 1,
      imagesArray: [],
      docDetail: '',
      base64: '',
      calenderOpenstatus: false,
      dateIdentity: '',
      headAddress: '',
      headPostCode: '',
      headNotes: '',
      customerData: [],
      customerDataList: [],
      birthState: [],
      birthStateValue: 0,
      resiState: [],
      resiStateValue: 0,
      domicileState: [],
      domicileStateValue: 0,
      headquarterState: [],
      headquarterStateValue: 0,
      effectiveOwnerSub: [],
      HideShowCust: true,
      selectedCustIndex: '',
    };
    this.vatCodeValueRef = this.updateRef.bind(this, 'vatCodeValue');
    this.firstNameValueRef = this.updateRef.bind(this, 'firstNameValue');
    this.lastNameValueRef = this.updateRef.bind(this, 'lastNameValue');
    this.CFBValueRef = this.updateRef.bind(this, 'CFBValue');
    this.munBirthabroadRef = this.updateRef.bind(this, 'munBirthabroad');
    this.perActivityValueRef = this.updateRef.bind(this, 'perActivityValue');
    this.cityofResRef = this.updateRef.bind(this, 'cityofRes');
    this.postalCodeRef = this.updateRef.bind(this, 'postCode');
    this.businesNameValueRef = this.updateRef.bind(this, 'businesNameValue');
    this.legalValueRef = this.updateRef.bind(this, 'legalValue');
    this.BSValueRef = this.updateRef.bind(this, 'BSValue');
    this.MFHValueRef = this.updateRef.bind(this, 'MFHValue');
  }

  AddSubject = () => {
    this.setState(prevState => ({
      effectiveOwnerSub: [
        ...prevState.effectiveOwnerSub,
        {
          EffectiveOwner: '',
          EngagementStartDate: '',
          EndDateofAssignment: '',
          DataAcquiredThrough: '',
        },
      ],
    }));
  };

  removeSubject = indexNum => {
    const removeSub = this.state.effectiveOwnerSub.filter(
      (_, index) => index !== indexNum,
    );
    this.setState({effectiveOwnerSub: removeSub});
  };

  HideShowSelectedCust = indexNum => {
    const hideShow = this.state.effectiveOwnerSub.filter(
      (_, index) => index !== indexNum,
    );
    this.setState({HideShowCust: !HideShowCust, selectedCustIndex: indexNum});
  };

  changeRadioBtnStatus(stateVarName) {
    this.setState({
      subjectTypeValue: stateVarName,
      radioBtnSelect: !this.state.radioBtnSelect,
    });
  }
  updateRadioBtnSelect(stateVarName) {
    this.setState({
      updateBtnValue: stateVarName,
      updateRadioBtnSelect: !this.state.updateRadioBtnSelect,
    });
  }
  DomicileresBtn(stateVarName) {
    this.setState({
      domicileValue: stateVarName,
      DomicileresidenceBtn: !this.state.DomicileresidenceBtn,
    });
  }

  attorneyRadioBtn = val => {
    this.setState({
      attorneyRadioBtnSelect: !this.state.attorneyRadioBtnSelect,
      attorneyBtnValue: val,
    });
  };

  componentDidMount() {
    this.customerAPIList();
    this.legalNatureAPIList();
    this.atecoCodeAPIList();
    this.getTransactiondata();
    var year1 = moment().format('YYYY');
    var year2 = moment().year();
    console.log('using format("YYYY") : ', year1);
    console.log('using year(): ', year2);
    // using javascript
    var year3 = new Date().getFullYear();
    console.log('using javascript :', year3);
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

  updateRef(name, ref) {
    this[name] = ref;
  }

  getTransactiondata() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props
        .getProfessionaTransaction(globals.tokenValue)
        .then(async () => {
          const {professionalPerformanceData, msgError} = this.props;
          console.log(
            'modifyprofessionalPerformanceData',
            professionalPerformanceData,
          );
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            professionalPerformanceData !== ''
            // professionalPerformanceData.risk_assess_data.length > 0 &&
            // professionalPerformanceData.value_data.length > 0 &&
            // professionalPerformanceData.professional_data.length > 0
          ) {
            let currency = FunctionUtils.pickerArraySelectDataType(
              professionalPerformanceData.currency_data,
            );
            let fractional = FunctionUtils.pickerArraySelectDataType(
              professionalPerformanceData.fractional_data,
            );
            let destCountry = FunctionUtils.pickerArraySelectDataType(
              professionalPerformanceData.country_data,
            );
            let type = FunctionUtils.pickerArraySelectDataType(
              professionalPerformanceData.type_data,
            );
            let reason = FunctionUtils.pickerArraySelectDataType(
              professionalPerformanceData.professional_data,
            );
            this.setState({
              professionalPerformance:
                professionalPerformanceData.professional_data,
              riskAssetmentData: professionalPerformanceData.risk_assess_data,
              valueData: professionalPerformanceData.value_data,
              typeData: type,
              fractionalData: fractional,
              currencyData: currency,
              birthState: destCountry,
              resiState: destCountry,
              domicileState: destCountry,
              headquarterState: destCountry,
              isLoading: false,
              profData: Object.entries(
                professionalPerformanceData.professionista,
              ),
              amountType: professionalPerformanceData.value_data,
              paymentMethodData: Object.entries(
                professionalPerformanceData.meanpayment,
              ),
              reasonData: reason,
              carriedoutby: Object.entries(
                professionalPerformanceData.carriedoutby,
              ),
              customerData: Object.entries(
                professionalPerformanceData.customer_data,
              ),
            });
            this.customerDataMap();
          } else if (value && value == 'Unauthenticated.') {
            this.setState({isLoading: false});
            FunctionUtils.clearLogin();
          } else {
            this.setState({
              isLoading: false,
            });
            // FunctionUtils.showToast(strings.noData);
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  customerDataMap = () => {
    let cb = [];
    this.state.customerData.map(([key, items], index) => {
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    this.setState({customerDataList: cb});
    return cb;
  };

  naturalViewDataSetup(customerDetail) {
    console.log('customerDetail>>>', customerDetail);
    this.setState({
      fiscalCodeValue: customerDetail.data.fiscal_code,
      vatCodeValue: customerDetail.data.vat_number,
      firstNameValue: customerDetail.data.first_name,
      lastNameValue: customerDetail.data.last_name,
      CFBValue: customerDetail.data.common_foreign_birth,
      perActivityValue: customerDetail.data.performed_activity,
      businesNameValue: customerDetail.data.business_name,
      userDOB: customerDetail.data.date_of_birth,
      userERD: customerDetail.data.relation_end_date,
      subjectType: customerDetail.data.customer_type,
      domicileResidence: customerDetail.data.is_domicile_residence,
      CFRValue: customerDetail.data.customerDetails.municipal_foreign_residence,
      PCodeValue: customerDetail.data.customerDetails.residence_postal_code,
      residanceAddress:
        customerDetail.data.residenceStateData !== null
          ? customerDetail.data.residenceStateData.name
          : null,
      residanceAddressId:
        customerDetail.data.residenceStateData !== null
          ? customerDetail.data.residenceStateData.id
          : null,
      BSValue: customerDetail.data.business_sector,
      legalValue:
        customerDetail.data.legal_nature_id !== null
          ? customerDetail.data.legal_nature_id
          : null,
      legalNatureName:
        customerDetail.data.legalNatureData !== null
          ? customerDetail.data.legalNatureData.legal_nature_name
          : null,
      MFHValue: customerDetail.data.municipal_foreign_headqrtr,
      userStateCode: customerDetail.data.residence_state_id,
      userStateName:
        customerDetail.data.birthStateData !== null
          ? customerDetail.data.birthStateData.name
          : null,
      userAtecoCode:
        customerDetail.data.atecoCodeData !== null
          ? customerDetail.data.atecoCodeData.ateco_code
          : null,
      atecoCodeId:
        customerDetail.data.atecoCodeData !== null
          ? customerDetail.data.atecoCodeData.id
          : null,
      CFRUserData:
        customerDetail.data.customerDetails.common_foreign_residence !== null
          ? customerDetail.data.customerDetails.common_foreign_residence
          : null,
      userProvianceName:
        customerDetail.data.birthProvinceData !== null
          ? customerDetail.data.birthProvinceData.name
          : null,
      postCode: customerDetail.data.postcode_residence,
      countryId:
        customerDetail.data.birth_state !== null
          ? customerDetail.data.birth_state
          : null,
      userResidanceAdd:
        customerDetail.data.userResidanceAdd !== null
          ? customerDetail.data.userResidanceAdd
          : null,
      userDomcileCountry:
        customerDetail.data.domicileCountryData !== null
          ? customerDetail.data.domicileCountryData.name
          : null,
      userDomcileCountryId:
        customerDetail.data.domicile_country !== null
          ? customerDetail.data.domicile_country
          : null,
      userDomcileProvience:
        customerDetail.data.domicileProvinceData !== null
          ? customerDetail.data.domicileProvinceData.name
          : null,
      userDomcileProvienceId:
        customerDetail.data.domicileProvinceData !== null
          ? customerDetail.data.domicileProvinceData.id
          : null,
      userDomcileZipCode:
        customerDetail.data.domicile_zipcode !== null
          ? customerDetail.data.domicile_zipcode
          : null,
      userDomcileAdd:
        customerDetail.data.domicile_home_address !== null
          ? customerDetail.data.domicile_home_address
          : null,
      isLoading: false,
      userDomcileMFD:
        customerDetail.data.municipal_foreign_domicile !== null
          ? customerDetail.data.municipal_foreign_domicile
          : null,
    });
  }

  sociatyViewDataSetup(customerDetail) {
    this.setState({
      fiscalCodeValue: customerDetail.data.fiscal_code,
      vatCodeValue: customerDetail.data.vat_number,
      firstNameValue: customerDetail.data.first_name,
      lastNameValue: customerDetail.data.last_name,
      CFBValue: customerDetail.data.common_foreign_birth,
      perActivityValue: customerDetail.data.performed_activity,
      businesNameValue: customerDetail.data.business_name,
      userDOB: customerDetail.data.date_of_birth,
      userERD: customerDetail.data.relation_end_date,
      subjectType: customerDetail.data.customer_type,

      domicileResidence: customerDetail.data.is_domicile_residence,
      CFRValue: customerDetail.data.customerDetails.municipal_foreign_residence,
      PCodeValue: customerDetail.data.customerDetails.residence_postal_code,
      residanceAddress:
        customerDetail.data.residenceStateData !== null
          ? customerDetail.data.residenceStateData.name
          : null,
      residanceAddressId:
        customerDetail.data.residenceStateData !== null
          ? customerDetail.data.residenceStateData.id
          : null,
      BSValue: customerDetail.data.business_sector,
      legalValue:
        customerDetail.data.legal_nature_id !== null
          ? customerDetail.data.legal_nature_id
          : null,
      legalNatureName:
        customerDetail.data.legalNatureData !== null
          ? customerDetail.data.legalNatureData.legal_nature_name
          : null,
      MFHValue: customerDetail.data.municipal_foreign_headqrtr,
      userStateCode: customerDetail.data.residence_state_id,
      userStateName:
        customerDetail.data.birthStateData !== null
          ? customerDetail.data.birthStateData.name
          : null,
      userAtecoCode:
        customerDetail.data.atecoCodeData !== null
          ? customerDetail.data.atecoCodeData.ateco_code
          : null,
      atecoCodeId:
        customerDetail.data.atecoCodeData !== null
          ? customerDetail.data.atecoCodeData.id
          : null,
      CFRUserData:
        customerDetail.data.customerDetails.common_foreign_residence !== null
          ? customerDetail.data.customerDetails.common_foreign_residence
          : null,
      userResidanceAdd:
        customerDetail.data.userResidanceAdd !== null
          ? customerDetail.data.userResidanceAdd
          : null,
      // atecoCodeId: customerDetail.data.atecoCodeData.id,
      userProvianceName:
        customerDetail.data.birthProvinceData !== null
          ? customerDetail.data.birthProvinceData.name
          : null,
      postCode: customerDetail.data.postcode_residence,
      countryId:
        customerDetail.data.birth_state !== null
          ? customerDetail.data.birth_state
          : null,
      // userCountryName:
      //   customerDetail.data.country !== null
      //     ? customerDetail.data.country.name
      //     : null,
      isLoading: false,
    });
  }

  getCustomerDetail(id) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      // this.setState({ isLoading: true });
      this.props.getCustomerDetails(globals.tokenValue, id).then(async () => {
        const {customerDetail} = this.props;
        console.log('-------customerDetail', customerDetail);
        if (customerDetail && customerDetail.data) {
          {
            this.setState({
              customerType: customerDetail.data.subject_type,
            });
            customerDetail.data.subject_type == 1
              ? this.naturalViewDataSetup(customerDetail)
              : this.sociatyViewDataSetup(customerDetail);
          }
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
        const {countryList, msgError} = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (countryList && countryList.data && countryList.data.length > 0) {
          var cb = [];
          countryList.data.map(item => {
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
          this.setState({isLoading: false});
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
      this.setState({isLoading: true});
      this.props.getMyCustomerList(globals.tokenValue).then(async () => {
        const {customerListData} = this.props;
        console.log('customerListData>><', customerListData);
        if (
          customerListData &&
          customerListData.customer_data.data &&
          customerListData.customer_data.data.length > 0
        ) {
          var cb = [];
          customerListData.customer_data.data.map(item => {
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
            isLoading: false,
          });
        } else {
          this.setState({isLoading: false});
        }
      });
    } else {
      this.setState({isLoading: false});
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  legalNatureAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getLegalNatureList(globals.tokenValue).then(async () => {
        const {getLegalNatureData, msgError} = this.props;
        console.log('getLegalNatureData>>>', getLegalNatureData);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          getLegalNatureData &&
          getLegalNatureData.data &&
          getLegalNatureData.data.length > 0
        ) {
          var cb = [];
          getLegalNatureData.data.map(item => {
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
          this.setState({isLoading: false});
          FunctionUtils.clearLogin();
        } else {
          FunctionUtils.showToast(getLegalNatureData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  stateValueSetting(value) {
    if (value != null) {
      this.setState({countryId: value, birthStateValue: value});
      this.stateAPIList(value);
    }
  }

  stateAPIList(id) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserStateList(globals.tokenValue, id).then(async () => {
        const {stateList} = this.props;
        console.log('stateList>>>', stateList);
        if (stateList.data && stateList.data.length > 0) {
          var cb = [];
          stateList.data.map(item => {
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

  stateUserAPIList(id) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserStateList(globals.tokenValue, id).then(async () => {
        const {stateList} = this.props;
        if (stateList.data && stateList.data.length > 0) {
          var cb = [];
          stateList.data.map(item => {
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
        const {atecoCodeList} = this.props;
        console.log('atecoCodeList>>>', atecoCodeList);
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

  setFilterOptionsView = e => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({popoverAnchor: {x, y, width, height}});
      });
    }
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  setDatePickerVisibility = status => {
    this.setState({calenderOpenstatus: status});
  };

  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }

  handleConfirm = date => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({userDOB: date.format('DD/MM/YYYY')});

    var dob = new Date();
    //calculate month difference from current date in time
    var month_diff = Date.now();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    console.log('---------age', month_diff, age_dt, year, age);
    // var ageDifMs = Date.now() - date.getTime();
    // var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // console.log(
    //   '----',
    //   ageDifMs,
    //   ageDate,
    //   Math.abs(ageDate.getUTCFullYear() - 1970)
    // );

    this.hideDatePicker();
  };

  // handleConfirmERD = date => {
  //   var ds = date.toString();
  //   var date = moment(new Date(ds.substr(0, 16)));
  //   this.setState({userERD: date.format('DD/MM/YYYY')});
  //   this.hideDatePicker();
  // };

  showERDDatePicker = () => {
    // this.setERDDatePickerVisibility(true);
    this.setState({ERDCalenderOpen: true});
  };

  setERDDatePickerVisibility = status => {
    this.setState({ERDCalenderOpen: status});
  };

  handleERDConfirm = (date) => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({
      userERDate: date.format('DD/MM/YYYY'),
    });
    this.hideERDDatePicker();
  };

  hideERDDatePicker = () => {
    this.setState({ERDCalenderOpen: false});
  };

  setCustomeAccessData(value) {
    if (value !== null) {
      this.countryAPIList();
      this.atecoCodeAPIList();
      this.getCustomerDetail(value);
      this.setState({selectedUserID: value});
      setTimeout(() => {}, 100);
    }
  }

  legalNatureValueSetting(value) {
    if (value !== null) {
      setTimeout(() => {
        this.setState({legalValue: value});
      }, 100);
    }
  }

  atecoCodeViewDesign(atecoItem, index) {
    return (
      <View>
        <Text style={styles.text}>
          {atecoItem.ac_first_level_code} -{' '}
          {atecoItem.ac_first_level_description}
        </Text>
        {/* {atecoItem.second_levels && atecoItem.second_levels.length > 0
          ? atecoItem.second_levels.map((item, index) => {
              return this.atecoCodeSecondViewDesign(
                item,
                atecoItem.ac_first_level_code,
              );
            })
          : null} */}
        <FlatList
          data={atecoItem.second_levels}
          renderItem={(item, index) => {
            return this.atecoCodeSecondViewDesign(
              item,
              atecoItem.ac_first_level_code,
            );
          }}
        />
      </View>
    );
  }

  atecoCodeSecondViewDesign(item, codeLevel) {
    return (
      <View>
        <Text style={styles.text}>
          {codeLevel}.{item.item.ac_second_level_code} -{' '}
          {item.item.ac_second_level_description}
        </Text>
        {/* {item.ateco_codes && item.ateco_codes.length > 0
          ? item.ateco_codes.map((item, index) => {
              return this.atecoCodeMainViewDesign(item, index);
            })
          : null} */}
        <FlatList
          data={item.item.ateco_codes}
          renderItem={(items, index) => {
            return this.atecoCodeMainViewDesign(items, index);
          }}
        />
      </View>
    );
  }

  atecoCodeMainViewDesign(item, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.toggleModal(false);
          this.setState({
            userAtecoCode: item.item.id,
            atecoCodeId: item.item.id,
          });
        }}
        style={{left: moderateScale(12)}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.text, {color: colors.colorBlack}]}>
            {item.item.ateco_code} -{' '}
          </Text>
          <Text style={[styles.text, {color: colors.colorBlack}]}>
            {item.item.description}
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
      munBirthabroad,
      userStateName,
      perActivityValue,
      cityofRes,
      postalCode,
      businesNameValue,
      userCountryList,
      userStateList,
      userDOB,
      ageValidationYear,
      ageValidationMonth,
      ageValidationDay,
      userAtecoCode,
      userProvianceName,
      userERD,
      userERDate,
      italyCountryId,
      DomicileresidenceBtn,
      updateBtnValue,
    } = this.state;
    return (
      <>
        {updateBtnValue == 2 && (
          <View>
            {/* <Text numberOfLines={1} style={styles.inputHeader}>
              {strings.firstN}{' '}
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            </Text> */}
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.firstN}
                  value={firstNameValue}
                  ref={this.firstNameValueRef}
                  onChangeText={text => {
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
                {/* {firstNameValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )} */}
              </View>
            </View>
            {/* <Text numberOfLines={1} style={styles.inputHeader}>
              {strings.lastN}{' '}
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            </Text> */}
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.lastN}
                  value={lastNameValue}
                  onChangeText={text => {
                    this.setState({
                      lastNameValue: text.replace(/[^a-zA-Z]/g, ''),
                    });
                  }}
                  ref={this.lastNameValueRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.fiscalCodeValue.focus();
                  }}
                  blurOnSubmit={false}
                />
                {/* {lastNameValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )} */}
              </View>
            </View>
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.fiscal}
                  value={fiscalCodeValue}
                  onChangeText={text => {
                    this.setState({fiscalCodeValue: text});
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.vatCodeValue.focus();
                  }}
                  blurOnSubmit={false}
                />
                {fiscalCodeValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.vatNo}
                  value={vatCodeValue}
                  onChangeText={text => {
                    this.setState({vatCodeValue: text});
                  }}
                  ref={this.vatCodeValueRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.businesNameValue.focus();
                  }}
                  blurOnSubmit={false}
                />
                {vatCodeValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.businesN}
                  value={businesNameValue}
                  onChangeText={text => {
                    this.setState({businesNameValue: text});
                  }}
                  ref={this.businesNameValueRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.perActivityValue.focus();
                  }}
                  blurOnSubmit={false}
                />
                {businesNameValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>
            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.performAct}
                  value={perActivityValue}
                  // onSubmitEditing={() => {
                  //   Keyboard.dismiss();
                  // }}
                  onChangeText={text => {
                    this.setState({perActivityValue: text});
                  }}
                  ref={this.perActivityValueRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.munBirthabroad.focus();
                  }}
                  blurOnSubmit={false}
                />
                {perActivityValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
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
                    }}>
                    {userAtecoCode ? userAtecoCode : strings.AC}
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
                  {userDOB ? userDOB : strings.DOB}
                  {userDOB == '' ? (
                    <Text style={styles.redStarDesign}>{strings.Star}</Text>
                  ) : null}
                </Text>
                <View style={styles.endView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.showDatePicker();
                    }}>
                    <Image
                      source={images.calender}
                      style={styles.sideDropDownArrImg}
                    />
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  isVisible={this.state.calenderOpenstatus}
                  mode="date"
                  // date={
                  //   new Date(
                  //     ageValidationYear,
                  //     ageValidationMonth,
                  //     ageValidationDay,
                  //   )
                  // }
                  // maximumDate={
                  //   new Date(
                  //     ageValidationYear,
                  //     ageValidationMonth,
                  //     ageValidationDay,
                  //   )
                  // }
                  // maximumDate={new Date(Date.now() - 86400000)}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                />
              </View>
            </View>

            {/* <View style={styles.thirdBoxView}>
              <View style={styles.commonBoxHeight}>
                <Text style={styles.calenderTextBoxDesign}>
                  {userDOB ? userDOB : strings.stateBirth}
                  {userDOB == '' ? (
                    <Text style={styles.redStarDesign}>{strings.Star}</Text>
                  ) : null}
                </Text>
                          <View style={styles.endView}>
                        <TouchableOpacity
                          onPress={() => {
                            this.showDatePicker();
                          }}>
                          <Image
                            source={images.calender}
                            style={styles.sideDropDownArrImg}
                          />
                        </TouchableOpacity>
                      </View>
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
                <DateTimePickerModal
                  isVisible={this.state.calenderOpenstatus}
                  mode="date"
                  date={
                    new Date(
                      ageValidationYear,
                      ageValidationMonth,
                      ageValidationDay,
                    )
                  }
                  maximumDate={
                    new Date(
                      ageValidationYear,
                      ageValidationMonth,
                      ageValidationDay,
                    )
                  }
                  // maximumDate={new Date(Date.now() - 86400000)}
                  onConfirm={this.handleConfirm}
                  onCancel={this.hideDatePicker}
                />
              </View>
            </View> */}

            <View
              style={[
                styles.commonRowType,
                {width: moderateScale(340), alignSelf: 'center'},
              ]}>
              <View style={styles.uploadCSVBoxView}>
                <RNPickerSelect
                  placeholder={{
                    label: strings.stateBirth,
                    value: null,
                  }}
                  onValueChange={value => this.stateValueSetting(value)}
                  items={this.state.birthState}
                  style={{...pickerSelectStyles}}
                />
                {Platform.OS == 'ios' ? (
                  <View style={styles.endView}>
                    <Image
                      source={images.down}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(10),
                        marginTop: moderateScale(20),
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            {/* <View style={styles.secondBoxMainView}>
              <View style={styles.commonCalenderBoxHeight}>
                <RNPickerSelect
                  placeholder={{
                    label: userStateName !== null ? userStateName : strings.HS,
                    value: null,
                  }}
                  onValueChange={value => {
                    this.setState({userStateCode: value, countryId: value});
                  }}
                  items={userCountryList}
                  style={{...pickerCalenderStyles}}
                />
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
            </View> */}

            <View
              style={[
                styles.commonRowType,
                {width: moderateScale(340), alignSelf: 'center'},
              ]}>
              <View style={styles.uploadCSVBoxView}>
                {/* <RNPickerSelect
                  placeholder={{
                    label: userStateName !== null ? userStateName : strings.HS,
                    value: null,
                  }}
                  onValueChange={value =>
                    this.setState({userStateCode: value, countryId: value})
                  }
                  items={userCountryList}
                  style={{...pickerSelectStyles}}
                /> */}
                <RNPickerSelect
                  placeholder={{
                    label:
                      userProvianceName !== null
                        ? userProvianceName
                        : strings.BS,
                    value: null,
                  }}
                  // onValueChange={value => {
                  //   value != null ? this.setState({stateCodeId: value}) : null;
                  // }}
                  onValueChange={value => {
                    this.setState({naturalBirthProv: value});
                  }}
                  items={userStateList}
                  style={{...pickerSelectStyles}}
                />
                {Platform.OS == 'ios' ? (
                  <View style={styles.endView}>
                    <Image
                      source={images.down}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(10),
                        marginTop: moderateScale(20),
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.mBirthabroad}
                  value={munBirthabroad}
                  onChangeText={text => {
                    this.setState({munBirthabroad: text});
                  }}
                  ref={this.munBirthabroadRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    this.CFBValue.focus();
                  }}
                  blurOnSubmit={false}
                />
                {munBirthabroad != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.commonFB}
                  value={CFBValue}
                  onChangeText={text => {
                    this.setState({CFBValue: text});
                  }}
                  ref={this.CFBValueRef}
                  returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   this.perActivityValue.focus();
                  // }}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={false}
                />
                {CFBValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>

            {/* {italyCountryId === this.state.countryId ? (
              <View style={styles.secondBoxMainView}>
                <View style={styles.commonCalenderBoxHeight}>
                  <RNPickerSelect
                    placeholder={{
                      label:
                        userProvianceName !== null
                          ? userProvianceName
                          : strings.BS,
                      value: null,
                    }}
                    onValueChange={value => {
                      value != null
                        ? this.setState({stateCodeId: value})
                        : null;
                    }}
                    items={userStateList}
                    style={{...pickerCalenderStyles}}
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
            ) : null} */}

            <View style={styles.thirdBoxView}>
              <View style={styles.commonBoxHeight}>
                <Text style={styles.calenderTextBoxDesign}>
                  {userERDate ? userERDate : strings.ERD}
                  {userERDate == '' ? (
                    <Text style={styles.redStarDesign}>{strings.Star}</Text>
                  ) : null}
                </Text>
                <View style={styles.endView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.showERDDatePicker();
                    }}>
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

            {/* <View style={styles.thirdBoxView}>
              <View style={styles.commonBoxHeight}>
                <Text style={styles.calenderTextBoxDesign}>
                  {userERDate ? userERDate : strings.ERD}
                  {userERDate == '' ? (
                    <Text style={styles.redStarDesign}>{strings.Star}</Text>
                  ) : null}
                </Text>
                <View style={styles.endView}>
                  <TouchableOpacity
                    onPress={() => {
                      this.showERDDatePicker();
                    }}>
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
            </View> */}
            <View>
              <Text
                numberOfLines={1}
                style={[
                  styles.uploadDocText,
                  {marginBottom: moderateScale(10)},
                ]}>
                {strings.ResiAdd}
              </Text>
            </View>
            <View
              style={[
                styles.commonRowType,
                {width: moderateScale(340), alignSelf: 'center'},
              ]}>
              <View style={styles.uploadCSVBoxView}>
                <RNPickerSelect
                  placeholder={{
                    label: strings.resState,
                    value: null,
                  }}
                  onValueChange={value => this.stateValueSetting(value)}
                  items={this.state.resiState}
                  style={{...pickerSelectStyles}}
                />
                {Platform.OS == 'ios' ? (
                  <View style={styles.endView}>
                    <Image
                      source={images.down}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(10),
                        marginTop: moderateScale(20),
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View
              style={[
                styles.commonRowType,
                {width: moderateScale(340), alignSelf: 'center'},
              ]}>
              <View style={styles.uploadCSVBoxView}>
                <RNPickerSelect
                  placeholder={{
                    label:
                      userProvianceName !== null
                        ? userProvianceName
                        : strings.selectPro,
                    value: null,
                  }}
                  onValueChange={value => {
                    value != null ? this.setState({stateCodeId: value}) : null;
                  }}
                  items={userStateList}
                  style={{...pickerSelectStyles}}
                />
                {Platform.OS == 'ios' ? (
                  <View style={styles.endView}>
                    <Image
                      source={images.down}
                      style={{
                        width: moderateScale(15),
                        height: moderateScale(10),
                        marginTop: moderateScale(20),
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.resCity}
                  value={cityofRes}
                  onChangeText={text => {
                    this.setState({cityofRes: text});
                  }}
                  ref={this.cityofResRef}
                  // returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   this.businesNameValue.focus();
                  // }}
                  // blurOnSubmit={false}
                />
                {cityofRes != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.pCodeRes}
                  value={postalCode}
                  onChangeText={text => {
                    this.setState({postalCode: text});
                  }}
                  ref={this.postCodeRef}
                  // returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   this.businesNameValue.focus();
                  // }}
                  // blurOnSubmit={false}
                />
                {postalCode != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.ResiAdd}
                  value={perActivityValue}
                  onChangeText={text => this.setState({perActivityValue: text})}
                  ref={this.invoiceDescRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                />
                {perActivityValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>

            <View
              style={[styles.typeofSubjectBox, {marginTop: moderateScale(5)}]}>
              <Text style={styles.headerStyle}>{strings.domResi}</Text>
              <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    this.DomicileresBtn(1);
                  }}>
                  <Image
                    source={
                      DomicileresidenceBtn
                        ? images.radioSelect
                        : images.radioUnselect
                    }
                    style={styles.locationPIN}
                  />
                  <Text style={styles.dateTimeModal}>{'Yes'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    this.DomicileresBtn(2);
                  }}>
                  <Image
                    source={
                      DomicileresidenceBtn
                        ? images.radioUnselect
                        : images.radioSelect
                    }
                    style={styles.locationPIN}
                  />
                  <Text style={styles.dateTimeModal}>{'No'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.thirdBoxView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  style={styles.textInputBoxDesign}
                  placeholder={strings.notes}
                  value={perActivityValue}
                  onChangeText={text => this.setState({perActivityValue: text})}
                  ref={this.invoiceDescRef}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                />
                {perActivityValue != '' ? null : (
                  <Text style={styles.redStarDesign}>{strings.Star}</Text>
                )}
              </View>
            </View>
            {this.state.domicileValue == 2 && this.domicileViewDesign()}
          </View>
        )}
      </>
    );
  }

  domicileViewDesign() {
    const {
      munBirthabroad,
      settingCustomerList,
      perActivityValue,
      domicileState,
      userProvianceName,
      userStateList,
    } = this.state;
    return (
      <>
        <View>
          <Text
            numberOfLines={1}
            style={[styles.uploadDocText, {marginBottom: moderateScale(10)}]}>
            {strings.domData}
          </Text>
        </View>

        <View style={styles.commonRowType}>
          {/* <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
            {strings.custCounty}
          </Text> */}
          <View style={styles.uploadCSVBoxView}>
            <RNPickerSelect
              placeholder={{
                label: strings.domCountry,
                value: null,
              }}
              // onValueChange={value => this.countrySelectValue(value)}
              // items={this.state.destCountryData}
              onValueChange={value => this.stateValueSetting(value)}
              items={domicileState}
              style={{...pickerSelectStyles}}
            />
            {Platform.OS == 'ios' ? (
              <View style={styles.endView}>
                <Image
                  source={images.down}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(10),
                    marginTop: moderateScale(20),
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>

        {/* {countrySelect === 107 ? ( */}
        <View style={styles.commonRowType}>
          {/* <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
              {strings.custProvinces}
            </Text> */}
          <View style={styles.uploadCSVBoxView}>
            <RNPickerSelect
              placeholder={{
                label:
                  userProvianceName !== null ? userProvianceName : strings.BS,
                value: null,
              }}
              onValueChange={value => {
                value != null ? this.setState({stateCodeId: value}) : null;
              }}
              items={userStateList}
              style={{...pickerSelectStyles}}
            />
            {Platform.OS == 'ios' ? (
              <View style={styles.endView}>
                <Image
                  source={images.down}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(10),
                    marginTop: moderateScale(20),
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
        {/* ) : null} */}

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.domMFD}
              value={munBirthabroad}
              onChangeText={text => {
                this.setState({munBirthabroad: text});
              }}
              ref={this.munBirthabroadRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.perActivityValue.focus();
              }}
              blurOnSubmit={false}
            />
            {munBirthabroad != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.domZipCode}
              value={munBirthabroad}
              onChangeText={text => {
                this.setState({munBirthabroad: text});
              }}
              ref={this.munBirthabroadRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.perActivityValue.focus();
              }}
              blurOnSubmit={false}
            />
            {munBirthabroad != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.domHomeAdd}
              value={perActivityValue}
              onChangeText={text => this.setState({perActivityValue: text})}
              ref={this.invoiceDescRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            {perActivityValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
      </>
    );
  }

  async CSVUpload(type) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        // type: [DocumentPicker.types.csv, DocumentPicker.types.xls],
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
      this.setState({
        inoviceDocURL: res.uri,
        docType: res.type,
        docName: res.name,
      });
      // this.uploadMandatoryAPICall(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  societyViewDesign() {
    const {
      fiscalCodeValue,
      tradName,
      vatCodeValue,
      businesNameValue,
      userERD,
      getLegalNatureList,
      BSValue,
      legalNatureName,
      userAtecoCode,
      perActivityValue,
      settingCustomerList,
      attorneyRadioBtnSelect,
      attorneyBtnValue,
      docName,
      calenderOpenstatus,
      dateIdentity,
      headAddress,
      headPostCode,
      headNotes,
      userProvianceName,
    } = this.state;
    return (
      <View>
        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.tradeName}
              value={tradName}
              onChangeText={text => {
                this.setState({tradName: text});
              }}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.vatCodeValue.focus();
              }}
              blurOnSubmit={false}
            />
            {tradName != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.fiscal}
              value={fiscalCodeValue}
              onChangeText={text => {
                this.setState({fiscalCodeValue: text});
              }}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.vatCodeValue.focus();
              }}
              blurOnSubmit={false}
            />
            {fiscalCodeValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.vatNo}
              value={vatCodeValue}
              onChangeText={text => {
                this.setState({vatCodeValue: text});
              }}
              ref={this.vatCodeValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.BSValue.focus();
              }}
              blurOnSubmit={false}
            />
            {vatCodeValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        {/* <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.businesN}
              value={businesNameValue}
              onChangeText={text => {
                this.setState({businesNameValue: text});
              }}
              ref={this.businesNameValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.BSValue.focus();
              }}
              blurOnSubmit={false}
            />
            {businesNameValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View> */}

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.businesS}
              value={BSValue}
              onChangeText={text => {
                this.setState({BSValue: text});
              }}
              ref={this.BSValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              blurOnSubmit={false}
            />
            {BSValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>
        {/*
        <View style={styles.secondBoxMainView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{ label: strings.BS, value: null }}
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
        </View> */}

        <View style={styles.thirdBoxView}>
          <View style={styles.commonCalenderBoxHeight}>
            <RNPickerSelect
              placeholder={{
                label:
                  legalNatureName !== null ? legalNatureName : strings.legalN,
                value: null,
              }}
              onValueChange={value => this.legalNatureValueSetting(value)}
              items={getLegalNatureList}
              style={{...pickerCalenderStyles}}
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
                }}>
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
                }}>
                {userAtecoCode ? userAtecoCode : strings.AC}
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
        {/* Headquarters */}
        <View>
          <Text
            numberOfLines={1}
            style={[styles.uploadDocText, {marginBottom: moderateScale(10)}]}>
            {strings.headquarter}
          </Text>
        </View>
        <View style={styles.commonRowType}>
          <View style={styles.uploadCSVBoxView}>
            <RNPickerSelect
              placeholder={{
                label: strings.state,
                value: null,
              }}
              onValueChange={value => this.stateValueSetting(value)}
              items={this.state.headquarterState}
              style={{...pickerSelectStyles}}
            />
            {Platform.OS == 'ios' ? (
              <View style={styles.endView}>
                <Image
                  source={images.down}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(10),
                    marginTop: moderateScale(20),
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.commonRowType}>
          <View style={styles.uploadCSVBoxView}>
            <RNPickerSelect
              placeholder={{
                label:
                  userProvianceName !== null ? userProvianceName : strings.BS,
                value: null,
              }}
              onValueChange={value => {
                value != null ? this.setState({stateCodeId: value}) : null;
              }}
              items={this.state.userStateList}
              style={{...pickerSelectStyles}}
            />
            {Platform.OS == 'ios' ? (
              <View style={styles.endView}>
                <Image
                  source={images.down}
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(10),
                    marginTop: moderateScale(20),
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.munHead}
              value={perActivityValue}
              onChangeText={text => {
                this.setState({perActivityValue: text});
              }}
              ref={this.perActivityValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.headAddress.focus();
              }}
              blurOnSubmit={false}
            />
            {perActivityValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.address}
              value={headAddress}
              onChangeText={text => this.setState({perActivityValue: text})}
              ref={this.invoiceDescRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.headPostCode.focus();
              }}
            />
            {perActivityValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.pCodeRes}
              value={headPostCode}
              onChangeText={text => {
                this.setState({perActivityValue: text});
              }}
              ref={this.perActivityValueRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                this.headNotes.focus();
              }}
              blurOnSubmit={false}
            />
            {perActivityValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        <View style={styles.thirdBoxView}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={styles.textInputBoxDesign}
              placeholder={strings.notes}
              value={headNotes}
              onChangeText={text => this.setState({perActivityValue: text})}
              ref={this.invoiceDescRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            {perActivityValue != '' ? null : (
              <Text style={styles.redStarDesign}>{strings.Star}</Text>
            )}
          </View>
        </View>

        {/* Attorney */}

        <View style={styles.firstBoxMainView}>
          <Text style={styles.headerStyle}>{strings.attorney}</Text>
          <View style={styles.firstRowView}>
            <TouchableOpacity
              style={{flexDirection: 'row', borderWidth: 0}}
              onPress={() => {
                this.attorneyRadioBtn(1);
              }}>
              <Image
                source={
                  attorneyRadioBtnSelect
                    ? images.radioSelect
                    : images.radioUnselect
                }
                style={styles.locationPIN}
              />
              <Text style={styles.dateTimeModal}>{strings.selectFromExis}</Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                this.attorneyRadioBtn(2);
              }}>
              <Image
                source={
                  attorneyRadioBtnSelect
                    ? images.radioUnselect
                    : images.radioSelect
                }
                style={styles.locationPIN}
              />
              <Text style={styles.dateTimeModal}>{strings.addNew}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {attorneyBtnValue == 1 ? (
          <View style={styles.commonRowType}>
            <View style={styles.madeByView}>
              <RNPickerSelect
                placeholder={{
                  label: strings.attorney,
                  value: null,
                }}
                onValueChange={value => this.setState({madeBySelect: value})}
                items={settingCustomerList}
                style={{...pickerSelectStyles}}
              />
              {Platform.OS == 'ios' ? (
                <View style={styles.endView}>
                  <Image
                    source={images.down}
                    style={{
                      width: moderateScale(15),
                      height: moderateScale(10),
                      marginTop: moderateScale(20),
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        ) : (
          <View style={styles.commonRowType}>
            <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
              {strings.identityDoc}
            </Text>
            <View style={styles.uploadCSVBoxView}>
              <TouchableOpacity
                onPress={() => this.CSVUpload(true)}
                style={styles.uploadView}>
                <Image
                  source={images.upload}
                  style={styles.documentStatusImg}
                />
                <Text style={styles.uploadTxt}>
                  {docName ? docName : strings.uploadDoc}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.commonRowType}>
          <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
            {strings.uploadChamberDoc}
          </Text>
          <View style={styles.uploadCSVBoxView}>
            <TouchableOpacity
              onPress={() => this.CSVUpload(true)}
              style={styles.uploadView}>
              <Image source={images.upload} style={styles.documentStatusImg} />
              <Text style={styles.uploadTxt}>
                {docName ? docName : strings.uploadDoc}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.secondBoxMainView}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              top: moderateScale(12),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
              }}
              onPress={() => {
                this.showDatePicker();
              }}>
              <Image source={images.calender} style={styles.locationPIN} />
              <Text
                style={[styles.dateTimeModal, {color: colors.grayNameHeading}]}>
                {dateIdentity ? dateIdentity : strings.nominyData}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={calenderOpenstatus}
              mode="date"
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
          </View>
        </View>

        <View style={styles.secondBoxMainView}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              top: moderateScale(12),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
              }}
              onPress={() => {
                this.showDatePicker();
              }}>
              <Image source={images.calender} style={styles.locationPIN} />
              <Text
                style={[styles.dateTimeModal, {color: colors.grayNameHeading}]}>
                {dateIdentity ? dateIdentity : strings.identiData}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={calenderOpenstatus}
              mode="date"
              onConfirm={this.handleConfirm}
              onCancel={this.hideDatePicker}
            />
          </View>
        </View>

        <View>
          <Text
            numberOfLines={1}
            style={[styles.uploadDocText, {marginBottom: moderateScale(10)}]}>
            {strings.effOwner}
          </Text>
        </View>
        {this.effectiveOwner()}
        <AbsoluteBtn
          btnTxt={strings.addSub}
          onPressBtn={() => this.AddSubject()}
          marginRight={0}
        />
      </View>
    );
  }

  effectiveOwner() {
    const {
      effectiveOwnerSub,
      settingCustomerList,
      dateIdentity,
      calenderOpenstatus,
    } = this.state;
    return (
      <FlatList
        data={effectiveOwnerSub}
        keyExtractor={(item, index) => index}
        renderItem={({item, index}) => {
          return (
            <>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: moderateScale(5),
                }}> */}
              <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                {strings.selectCust}
              </Text>
              {/* <TouchableOpacity
                  style={styles.effectDownArrow}
                  onPress={() => this.HideShowSelectedCust(index)}>
                  <Image
                    source={images.down}
                    style={{
                      width: moderateScale(15),
                      height: moderateScale(10),
                    }}
                  />
                </TouchableOpacity>
              </View> */}
              <View style={styles.commonRowType}>
                {/* <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
          {strings.effOwner}
        </Text> */}
                <View style={styles.uploadCSVBoxView}>
                  <RNPickerSelect
                    placeholder={{
                      label: strings.selectCust,
                      value: null,
                    }}
                    // onValueChange={value =>
                    //   this.setState({selectedUserID: value})
                    // }
                    onValueChange={value => this.setCustomeAccessData(value)}
                    items={settingCustomerList}
                    style={{...pickerSelectStyles}}
                  />
                  {Platform.OS == 'ios' ? (
                    <View style={styles.endView}>
                      <Image
                        source={images.down}
                        style={{
                          width: moderateScale(15),
                          height: moderateScale(10),
                          marginTop: moderateScale(20),
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.secondBoxMainView}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    top: moderateScale(12),
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.showDatePicker();
                    }}>
                    <Image
                      source={images.calender}
                      style={styles.locationPIN}
                    />
                    <Text
                      style={[
                        styles.dateTimeModal,
                        {color: colors.grayNameHeading},
                      ]}>
                      {dateIdentity ? dateIdentity : strings.engageStartData}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={calenderOpenstatus}
                    mode="date"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                  />
                </View>
              </View>

              <View style={styles.secondBoxMainView}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    top: moderateScale(12),
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      this.showDatePicker();
                    }}>
                    <Image
                      source={images.calender}
                      style={styles.locationPIN}
                    />
                    <Text
                      style={[
                        styles.dateTimeModal,
                        {color: colors.grayNameHeading},
                      ]}>
                      {dateIdentity ? dateIdentity : strings.endDateassign}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={calenderOpenstatus}
                    mode="date"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                  />
                </View>
              </View>

              <View style={styles.commonRowType}>
                {/* <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
            {strings.effOwner}
          </Text> */}
                <View style={styles.uploadCSVBoxView}>
                  <RNPickerSelect
                    placeholder={{
                      label: strings.dataAcqu,
                      value: null,
                    }}
                    // onValueChange={value =>
                    //   this.setState({selectedUserID: value})
                    // }
                    onValueChange={value => this.setCustomeAccessData(value)}
                    items={settingCustomerList}
                    style={{...pickerSelectStyles}}
                  />
                  {Platform.OS == 'ios' ? (
                    <View style={styles.endView}>
                      <Image
                        source={images.down}
                        style={{
                          width: moderateScale(15),
                          height: moderateScale(10),
                          marginTop: moderateScale(20),
                        }}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              <AbsoluteBtn
                btnTxt={'REMOVE'}
                onPressBtn={() => this.removeSubject(index)}
                marginRight={0}
              />
            </>
          );
        }}
      />
    );
  }

  validationCheckNatural() {
    const {
      fiscalCodeValue,
      tradName,
      vatCodeValue,
      firstNameValue,
      lastNameValue,
      CFBValue,
      munBirthabroad,
      perActivityValue,
      cityofRes,
      postalCode,
      businesNameValue,
      userHomeStateCode,
      selectedUserID,
      customerType,
      userStateCode,
      userDOB,
      userERD,
      residanceAddress,
      residanceAddressId,
      atecoCodeId,
      CFRUserData,
      postCode,
      userResidanceAdd,
    } = this.state;
    if (fiscalCodeValue == '') {
      FunctionUtils.showToast(strings.fiscalCodeBlankError);
    } else if (vatCodeValue == '') {
      FunctionUtils.showToast(strings.vatCodeBlankError);
    } else if (firstNameValue == '') {
      FunctionUtils.showToast(strings.firstNameBlankError);
    } else if (lastNameValue == '') {
      FunctionUtils.showToast(strings.lastNameBlankError);
    } else if (userDOB == '') {
      FunctionUtils.showToast(strings.userDOBBlankError);
    }
    // else if (!FunctionUtils.validateUserAgeLength(userDOB)) {
    //   FunctionUtils.showToast(strings.ageValidError);
    // }
    else if (CFBValue == '') {
      FunctionUtils.showToast(strings.commonForeignBlankError);
    } else if (
      this.state.countryId == '' ||
      this.state.countryId == null ||
      this.state.countryId == undefined
    ) {
      FunctionUtils.showToast(strings.birthCounteryBlankError);
    } else if (munBirthabroad == '') {
      FunctionUtils.showToast(strings.commonForeignBlankError);
    }
    // else if (
    //   userStateCode == '' ||
    //   userStateCode == null ||
    //   userStateCode == undefined
    // ) {
    //   FunctionUtils.showToast(strings.birthStateBlankError);
    // }
    else if (
      atecoCodeId == '' ||
      atecoCodeId == null ||
      atecoCodeId == undefined
    ) {
      FunctionUtils.showToast('Please select the ateco code');
    } else if (userERD == '') {
      FunctionUtils.showToast(strings.userERDBlankError);
    } else if (perActivityValue == '') {
      FunctionUtils.showToast(strings.performedActivityBlankError);
    } else if (businesNameValue == '') {
      FunctionUtils.showToast(strings.businessNameBlankError);
    } else {
      Actions.CompleteModifyCustomer({
        fiscalCodeValue: fiscalCodeValue,
        tradName: tradName,
        vatCodeValue: vatCodeValue,
        selectedUserValue: this.state.selectedUserValue,
        firstNameValue: firstNameValue,
        lastNameValue: lastNameValue,
        CFBValue: CFBValue,
        munBirthabroad: munBirthabroad,
        perActivityValue: perActivityValue,
        cityofRes: cityofRes,
        postalCode: postalCode,
        businesNameValue: businesNameValue,
        userDOB: userDOB,
        userERD: userERD,
        userStateCode: userStateCode,
        userHomeStateCode: userHomeStateCode,
        userCountryCodeData: this.state.countryId,
        selectUserID: selectedUserID,
        selectedUserID: customerType,
        atecoCodeValue: this.state.atecoCodeId,
        userResidanceName: residanceAddress,
        userResidanceID: residanceAddressId,
        userCFR: CFRUserData,
        usersPostCode: postCode,
        userResidAdd: userResidanceAdd,
      });
    }
  }

  modifyCustomerAPI = () => {
    const {
      firstNameValue,
      subjectTypeValue,
      lastNameValue,
      fiscalCodeValue,
      vatCodeValue,
      businesNameValue,
      perActivityValue,
      atecoCodeId,
      userDOB,
      CFBValue,
      userCountryCode,
      userStateCode,
      userERD,
      resiStateValue,
      legalValue,
      selectedUserID,
      birthStateValue,
      naturalBirthProv,
    } = this.state;
    const formData = new FormData();
    formData.append('customer_id', selectedUserID);
    formData.append('subject_type', subjectTypeValue);
    formData.append('first_name', firstNameValue);
    formData.append('last_name', lastNameValue);
    // formData.append('document_type', lastNameValue);
    // formData.append('doc_file', lastNameValue);
    formData.append('fiscal_code', fiscalCodeValue);
    formData.append('vat_number', vatCodeValue);
    formData.append('business_name', businesNameValue);
    formData.append('performed_activity', perActivityValue);
    formData.append('ateco_code', atecoCodeId);
    formData.append('date_of_birth', userDOB);
    formData.append('common_foreign_birth', CFBValue);
    formData.append('birth_state', birthStateValue);
    formData.append('birth_province', naturalBirthProv);
    // formData.append('common_foreign_birth', CFBValue);
    formData.append('relation_end_date', userERD);
    // formData.append('residence_state', userCountryCode);
    // formData.append('residence_province', resiStateValue);
    // formData.append('residence_city', resiStateValue);
    // formData.append('postcode_residence', resiStateValue);
    // formData.append('residence_address', resiStateValue);
    // formData.append('common_foreign_residence', resiStateValue);
    // formData.append('domicile_equal_residence', resiStateValue);
    // formData.append('note', resiStateValue);
    // formData.append('domicile_country', resiStateValue);
    // formData.append('domicile_state', resiStateValue);
    // formData.append('municipal_foreign_domicile', resiStateValue);
    // formData.append('domicile_zipcode', resiStateValue);
    // formData.append('domicile_home_address', resiStateValue);
    formData.append('legal_nature', legalValue);
    // formData.append('headquarters_state', legalValue);
    // formData.append('headquarters_address', legalValue);
    // formData.append('headquarters_address', legalValue);
    // formData.append('doc_file_identify', legalValue);
    // formData.append('doc_file_chamber_commerce', legalValue);
    // formData.append('date_nomination', legalValue);
    // formData.append('date_identification', legalValue);
    // formData.append('effective_owner', legalValue);
    // formData.append('date_start_engagement', legalValue);
    // formData.append('date_end_assignment', legalValue);
    // formData.append('date_acquired', legalValue);
    console.log('HelloFormData>>>', formData);
  };

  validationCheckSociaty() {
    const {
      fiscalCodeValue,
      tradName,
      vatCodeValue,
      businesNameValue,
      userStateCode,
      userERD,
      legalValue,
      BSValue,
      atecoCodeId,
      selectedUserID,
      CFRUserData,
      postCode,
      userResidanceAdd,
      customerType,
      residanceAddressId,
    } = this.state;
    if (
      fiscalCodeValue == '' ||
      fiscalCodeValue == undefined ||
      fiscalCodeValue == null
    ) {
      FunctionUtils.showToast(strings.fiscalCodeBlankError);
    } else if (
      vatCodeValue == '' ||
      vatCodeValue == undefined ||
      vatCodeValue == null
    ) {
      FunctionUtils.showToast(strings.vatCodeBlankError);
    } else if (userERD == '' || userERD == undefined || userERD == null) {
      FunctionUtils.showToast(strings.userERDBlankError);
    } else if (
      businesNameValue == '' ||
      businesNameValue == undefined ||
      businesNameValue == null
    ) {
      FunctionUtils.showToast(strings.businessNameBlankError);
    } else if (
      legalValue == '' ||
      legalValue == undefined ||
      legalValue == null
    ) {
      FunctionUtils.showToast(strings.legalNatureBlankError);
    } else if (!FunctionUtils.validateNumber(legalValue)) {
      FunctionUtils.showToast(strings.numberOnlyError);
    } else if (BSValue == '' || BSValue == undefined || BSValue == null) {
      FunctionUtils.showToast(strings.businessSectorBlankError);
    } else if (
      atecoCodeId == '' ||
      atecoCodeId == undefined ||
      atecoCodeId == null
    ) {
      FunctionUtils.showToast(strings.atecoCodeBlankError);
    } else {
      Actions.CompleteManuallyAddCustomer({
        fiscalCodeValue: fiscalCodeValue,
        tradName: tradName,
        vatCodeValue: vatCodeValue,
        selectedUserValue: this.state.selectedUserValue,
        businesNameValue: businesNameValue,
        legalValue: legalValue,
        BSValue: BSValue,
        userERD: this.state.userERD,
        userStateCode: userStateCode,
        userCountryCodeData: this.state.countryId,
        userResidanceID: residanceAddressId,
        atecoCodeValue: atecoCodeId,
        userCFR: CFRUserData,
        usersPostCode: postCode,
        userResidAdd: userResidanceAdd,
        selectUserID: selectedUserID,
        selectedUserID: customerType,
      });
    }
  }

  async CSVUpload(type) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        // type: [DocumentPicker.types.csv, DocumentPicker.types.xls],
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
      this.setState({
        inoviceDocURL: res.uri,
        docType: res.type,
        docName: res.name,
      });
      // this.uploadMandatoryAPICall(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  render() {
    const {
      isLoading,
      atecoCodeListData,
      settingCustomerList,
      customerType,
      radioBtnSelect,
      updateRadioBtnSelect,
      docName,
      updateBtnValue,
      subjectTypeValue,
      customerDataList,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          scrollEvent={event => {
            this.setFilterOptionsView();
            if (
              event.nativeEvent.contentOffset.y <= 0 &&
              this.state.stickHeaderHeight > 0
            ) {
              this.setState({stickHeaderHeight: 0});
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
          )}>
          <SafeAreaView>
            {settingCustomerList && settingCustomerList.length > 0 ? (
              <View
                style={{
                  marginTop: moderateScale(10),
                  marginHorizontal: moderateScale(15),
                }}>
                {/* <View style={styles.secondCustomerBoxMainView}>
                  <Image
                    style={{top: moderateScale(1)}}
                    source={images.email_logo}
                  />
                  <RNPickerSelect
                    placeholder={{label: strings.selectCust, value: null}}
                    onValueChange={value => this.setCustomeAccessData(value)}
                    items={settingCustomerList}
                    style={{...pickerSelectStyles}}
                  />
                  {Platform.OS == 'ios' ? (
                    <View style={styles.endCustView}>
                      <Image
                        source={images.down}
                        style={{
                          width: moderateScale(15),
                          height: moderateScale(10),
                          marginTop: moderateScale(20),
                        }}
                      />
                    </View>
                  ) : null}
                </View> */}

                <View style={styles.commonRowType}>
                  <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                    {strings.customerName}
                  </Text>
                  <View style={styles.uploadCSVBoxView}>
                    <RNPickerSelect
                      placeholder={{
                        label: strings.selectCust,
                        value: null,
                      }}
                      // onValueChange={value =>
                      //   this.setState({selectedUserID: value})
                      // }
                      onValueChange={value => this.setCustomeAccessData(value)}
                      items={customerDataList}
                      style={{...pickerSelectStyles}}
                    />
                    {Platform.OS == 'ios' ? (
                      <View style={styles.endView}>
                        <Image
                          source={images.down}
                          style={{
                            width: moderateScale(15),
                            height: moderateScale(10),
                            marginTop: moderateScale(20),
                          }}
                        />
                      </View>
                    ) : null}
                  </View>
                </View>

                {/* typeofsubject */}
                <View style={styles.typeofSubjectBox}>
                  <Text style={styles.headerStyle}>
                    {strings.typeofsubject}
                  </Text>
                  <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.changeRadioBtnStatus(1);
                      }}>
                      <Image
                        source={
                          radioBtnSelect
                            ? images.radioSelect
                            : images.radioUnselect
                        }
                        style={styles.locationPIN}
                      />
                      <Text style={styles.dateTimeModal}>
                        {strings.naturalPerson}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                    <TouchableOpacity
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        this.changeRadioBtnStatus(2);
                      }}>
                      <Image
                        source={
                          radioBtnSelect
                            ? images.radioUnselect
                            : images.radioSelect
                        }
                        style={styles.locationPIN}
                      />
                      <Text style={styles.dateTimeModal}>
                        {strings.sociaty}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* updateType */}
                <>
                  {subjectTypeValue === 1 && (
                    <View
                      style={[
                        styles.typeofSubjectBox,
                        {marginTop: moderateScale(5)},
                      ]}>
                      <Text style={styles.headerStyle}>
                        {strings.updateType}
                      </Text>
                      <View
                        style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() => {
                            this.updateRadioBtnSelect(1);
                          }}>
                          <Image
                            source={
                              updateRadioBtnSelect
                                ? images.radioUnselect
                                : images.radioSelect
                            }
                            style={styles.locationPIN}
                          />
                          <Text style={styles.dateTimeModal}>
                            {strings.docUpload}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                        <TouchableOpacity
                          style={{flexDirection: 'row'}}
                          onPress={() => {
                            this.updateRadioBtnSelect(2);
                          }}>
                          <Image
                            source={
                              updateRadioBtnSelect
                                ? images.radioSelect
                                : images.radioUnselect
                            }
                            style={styles.locationPIN}
                          />
                          <Text style={styles.dateTimeModal}>
                            {strings.updateMan}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </>
                {updateBtnValue == 1 && (
                  <>
                    <View style={styles.commonRowType}>
                      <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                        {strings.typeDoc}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <RNPickerSelect
                          placeholder={{
                            label: strings.typeDoc,
                            value: null,
                          }}
                          onValueChange={value =>
                            this.setState({selectedUserID: value})
                          }
                          items={settingCustomerList}
                          style={{...pickerSelectStyles}}
                        />
                        {Platform.OS == 'ios' ? (
                          <View style={styles.endView}>
                            <Image
                              source={images.down}
                              style={{
                                width: moderateScale(15),
                                height: moderateScale(10),
                                marginTop: moderateScale(20),
                              }}
                            />
                          </View>
                        ) : null}
                      </View>
                    </View>

                    <View style={styles.commonRowType}>
                      <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                        {strings.uploadDoc}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <TouchableOpacity
                          onPress={() => this.CSVUpload(true)}
                          style={styles.uploadView}>
                          <Image
                            source={images.upload}
                            style={styles.documentStatusImg}
                          />
                          <Text style={styles.uploadTxt}>
                            {docName ? docName : strings.uploadDoc}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
                <View style={{marginBottom: moderateScale(15)}}>
                  <Text numberOfLines={1} style={styles.uploadDocText}>
                    {strings.mainData}
                  </Text>
                </View>
                {subjectTypeValue === 1
                  ? this.naturalViewDesign()
                  : this.societyViewDesign()}
              </View>
            ) : (
              <NoDataView dataTitle={strings.noCust} />
            )}
            {settingCustomerList && settingCustomerList.length > 0 ? (
              <TouchableOpacity
                // onPress={() =>
                //   this.state.subjectType === 1
                //     ? this.validationCheckNatural()
                //     : this.validationCheckSociaty()
                // }
                onPress={() => this.modifyCustomerAPI()}
                style={styles.btnCancel}>
                <Text style={styles.cancelTxt}>{strings.next}</Text>
                <Image source={images.backLeftArr} style={styles.btnArrowImg} />
              </TouchableOpacity>
            ) : null}
          </SafeAreaView>
        </ParallaxScrollView>
        {isLoading && <Loader />}
        <Modal
          animationType={'slide'}
          style={{borderWidth: 10}}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({modalVisible: false});
            }}
            style={styles.modal}>
            <View style={styles.mainBoxView}>
              <FlatList
                data={atecoCodeListData}
                renderItem={({item, index}) =>
                  this.atecoCodeViewDesign(item, index)
                }
                keyExtractor={(item, index) => index.toString()}
              />
              {/* <ScrollView>
                <Text style={{ fontWeight: 'bold' }}>{strings.AC}</Text>
                {atecoCodeListData.map((item, index) => {
                  return this.atecoCodeViewDesign(item, index);
                })}
              </ScrollView> */}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = state => {
  return {
    countryList: state.customerReducer.countryList, //accessing the redux state
    stateList: state.customerReducer.stateList, //accessing the redux state
    atecoCodeList: state.customerReducer.atecoCodeList, //accessing the redux state
    customerDetail: state.customerReducer.customerDetail, //accessing the redux state
    customerListData: state.customerReducer.customerListData, //accessing the redux state
    getLegalNatureData: state.customerReducer.getLegalNatureData, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    msgError: state.transcationReducer.msgError, //accessing the redux state
    professionalPerformanceData:
      state.transcationReducer.professionalPerformanceData,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCustomer);

const pickerSelectStyles = StyleSheet.create({
  // inputIOS: {
  //   fontSize: moderateScale(13),
  //   color: colors.blackShade,
  //   fontFamily: fonts.PoppinsRegular,
  //   fontWeight: '500',
  //   borderWidth: 0,
  //   // width: moderateScale(415),
  //   marginLeft: moderateScale(8),
  // },
  // inputAndroid: {
  //   fontSize: moderateScale(13),
  //   color: colors.blackShade,
  //   fontFamily: fonts.PoppinsRegular,
  //   fontWeight: '500',
  //   borderWidth: 1,
  //   flex: 1,
  //   alignContent: 'flex-end',
  //   alignSelf: 'flex-end',
  //   width: moderateScale(300),
  // },
});

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
    // width: moderateScale(400),
    // paddingTop: moderateScale(10),
  },
});

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cancelTxt: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.redColor,
  },
  btnArrowImg: {
    height: moderateScale(10),
    width: moderateScale(15),
    tintColor: colors.redColor,
    marginLeft: 5,
    transform: [{rotateY: '180deg'}],
  },
  endCustView: {
    flex: 1,
    alignSelf: 'flex-end',
    borderWidth: 0,
    height: moderateScale(50),
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    top: moderateScale(15),
    // marginRight: moderateScale(15),
  },
  secondCustomerBoxMainView: {
    flex: 1,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    padding: moderateScale(16),
    // justifyContent: "center",
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
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100,
  },
  modal: {
    alignItems: 'center',
    // flex: 1,
    // padding: 100,
    height: '100%',
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  text: {
    color: colors.colorGray,
    marginTop: 10,
  },
  endCustomerView: {
    flex: 1,
    alignSelf: 'flex-end',
    borderWidth: 0,
    height: moderateScale(50),
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    top: moderateScale(15),
    // marginRight: moderateScale(15),
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
  effectDownArrow: {
    alignSelf: 'flex-end',
    borderWidth: 0,
    // height: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    // alignContent:'center',
    // top: moderateScale(-25),
    marginRight: moderateScale(15),
  },
  mainBoxView: {
    alignItems: 'center',
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
  typeofSubjectBox: {
    flex: 1,
    // backgroundColor: colors.white,
    // shadowColor: colors.gray,
    // shadowOffset: {
    //   width: 0,
    //   height: moderateScale(1),
    // },
    // shadowOpacity: moderateScale(0.25),
    // shadowRadius: moderateScale(4),
    // elevation: moderateScale(5),
    // borderRadius: moderateScale(10),
    // height: height * 0.12,
    height: 'auto',
    marginBottom: moderateScale(10),
  },
  headerStyle: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    top: moderateScale(5),
    marginBottom: moderateScale(5),
    marginLeft: moderateScale(5),
  },
  inputHeader: {
    fontSize: moderateScale(12),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    marginTop: moderateScale(5),
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
    marginBottom: moderateScale(15),
    padding: moderateScale(5),
    // marginTop: moderateScale(16),
  },
  thirdBoxwithBorder: {
    flex: 1,
    // backgroundColor: colors.white,
    // shadowColor: colors.gray,
    // shadowOffset: {
    //   width: 0,
    //   height: moderateScale(1),
    // },
    // shadowOpacity: moderateScale(0.25),
    // shadowRadius: moderateScale(4),
    // elevation: moderateScale(5),
    borderWidth: 0.8,
    borderRadius: moderateScale(8),
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    padding: moderateScale(3),
    // marginTop: moderateScale(16),
  },
  uploadDocText: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    top: moderateScale(10),
    marginBottom: moderateScale(-4),
    // marginLeft: moderateScale(5),
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
    flex: 1,
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
    // height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeofSubjectStyle: {
    // height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commonRowType: {
    flexDirection: 'column',
    margin: moderateScale(7),
  },
  docUploadTypeTxt: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    // top: moderateScale(10),
    // margin: moderateScale(4),
    // marginLeft: moderateScale(10),
  },
  uploadCSVBoxView: {
    flex: 1,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    borderWidth: 0,
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    width: moderateScale(340),
    alignSelf: 'center',
    // marginBottom: moderateScale(10),
    // padding: moderateScale(15),
    // marginTop: moderateScale(16),
  },
  uploadView: {
    backgroundColor: colors.lightPink,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: moderateScale(6),
    borderRadius: 8,
    height: moderateScale(50),
    borderWidth: 0.6,
    borderColor: colors.pinkBorder,
  },
  documentStatusImg: {
    height: moderateScale(13),
    width: moderateScale(13),
    resizeMode: 'contain',
    marginLeft: moderateScale(3),
  },
  uploadTxt: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginLeft: 3,
  },
  madeByView: {
    flex: 1,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    borderWidth: 0,
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    width: moderateScale(340),
    alignSelf: 'center',
    // marginBottom: moderateScale(10),
    // padding: moderateScale(15),
    // marginTop: moderateScale(16),
  },
  btnTxtStyle: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.PoppinsSemiBold,
    textTransform: 'uppercase',
  },
});
