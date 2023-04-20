import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  NativeModules,
  FlatList,
  Platform,
  findNodeHandle,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const {width, height} = Dimensions.get('window');
import {images, fonts, colors} from '../../themes';
import {moderateScale} from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import AbsoluteBtn from '../../components/AbsoluteBtn';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {ConstantUtils} from '../../utils';
import * as globals from '../../utils/globals';
import Loader from '../../components/LoaderOpacity.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from '../../redux/actions';
import {FunctionUtils, NetworkUtils} from '../../utils';
import RNPickerSelect from 'react-native-picker-select';
import NoDataView from '../../components/NoDataView';
import DocumentPicker from 'react-native-document-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

class NewTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      radioBtnSelect: true,
      notes: '',
      selectedUserID: 0,
      changeBtnStatus: true,
      changeBtnStatusSecond: true,
      changeBtnStatusThird: true,
      currentIndex: 0,
      currentIndexRiskValue: 0,
      currentIndexDataValue: 0,
      riskAssementId: 0,
      profPerfId: 0,
      getValueId: 1,
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      showPopover: false,
      isLoading: false,
      settingCustomerList: [],
      professionalPerformance: [],
      valueData: [],
      riskAssetmentData: [],
      typeData: [],
      fractionalData: [],
      currencyData: [],
      destCountryData: [],
      destProvData: [],
      userStateList: [],
      invoiceRegistration: '',
      inVoiceTypeSelect: 0,
      currencyTypeSelect: 0,
      countrySelect: 0,
      invoiceDesc: 0,
      registrationOpenDate: false,
      inoviceDocURL: '',
      provianceTypeName: '',
      docType: '',
      docName: '',
      amountValue: '',
      amountType: [],
      amountMap: [],
      amountTypeValue: 0,
      paymentMethodData: [],
      paymentMethod: [],
      paymentMethodType: 0,
      reasonData: [],
      reasonTypeSelect: 0,
      customerData: [],
      customerDataList: [],
      customerDataListValue: 0,
      profData: [],
      profMapData: [],
      profTypeValue: 0,
    };
    this.amountValueRef = this.updateRef.bind(this, 'amountValue');
  }

  inputChangeHandler = name => event => {
    this.setState({
      [name]: event,
    });
  };

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    this.customerAPIList();
    this.getTransactiondata();
  }

  customerAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props.getMyCustomerList(globals.tokenValue).then(async () => {
        const {customerListData} = this.props;
        if (
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

  getTransactiondata() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props
        .getProfessionaTransaction(globals.tokenValue)
        .then(async () => {
          const {professionalPerformanceData, msgError} = this.props;
          console.log(
            'professionalPerformanceData<<<',
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
              destCountryData: destCountry,
              isLoading: false,
              amountType: professionalPerformanceData.value_data,
              paymentMethodData: Object.entries(
                professionalPerformanceData.meanpayment,
              ),
              reasonData: reason,
              customerData: Object.entries(
                professionalPerformanceData.customer_data,
              ),
              profData: Object.entries(
                professionalPerformanceData.professionista,
              ),
            });
            this.amountMap();
            this.paymentMethodMap();
            this.customerDataMap();
            this.professionalMap();
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

  professionalMap = () => {
    let cb = [];
    this.state.profData.map(([key, items], index) => {
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    this.setState({profMapData: cb});
    return cb;
  };

  customerDataMap = () => {
    let cb = [];
    this.state.customerData.map(([key, items], index) => {
      console.log('custItems', items);
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    console.log('customerDataListing>>??', cb);
    this.setState({customerDataList: cb});
    return cb;
  };

  amountMap = () => {
    var cb = [];
    this.state.amountType.map(item => {
      if (item !== null) {
        cb.push({
          label: item.amount_type_name,
          value: item.id,
          id: item.id,
        });
      }
    });
    this.setState({amountMap: cb});
    return cb;
  };

  paymentMethodMap = () => {
    let cb = [];
    this.state.paymentMethodData.map(([key, items], index) => {
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    console.log('cdData>>', cb);
    this.setState({paymentMethod: cb});
    return cb;
  };

  _renderPerformanceOptions(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() =>
            this.setState({currentIndex: index, profPerfId: item.id})
          }>
          <Image
            source={
              index === this.state.currentIndex
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

  _renderRiskAssesment(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() =>
            this.setState({
              currentIndexRiskValue: index,
              riskAssementId: item.id,
            })
          }>
          <Image
            source={
              index === this.state.currentIndexRiskValue
                ? images.radioSelect
                : images.radioUnselect
            }
            style={styles.filterSelectionImg}
          />
        </TouchableOpacity>

        <Text style={styles.filterOptionName}>{item.risk_description}</Text>
      </View>
    );
  }

  _renderValueData(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() =>
            this.setState({currentIndexDataValue: index, getValueId: item.id})
          }>
          <Image
            source={
              index === this.state.currentIndexDataValue
                ? images.radioSelect
                : images.radioUnselect
            }
            style={styles.filterSelectionImg}
          />
        </TouchableOpacity>

        <Text style={styles.filterOptionName}>{item.amount_type_name}</Text>
      </View>
    );
  }

  setFilterOptionsView = e => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({popoverAnchor: {x, y, width, height}});
      });
    }
  };

  validateNewTransaction() {
    const {
      notes,
      selectedUserID,
      inVoiceTypeSelect,
      currencyTypeSelect,
      countrySelect,
      invoiceDesc,
      inoviceDocURL,
    } = this.state;
    if (selectedUserID === null || selectedUserID === 0) {
      FunctionUtils.showToast(strings.selectTheCustomerBlankError);
    } else if (inoviceDocURL === null || inoviceDocURL === '') {
      FunctionUtils.showToast(strings.selectTheInvoiceDocBlankError);
    } else if (inVoiceTypeSelect === null || inVoiceTypeSelect === 0) {
      FunctionUtils.showToast(strings.selectTheInvoiceTypeBlankError);
    } else if (currencyTypeSelect === null || currencyTypeSelect === 0) {
      FunctionUtils.showToast(strings.invoiceCurrencyTypeBlankError);
    } else if (countrySelect === null || countrySelect === 0) {
      FunctionUtils.showToast(strings.invoiceCountryTypeBlankError);
    } else if (invoiceDesc.trim() === '') {
      FunctionUtils.showToast(strings.selectTheNoteBlankError);
    } else if (notes.trim() === '') {
      FunctionUtils.showToast(strings.selectTheNoteBlankError);
    } else if (invoiceDesc.trim() === '') {
      FunctionUtils.showToast(strings.invoiceDescTypeBlankError);
    } else {
      this.submitNewTransaction();
    }
  }

  submitNewTransaction() {
    const {
      notes,
      selectedUserID,
      profPerfId,
      getValueId,
      riskAssementId,
      inVoiceTypeSelect,
      currencyTypeSelect,
      invoiceFractional,
      countrySelect,
      invoiceDesc,
      inoviceDocURL,
      provianceTypeName,
      docType,
      docName,
      customerDataListValue,
      profTypeValue,
      invoiceRegistration,
      reasonTypeSelect,
      amountTypeValue,
      amountValue,
      paymentMethodType,
    } = this.state;
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      var documentPath = {
        uri: inoviceDocURL,
        type: docType,
        name: docName,
      };
      console.log('documentPath>>', documentPath);
      const formData = new FormData();
      formData.append('customer_id', customerDataListValue);
      formData.append('transaction_reason_id', reasonTypeSelect);
      formData.append('transaction_registration_date', invoiceRegistration);
      formData.append('transaction_description', invoiceDesc);
      formData.append('transaction_doc_file', documentPath);
      formData.append('transaction_professional_id', profTypeValue);
      formData.append('transaction_country_id', countrySelect);
      formData.append('transaction Provinces_id', provianceTypeName);
      formData.append('transaction_amount_type', amountTypeValue);
      formData.append('transaction_amount', amountValue);
      formData.append('transaction_coin', currencyTypeSelect);
      formData.append('transaction_payment_method_id', paymentMethodType);

      console.log('formData<><>?', formData);
      // formData.append('customer_id', customerDataListValue);
      // formData.append('professional_performance', profTypeValue);
      // formData.append('notes', notes);
      // formData.append('value', getValueId);
      // formData.append('risk_assessment', riskAssementId);
      // formData.append('invoice_file', documentPath);
      // formData.append('type', inVoiceTypeSelect);
      // formData.append('fractional', invoiceFractional);
      // formData.append('currency', currencyTypeSelect);
      // formData.append('registration_date', invoiceRegistration);
      // formData.append('description', invoiceDesc);
      // formData.append('destination_country', countrySelect);
      // formData.append('destination_province', provianceTypeName);
      this.props.getNewTransaction(formData).then(async () => {
        const {newTransactionResponse, error, msgError} = this.props;
        console.log("newTransactionResponse>>>", newTransactionResponse);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (newTransactionResponse) {
          FunctionUtils.showToast(newTransactionResponse.message);
          this.setState({isLoading: false});
          Actions.CustomerList();
        } else if (errorData && errorData.notes) {
          this.setState({isLoading: false});
          FunctionUtils.showToast(errorData.notes[0]);
        } else if (errorData && errorData.professional_performance) {
          this.setState({isLoading: false});
          FunctionUtils.showToast(errorData.professional_performance[0]);
        } else if (errorData && errorData.invoice_file) {
          this.setState({isLoading: false});
          FunctionUtils.showToast(errorData.invoice_file[0]);
        } else if (value && value == 'Unauthenticated.') {
          this.setState({isLoading: false});
          FunctionUtils.clearLogin();
        } else {
          this.setState({isLoading: false});
          FunctionUtils.showToast(newTransactionResponse.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  openPopover() {
    this.setFilterOptionsView();
    this.setState({showPopover: true});
  }

  async CSVUpload(type) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        // type: [DocumentPicker.types.csv, DocumentPicker.types.xls],
        type: [DocumentPicker.types.allFiles],
      });
      console.log('resCSVUpload', res);
      res.map((res, index) => {
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      });
      res.map((item, index) => {
        this.setState({
          inoviceDocURL: item.uri,
          docType: item.type,
          docName: item.name,
        });
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

  handleConfirm = date => {
    console.log(date);
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({invoiceRegistration: date.format('DD/MM/YYYY')});
    this.hideDatePicker();
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  setDatePickerVisibility = status => {
    this.setState({registrationOpenDate: status});
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  selectCustProvience(value) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserStateList(globals.tokenValue, value).then(async () => {
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

  countrySelectValue(value) {
    this.setState({countrySelect: value});
    if (value === 107) {
      this.selectCustProvience(value);
    }
  }

  closePopover = () => this.setState({showPopover: false});

  render() {
    const {
      valueData,
      riskAssetmentData,
      professionalPerformance,
      settingCustomerList,
      isLoading,
      typeData,
      inVoiceTypeSelect,
      invoiceRegistration,
      fractionalData,
      currencyData,
      destCountryData,
      invoiceDesc,
      userStateList,
      docName,
      countrySelect,
      amountValue,
      amountMap,
      paymentMethod,
      reasonData,
      customerDataList,
      profMapData,
    } = this.state;
    console.log('customerDataList<><>', customerDataList);
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
              headerTxtMain={strings.newPerfo}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.newPerfo}
            />
          )}>
          <SafeAreaView>
            {settingCustomerList && settingCustomerList.length > 0 ? (
              <View
                style={{
                  marginTop: moderateScale(10),
                  marginHorizontal: moderateScale(15),
                }}>
                {/* <View style={styles.secondBoxMainView}>
                  <Image
                    style={{ top: moderateScale(3) }}
                    source={images.email_logo}
                  />
                  <RNPickerSelect
                    placeholder={{ label: strings.selectCust, value: null }}
                    onValueChange={(value) =>
                      this.setState({ selectedUserID: value })
                    }
                    items={settingCustomerList}
                    style={{ ...pickerSelectStyles }}
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
                      onValueChange={value =>
                        this.setState({customerDataListValue: value})
                      }
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

                <View style={styles.commonRowType}>
                  <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                    {strings.reason}
                  </Text>
                  {/* <Text style={styles.docUploadTypeTxt}>{strings.invoice}</Text> */}
                  <View style={styles.uploadCSVBoxView}>
                    <RNPickerSelect
                      placeholder={{
                        label: strings.reason,
                        value: null,
                      }}
                      onValueChange={value =>
                        this.setState({reasonTypeSelect: value})
                      }
                      items={reasonData}
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

                <View style={{margin: moderateScale(6)}}>
                  <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                    {strings.invoiceRegiDate}
                  </Text>
                  <View style={styles.secondBoxMainView}>
                    <TouchableOpacity
                      onPress={() => {
                        this.showDatePicker();
                      }}
                      style={{
                        borderWidth: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={styles.calenderTextBoxDesign}>
                        {invoiceRegistration
                          ? invoiceRegistration
                          : strings.invoiceRegiDate}
                      </Text>
                      <Image
                        source={images.calender}
                        style={styles.sideDropDownArrImg}
                      />
                    </TouchableOpacity>
                  </View>
                  <DateTimePickerModal
                    isVisible={this.state.registrationOpenDate}
                    mode="date"
                    // maximumDate={new Date(Date.now() - 86400000)}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                  />
                </View>

                <View
                  style={[
                    styles.thirdBoxView,
                    {
                      margin: moderateScale(8),
                      height: moderateScale(60),
                      padding: moderateScale(10),
                    },
                  ]}>
                  <TextInput
                    placeholder={strings.invoiceDesc}
                    style={{fontSize: moderateScale(14)}}
                    value={invoiceDesc}
                    onChangeText={this.inputChangeHandler('invoiceDesc')}
                  />
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

                <View style={styles.commonRowType}>
                  <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                    {strings.prof}
                  </Text>
                  <View style={styles.uploadCSVBoxView}>
                    <RNPickerSelect
                      placeholder={{
                        label: strings.selectedProf,
                        value: null,
                      }}
                      onValueChange={value =>
                        this.setState({profTypeValue: value})
                      }
                      items={profMapData}
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
                    {strings.custCounty}
                  </Text>
                  <View style={styles.uploadCSVBoxView}>
                    <RNPickerSelect
                      placeholder={{
                        label: strings.custCounty,
                        value: null,
                      }}
                      onValueChange={value => this.countrySelectValue(value)}
                      items={destCountryData}
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

                {countrySelect === 107 ? (
                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.custProvinces}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <RNPickerSelect
                        placeholder={{
                          label: strings.custProvinces,
                          value: null,
                        }}
                        onValueChange={value =>
                          this.setState({provianceTypeName: value})
                        }
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
                ) : null}

                {/* <View>
                  <Text numberOfLines={1} style={styles.uploadDocText}>
                    {strings.profPerf}
                  </Text>
                </View>
                <View
                  style={[styles.thirdBoxView, { height: moderateScale(190) }]}
                >
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    {professionalPerformance &&
                    professionalPerformance.length > 0 ? (
                      professionalPerformance.map((item, index) => {
                        return this._renderPerformanceOptions(item, index);
                      })
                    ) : (
                      <Text
                        style={{
                          alignContent: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                          fontSize: moderateScale(12),
                        }}
                      >
                        {strings.noData}
                      </Text>
                    )}
                  </View>
                </View> */}

                {/* <View
                  style={[
                    styles.thirdBoxView,
                    {
                      height: moderateScale(130),
                      padding: moderateScale(10),
                    },
                  ]}
                >
                  <TextInput
                    placeholder={'Notes'}
                    style={{ fontSize: moderateScale(12) }}
                    onChangeText={(text) => this.setState({ notes: text })}
                  />
                </View> */}
                {/* <View>
                  <Text numberOfLines={1} style={styles.uploadDocText}>
                    {strings.value}
                  </Text>
                </View> */}
                {/* <View
                  style={[styles.thirdBoxView, {height: moderateScale(90)}]}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      {valueData.map((item, index) => {
                        return this._renderValueData(item, index);
                      })}
                    </View>
                  </View>
                </View> */}

                <View style={styles.commonRowType}>
                  <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                    {strings.amountType}
                  </Text>
                  <View style={styles.uploadCSVBoxView}>
                    <RNPickerSelect
                      placeholder={{
                        label: strings.amountType,
                        value: null,
                      }}
                      onValueChange={value =>
                        this.setState({amountTypeValue: value})
                      }
                      items={amountMap}
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
                {this.state.amountTypeValue === 1 && (
                  <>
                    <View>
                      <Text numberOfLines={1} style={styles.uploadDocText}>
                        {strings.amount}
                      </Text>
                    </View>

                    <View style={styles.mainDataBoxView}>
                      <View style={{flexDirection: 'row'}}>
                        <TextInput
                          style={styles.textInputBoxDesign}
                          placeholder={strings.amount}
                          value={amountValue}
                          ref={this.amountValueRef}
                          onChangeText={this.inputChangeHandler('amountValue')}
                        />
                      </View>
                    </View>

                    <View style={styles.commonRowType}>
                      <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                        {strings.coin}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <RNPickerSelect
                          placeholder={{
                            label: strings.coin,
                            value: null,
                          }}
                          onValueChange={value =>
                            this.setState({currencyTypeSelect: value})
                          }
                          items={currencyData}
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
                        {strings.paymentMethod}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <RNPickerSelect
                          placeholder={{
                            label: strings.paymentMethod,
                            value: null,
                          }}
                          onValueChange={value =>
                            this.setState({paymentMethodType: value})
                          }
                          items={paymentMethod}
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
                  </>
                )}
                {/* <View>
                  <Text numberOfLines={1} style={styles.uploadDocText}>
                    {strings.riskAsst}
                  </Text>
                </View>
                <View
                  style={[styles.thirdBoxView, { height: moderateScale(120) }]}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                      {riskAssetmentData.map((item, index) => {
                        return this._renderRiskAssesment(item, index);
                      })}
                    </View>
                  </View>
                </View> */}
              </View>
            ) : (
              <NoDataView dataTitle={strings.noCust} />
            )}
            {settingCustomerList && settingCustomerList.length > 0 ? (
              <AbsoluteBtn
                btnTxt={strings.sendCustomerDetail}
                onPressBtn={() => this.submitNewTransaction()}
                marginRight={0}
              />
            ) : null}
          </SafeAreaView>
        </ParallaxScrollView>
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = state => {
  return {
    stateList: state.customerReducer.stateList, //accessing the redux state
    professionalPerformanceData:
      state.transcationReducer.professionalPerformanceData, //accessing the redux state
    customerListData: state.customerReducer.customerListData, //accessing the redux state
    isloading: state.transcationReducer.isLoading,
    newTransactionResponse: state.transcationReducer.newTransactionResponse,
    getRiskAssesment: state.transcationReducer.getRiskAssesment,
    transactionValueResponse: state.transcationReducer.transactionValueResponse,
    msgError: state.transcationReducer.msgError, //accessing the redux state
    error: state.transcationReducer.error, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewTransaction);

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: moderateScale(13),
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    borderWidth: 0,
    // width: moderateScale(415),
    marginLeft: moderateScale(8),
  },
  inputAndroid: {
    fontSize: moderateScale(13),
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    borderWidth: 1,
    flex: 1,
    // alignContent: 'flex-end',
    // alignSelf: 'flex-end',
    width: moderateScale(300),
    // marginLeft: moderateScale(8),
  },
});

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
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
  secondBoxMainView: {
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
  commonCalenderBoxHeight: {
    height: moderateScale(30),
    borderWidth: 0,
  },
  calenderTextBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(15),
    height: moderateScale(35),
    color: colors.colorGray,
    // left: moderateScale(10),
    // paddingTop: moderateScale(10),
    width: moderateScale(265),
  },
  commonRowType: {
    flexDirection: 'column',
    margin: moderateScale(7),
  },
  uploadView: {
    backgroundColor: colors.lightPink,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: moderateScale(6),
    borderRadius: 8,
    height: moderateScale(60),
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
  docUploadTypeTxt: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(15),
    // top: moderateScale(10),
    // margin: moderateScale(4),
    // marginLeft: moderateScale(10),
  },
  endView: {
    flex: 1,
    alignSelf: 'flex-end',
    borderWidth: 0,
    height: moderateScale(50),
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    top: moderateScale(15),
    // marginRight: moderateScale(15),
  },
  commonBoxHeight: {
    height: moderateScale(40),
  },
  sideDropDownArrImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    // left: moderateScale(10),
    resizeMode: 'contain',
    right: moderateScale(10),
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
    borderRadius: moderateScale(10),
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    padding: moderateScale(15),
    marginTop: moderateScale(10),
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
    // width: width - moderateScale(30),
    // marginBottom: moderateScale(10),
    // padding: moderateScale(15),
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
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainDataBoxView: {
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
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    padding: moderateScale(5),
    marginTop: moderateScale(10),
  },
  textInputBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(12),
    height: moderateScale(35),
    color: colors.colorGray,
    left: moderateScale(10),
  },
  profViewBox: {
    commonRowType: {
      flexDirection: 'column',
    },
  },
});
