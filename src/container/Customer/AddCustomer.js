import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  NativeModules,
  findNodeHandle,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import {debounce, result} from 'lodash';
import {Actions} from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const {width, height} = Dimensions.get('window');
import {images, fonts, colors} from '../../themes';
import {moderateScale} from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import AbsoluteBtn from '../../components/AbsoluteBtn';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loader from '../../components/LoaderOpacity.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from '../../redux/actions';
import {NetworkUtils, FunctionUtils} from '../../utils';
import moment from 'moment';
import {ConstantUtils} from '../../utils';
import {Popover, PopoverController} from 'react-native-modal-popover';
import ButtonWithImage from '../../components/ButtonWithImage.js';
import * as globals from '../../utils/globals';
import DocumentPicker from 'react-native-document-picker';
// import ImagesCombineLibrary from 'react-native-images-combine';
import ImagesMerge from 'react-native-images-merge';
import Button from '../../components/Button';
import RNPickerSelect from 'react-native-picker-select';
import NoDataView from '../../components/NoDataView';

class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverAnchor: {
        x: moderateScale(100),
        y: moderateScale(100),
        width: 0,
        height: 0,
      },
      docType: '',
      questionsLength: 0,
      stickHeaderHeight: 0,
      calenderOpenstatus: false,
      radioBtnSelect: true,
      attorneyRadioBtnSelect: true,
      attorneyBtnValue: 1,
      changeBtnStatus: true,
      subjectType: 1,
      isLoading: false,
      changeBtnStatusSecond: 0,
      changeBtnStatusThird: true,
      docDetail: '',
      dateIdentity: '',
      dateIdentityNatural: '',
      dateIdentityNaturalVisible: false,
      societydateIdentity: '',
      docName: '',
      policyState: 1,
      policyState2: 1,
      policyState3: 1,
      qGroupId: 0,
      qSurveyid: 0,
      policyAnswers: {},
      custQuestionListData: [],
      question1Id: 0,
      question2Id: 0,
      question3Id: 0,
      qusAnsParam: [],
      testUser: '',
      ans1Id: 0,
      ans2Id: 0,
      ans3Id: 0,
      imagesArray: [],
      base64: '',
      mergeImage: '',
      answerIndex: '',
      showPopover: false,
      firstNameValue: '',
      lastNameValue: '',
      typeData: [],
      madeBySelect: 0,
      madeBy: [],
      Notes: '',
      settingCustomerList: [],
      selectedUserID: 0,
      invoiceRegistration: '',
      inVoiceTypeSelect: 0,
      currencyTypeSelect: 0,
      countrySelect: 0,
      invoiceDesc: 0,
      currencyData: [],
      destCountryData: [],
      userStateList: [],
      provianceTypeName: 0,
      amountValue: '',
      fractionalData: [],
      registrationOpenDate: false,
      newTransaction: true,
      Tradename: '',
      profData: [],
      profMapData: [],
      amountType: [],
      proTypeValue: 0,
      amountMap: [],
      amountTypeValue: 0,
      paymentMethodData: [],
      paymentMethod: [],
      paymentMethodType: 0,
      reasonData: [],
      reasonTypeSelect: 0,
      carriedoutby: [],
      chamberDocName: '',
      chamberDocType: '',
      socAnotherDocName: '',
      socAnotherDocType: '',
      tranDocName: '',
      inoviceTranDocURL: '',
      tranDocType: '',
      tracType: 1,
      sendingImageUri: '',
      invoiceDocType: '',
      invoiceDocName: '',
      inoviceChamberDocURL: '',
      attorneyList: [],
      attorneyData: [],
      attorneyDataValue: 0,
    };
    this.firstNameValueRef = this.updateRef.bind(this, 'firstNameValue');
    this.lastNameValueRef = this.updateRef.bind(this, 'lastNameValue');
    this.invoiceDescRef = this.updateRef.bind(this, 'invoiceDesc');
    this.amountValueRef = this.updateRef.bind(this, 'amountValue');
    this.TradenameRef = this.updateRef.bind(this, 'Tradename');
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    // this.createNewCustomer();
    this.createNewCustomer = debounce(this.createNewCustomer.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.getCustQuestionList();
    this.customerAPIList();
    this.getTransactiondata();
    this.professionalMap();
  }

  getCustQuestionList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props.getCustomerQuestion(globals.tokenValue).then(async () => {
        const {getCustomerQuestionList, msgError} = this.props;
        console.log(
          'getCustomerQuestionList123',
          JSON.stringify(
            getCustomerQuestionList.data[
              Object.keys(getCustomerQuestionList.data)
            ],
            null,
            2,
          ),
        );
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          getCustomerQuestionList?.data &&
          getCustomerQuestionList?.data[
            Object.keys(getCustomerQuestionList.data)
          ] &&
          getCustomerQuestionList?.data[
            Object.keys(getCustomerQuestionList.data)
          ].question?.length > 0
        ) {
          this.setState({
            custQuestionListData:
              getCustomerQuestionList.data[
                Object.keys(getCustomerQuestionList.data)
              ].question,
            questionsLength:
              getCustomerQuestionList.data[
                Object.keys(getCustomerQuestionList.data)
              ]?.question?.length,
            isLoading: false,
          });
        } else if (value && value == 'Unauthenticated.') {
          this.setState({isLoading: false});
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
          });
          FunctionUtils.showToast(getCustomerQuestionList.message);
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
            'professionalPerformanceData***',
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
              attorneyList: Object.entries(
                professionalPerformanceData.newrepresentlist,
              ),
            });
            this.professionalMap();
            this.amountMap();
            this.paymentMethodMap();
            this.carriedOutBy();
            this.attorneyDatas();
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

  inputChangeHandler = name => event => {
    console.log('amountValue', {name, event});
    this.setState({
      [name]: event,
    });
  };

  attorneyDatas = () => {
    let cb = [];
    this.state.attorneyList.map(([key, items], index) => {
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    this.setState({attorneyData: cb});
    return cb;
  };

  carriedOutBy = () => {
    let cb = [];
    this.state.carriedoutby.map(([key, items], index) => {
      if (items !== null) {
        cb.push({
          label: items,
          value: key,
          // id: item.id,
        });
      }
    });
    this.setState({madeBy: cb});
    return cb;
  };

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
    this.setState({paymentMethod: cb});
    return cb;
  };

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
      res.map((res, index) => {
        this.setState({
          inoviceDocURL: res.uri,
          invoiceDocType: res.type,
          invoiceDocName: res.name,
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
  async uploadChamberDoc(type) {
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
      res.map((res, index) => {
        this.setState({
          inoviceChamberDocURL: res.uri,
          chamberDocName: res.name,
          chamberDocType: res.type,
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
  async societyAnotherDoc(type) {
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
      res.map((res, index) => {
        this.setState({
          inoviceDocURL: res.uri,
          socAnotherDocName: res.name,
          socAnotherDocType: res.type,
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
  async trasactionDoc(type) {
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
      res.map((res, index) => {
        this.setState({
          inoviceTranDocURL: res.uri,
          tranDocName: res.name,
          tranDocType: res.type,
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

  countrySelectValue(value) {
    this.setState({countrySelect: value});
    if (value === 107) {
      this.selectCustProvience(value);
    }
  }

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

  async openExcelGallery() {
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    // }).then((image) => {
    //   const fileName = FunctionUtils.GetFilename(image.path);
    //   this.setState({ docDetail: image.path, docName: fileName });
    // });
    try {
      const res = await DocumentPicker.pick({
        // allowMultiSelection,
        type: [DocumentPicker.types.xlsx],
      });

      if (res && res.length > 0) {
        const document = res[0];
        console.log(
          document.uri,
          document.type, // mime type
          document.name,
          document.size,
        );
        this.setState({
          docDetail: document.uri,
          docType: document.type,
          docName: document.name,
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  async openCSVGallery() {
    // ImagePicker.openCamera({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    // }).then((image) => {
    //   const fileName = FunctionUtils.GetFilename(image.path);
    //   this.setState({ docDetail: image.path, docName: fileName });
    // });
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
      this.setState({
        docDetail: res.uri,
        docType: res.type,
        docName: res.name,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  async takePhotoFromCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      const fileName = FunctionUtils.GetFilename(image.path);
      this.setState({
        docDetail: image.path,
        // docName: fileName,
        base64: image.data,
      });
      this.setState(prevState => ({
        imagesArray: [
          ...prevState.imagesArray,
          {uri: `data:image/png;base64,${image.data}`},
        ],
        // imagesArray: [...prevState.imagesArray, image.path],
      }));
    });

    //OpenGallary
    // ImagePicker.openPicker({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    //   includeBase64: true,
    // }).then(image => {
    //   console.log('images', image);
    //   const fileName = FunctionUtils.GetFilename(image.path);
    //   console.log('fileName', fileName);
    //   this.setState({
    //     docDetail: image.path,
    //     // docName: fileName,
    //     base64: image.data,
    //   });
    //   this.setState(prevState => ({
    //     imagesArray: [
    //       ...prevState.imagesArray,
    //       {uri: `data:image/png;base64,${image.data}`},
    //     ],
    //     // imagesArray: [...prevState.imagesArray, image.path],
    //   }));
    // });
  }

  convertBase64toBlob = async uri => {
    try {
      const base64 = await fetch(`data:image/png;base64,${uri}`).then(res =>
        console.log('imageRes', res),
      );
      console.log('base64base64', base64);
    } catch (error) {
      console.log('error', error);
    }
    const blob = await base64.blob();
    console.log('base64>>', blob);
    return blob;
  };

  combineImage = async () => {
    console.log('this.state', this.state.imagesArray);
    const {imagesArray} = this.state;
    try {
      ImagesMerge.mergeImages(imagesArray, result => {
        console.log('resultMerging', result);
        this.setState({mergeImage: result});
        // this.convertBase64toBlob(result);
        console.log('resultMerge', result);
      });
    } catch (error) {
      console.log('catchError', error);
    }
  };

  cancleImage = indexNum => {
    const removeImage = this.state.imagesArray.filter(
      (_, index) => index !== indexNum,
    );
    this.setState({imagesArray: removeImage});
  };

  showDatePicker = () => {
    this.setDatePickerVisibility(true);
  };

  hideDatePicker = () => {
    this.setDatePickerVisibility(false);
  };

  setDatePickerVisibility = status => {
    this.setState({
      calenderOpenstatus: status,
      registrationOpenDate: status,
      dateIdentityNaturalVisible: status,
    });
  };

  handleConfirm = date => {
    // console.log('handle>>>', date);
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({
      dateIdentity: date.format('DD/MM/YYYY'),
    });
    this.hideDatePicker();
  };
  identityDateNatural = date => {
    // console.log('handle>>>', date);
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({
      dateIdentityNatural: date.format('DD/MM/YYYY'),
    });
    this.hideDatePicker();
  };
  societyHandleConfirm = date => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({
      societydateIdentity: date.format('DD/MM/YYYY'),
    });
    this.hideDatePicker();
  };
  transactionRegiDate = date => {
    var ds = date.toString();
    var date = moment(new Date(ds.substr(0, 16)));
    this.setState({
      invoiceRegistration: date.format('DD/MM/YYYY'),
    });
    this.hideDatePicker();
  };

  changeRadioBtnStatus(stateVarName) {
    this.setState({
      subjectType: stateVarName,
      radioBtnSelect: !this.state.radioBtnSelect,
    });
    setTimeout(() => {
      this.getCustQuestionList();
    }, 100);
  }

  newTranRadioButton = num => {
    this.setState({
      tracType: num,
      newTransaction: !this.state.newTransaction,
    });
  };

  attorneyRadioBtn = val => {
    this.setState({
      attorneyRadioBtnSelect: !this.state.attorneyRadioBtnSelect,
      attorneyBtnValue: val,
    });
  };

  changeRadioBtn(status, policy) {
    this.setState({changeBtnStatus: status, policyState: policy});
  }

  changeRadioBtnSecond(status, policy) {
    this.setState({changeBtnStatusSecond: status, policyState2: policy});
  }

  createNewCustomer = () => {
    const {
      firstNameValue,
      subjectType,
      dateIdentityNatural,
      lastNameValue,
      madeBySelect,
      Notes,
      reasonTypeSelect,
      invoiceRegistration,
      proTypeValue,
      invoiceDesc,
      countrySelect,
      provianceTypeName,
      amountTypeValue,
      amountValue,
      currencyTypeSelect,
      paymentMethodType,
      imagesArray,
      mergeImage,
      docDetail,
      docType,
      docName,
      Tradename,
      tranDocName,
      tranDocType,
      inoviceDocURL,
      invoiceDocType,
      invoiceDocName,
      inoviceChamberDocURL,
      chamberDocName,
      chamberDocType,
      inoviceTranDocURL,
      custQuestionListData,
      attorneyDataValue,
      tracType,
    } = this.state;

    imagesArray.map((imageUrl, index) =>
      this.setState({sendingImageUri: imageUrl}),
    );

    console.log('custQuestionListDataArray', custQuestionListData);

    var docImageMerge = mergeImage === null ? sendingImageUri : mergeImage;

    var documentPath = {
      uri: inoviceDocURL,
      type: invoiceDocType,
      name: invoiceDocName,
    };

    var chamberDoc = {
      uri: inoviceChamberDocURL,
      type: chamberDocType,
      name: chamberDocName,
    };

    var transactionDoc = {
      uri: inoviceTranDocURL,
      type: tranDocType,
      name: tranDocName,
    };

    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      const formData = new FormData();
      formData.append('first_name', firstNameValue);
      formData.append('subject_type', subjectType);
      formData.append('doc_file', mergeImage);
      formData.append('doc_file_another', documentPath);
      // formData.append('que_answer[]',);
      formData.append('date_identification', dateIdentityNatural);
      formData.append('last_name', lastNameValue);
      formData.append('made_by_id', madeBySelect);
      formData.append('note', Notes);
      if (tracType == 1) {
        formData.append('transaction_reason_id', reasonTypeSelect);
        formData.append('transaction_registration_date', invoiceRegistration);
        formData.append('transaction_professional_id', proTypeValue);
        formData.append('transaction_description', invoiceDesc);
        formData.append('transaction_doc_file', transactionDoc);
        formData.append('transaction_country_id', countrySelect);
        formData.append('transaction_provinces_id', provianceTypeName);
        formData.append('transaction_amount_type', amountTypeValue);
        formData.append('transaction_amount', amountValue);
        formData.append('transaction_coin', currencyTypeSelect);
        formData.append('transaction_payment_method_id', paymentMethodType);
      }
      formData.append('doc_file_chamber', chamberDoc);
      if (subjectType == 2) {
        formData.append('trade_name', Tradename);
        formData.append('attorney_id', attorneyDataValue);
        formData.append('doc_attorney', mergeImage);
      }
      console.log('FormData<<<>>>', formData);

      this.props.addNewCustomerAPI(formData).then(async () => {
        const {addNewCustomer, msgError, error} = this.props;
        console.log('checkAddNew>>>', addNewCustomer);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (addNewCustomer != null) {
          FunctionUtils.showToast(addNewCustomer.message);
          Actions.pop();
          this.setState({isLoading: false});
        } else if (errorData && errorData.date_identification) {
          this.setState({isLoading: false});
          FunctionUtils.showToast(errorData.date_identification[0]);
        } else if (errorData && errorData.doc_file) {
          this.setState({isLoading: false});
          FunctionUtils.showToast(errorData.doc_file[0]);
        } else if (value && value == 'Unauthenticated.') {
          this.setState({isLoading: false});
          FunctionUtils.clearLogin();
        } else if (value && value !== 'Unauthenticated.') {
          this.setState({isLoading: false});
          FunctionUtils.showToast(value);
        } else {
          this.setState({isLoading: false});
          FunctionUtils.showToast(addNewCustomer.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  };

  newTransationAPI = () => {};

  newCustomerCreate() {
    // this.props.getUpdatedUsersList();
    // Actions.pop();
    const {
      subjectType,
      dateIdentity,
      qGroupId,
      qSurveyid,
      question1Id,
      ans1Id,
      question2Id,
      ans2Id,
      question3Id,
      docDetail,
      docType,
      docName,
      ans3Id,
      qusAnsParam,
    } = this.state;
    // var size = 1;
    // var arrayOfArrays = [];
    // for (var i = 0; i < qusAnsParam.length; i ++) {
    //   arrayOfArrays.push(qusAnsParam.slice(i, i + size));
    // }
    var groupSet1 = [
      qusAnsParam[0].ques,
      qusAnsParam[0].riskName,
      qusAnsParam[0].riskValue,
    ].join();
    var groupSet2 = [
      qusAnsParam[1].ques,
      qusAnsParam[1].riskName,
      qusAnsParam[1].riskValue,
    ].join();
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      if (dateIdentity == '') {
        FunctionUtils.showToast(strings.dateIdentity);
      } else {
        this.setState({isLoading: true});
        var documentPath = {
          uri: docDetail,
          type: docType,
          name: docName,
        };
        const formData = new FormData();
        formData.append('subject_type', subjectType);
        formData.append('date_identification', dateIdentity);
        formData.append('que_answer[]', groupSet1.toString());
        formData.append('que_answer[]', groupSet2.toString());
        // formData.append("que_answer[]", groupSet3.toString());
        formData.append('doc_file', documentPath);
        this.props.addNewCustomerAPI(formData).then(async () => {
          const {addNewCustomer, msgError, error} = this.props;
          console.log('addNewCustomer>>>', addNewCustomer);
          let value = FunctionUtils.unauthMsgHandling(msgError);
          let errorData;
          {
            error ? (errorData = JSON.parse(error)) : null;
          }
          if (addNewCustomer != null) {
            FunctionUtils.showToast(addNewCustomer.message);
            Actions.pop();
            this.setState({isLoading: false});
          } else if (errorData && errorData.date_identification) {
            this.setState({isLoading: false});
            FunctionUtils.showToast(errorData.date_identification[0]);
          } else if (errorData && errorData.doc_file) {
            this.setState({isLoading: false});
            FunctionUtils.showToast(errorData.doc_file[0]);
          } else if (value && value == 'Unauthenticated.') {
            this.setState({isLoading: false});
            FunctionUtils.clearLogin();
          } else if (value && value !== 'Unauthenticated.') {
            this.setState({isLoading: false});
            FunctionUtils.showToast(value);
          } else {
            this.setState({isLoading: false});
            FunctionUtils.showToast(addNewCustomer.message);
          }
        });
      }
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  saveTheUserQusAnsNumber(questionId, answeId, index) {
    if (index === 0) {
      setTimeout(() => {
        this.setState({question1Id: questionId, ans1Id: answeId});
      }, 100);
    } else if (index === 1) {
      setTimeout(() => {
        this.setState({question2Id: questionId, ans2Id: answeId});
      }, 100);
    } else if (index === 2) {
      setTimeout(() => {
        this.setState({question3Id: questionId, ans3Id: answeId});
      }, 100);
    } else {
      setTimeout(() => {
        this.setState({
          question1Id: 0,
          ans1Id: 0,
          question2Id: 0,
          ans2Id: 0,
          question3Id: 0,
          ans3Id: 0,
        });
      }, 100);
    }
  }

  checkTheRadioButton(item, arrayIndex, answerItem, index) {
    this.saveTheUserQusAnsNumber(
      this.state.custQuestionListData[arrayIndex].answers.answer[index]
        .answerid,
      this.state.custQuestionListData[arrayIndex].id,
      arrayIndex,
    );
    this.state.custQuestionListData[arrayIndex].answers.answer[index].checked =
      !answerItem.checked;
    if (index === 1) {
      this.state.custQuestionListData[
        arrayIndex
      ].answers.answer[0].checked = false;
    } else {
      this.state.custQuestionListData[
        arrayIndex
      ].answers.answer[1].checked = false;
    }
    this.setState({custQuestionListData: this.state.custQuestionListData});
    return this.state.custQuestionListData[arrayIndex].answers.answer[index]
      .checked;
  }

  radioButtonDesign(item, arrayIndex, answerItem, index) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.checkTheRadioButton(item, arrayIndex, answerItem, index);
        }}
        style={{flexDirection: 'row'}}>
        <Image
          source={
            answerItem.checked ? images.radioSelect : images.radioUnselect
          }
          style={styles.locationPIN}
        />
        <Text style={styles.dateTimeModal}>{answerItem.answer}</Text>
      </TouchableOpacity>
    );
  }

  _renderFilterOptions(value, answerType, index) {
    let selectedKey = Object.keys(
      this.state.custQuestionListData[this.state.currentIndex],
    ).find(ele => ele === value);
    if (answerType == 1) {
      if (value == 'yes' || value == 'no') {
        return (
          <View style={styles.filterOptionRenderMainView}>
            <TouchableOpacity
              hitSlop={ConstantUtils.hitSlop.twenty}
              onPress={() => this.onPressFilterOption(index, value)}>
              <Image
                source={
                  value === selectedKey
                    ? images.radioSelect
                    : images.radioUnselect
                }
                style={styles.filterSelectionImg}
              />
            </TouchableOpacity>
            <Text style={styles.filterOptionName}>{value}</Text>
          </View>
        );
      }
    } else {
      if (
        value == 'no-risk' ||
        value == 'low-risk' ||
        value == 'high-risk' ||
        value == 'medium-risk'
      ) {
        return (
          <View style={styles.filterOptionRenderMainView}>
            <TouchableOpacity
              hitSlop={ConstantUtils.hitSlop.twenty}
              onPress={() => this.onPressFilterOption(index, value)}>
              <Image
                source={
                  value === selectedKey
                    ? images.radioSelect
                    : images.radioUnselect
                }
                style={styles.filterSelectionImg}
              />
            </TouchableOpacity>
            <Text style={styles.filterOptionName}>{value}</Text>
          </View>
        );
      }
    }
  }

  openPopover(item, arrayIndex) {
    this.setFilterOptionsView();
    this.setState({
      showPopover: true,
      questionId: item.question_id,
      policyAnswers: {...item, arrayIndex},
      answerIndex: item.answer_type,
      currentIndex: arrayIndex,
    });
  }

  onPressFilterOption(index, value) {
    let answer = Object.entries(this.state.policyAnswers.config).filter(
      ([node]) => node === value,
    );
    let [key, values] = answer[0];
    this.setState(prevState => ({
      custQuestionListData: prevState.custQuestionListData.map((ele, index) => {
        if (index === this.state.currentIndex) {
          ['yes', 'no', 'no-risk', 'low-risk', 'high-risk', 'medium-risk'].map(
            key => delete ele[key],
          );
          return {...ele, [key]: values};
        }
        return {...ele};
      }),
    }));
  }

  closePopover = () => this.setState({showPopover: false});

  setFilterOptionsView = e => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({popoverAnchor: {x, y, width, height}});
      });
    }
  };

  privacyPolicyViewdesign(item, arrayIndex) {
    return (
      <View style={[styles.thirdBoxView]}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.fourthViewText}>{item.name}</Text>
          <ButtonWithImage
            buttonTitle={'Answer'}
            onButtonPress={() => this.openPopover(item, arrayIndex)}
            height={moderateScale(40)}
            width={'40%'}
            backgroundColor={colors.white}
          />
          {/* {item.answers.answer.map((answerItem, index) => {
              return this.radioButtonDesign(
                item,
                arrayIndex,
                answerItem,
                index
              );
            })} */}
        </View>
      </View>
    );
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
      userDOB,
      userERD,
      atecoCodeId,
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
        firstNameValue: firstNameValue,
        lastNameValue: lastNameValue,
      });
    }
  }

  render() {
    const {
      radioBtnSelect,
      isLoading,
      dateIdentity,
      dateIdentityNatural,
      custQuestionListData,
      docName,
      policyAnswers,
      docDetail,
      imagesArray,
      firstNameValue,
      lastNameValue,
      typeData,
      madeBy,
      Notes,
      settingCustomerList,
      selectedUserID,
      valueData,
      riskAssetmentData,
      professionalPerformance,
      inVoiceTypeSelect,
      invoiceRegistration,
      currencyData,
      destCountryData,
      invoiceDesc,
      userStateList,
      countrySelect,
      amountValue,
      fractionalData,
      newTransaction,
      subjectType,
      Tradename,
      profData,
      profMapData,
      proTypeValue,
      amountMap,
      paymentMethod,
      attorneyRadioBtnSelect,
      attorneyBtnValue,
      reasonData,
      societydateIdentity,
      chamberDocName,
      socAnotherDocName,
      tranDocName,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          scrollEvent={event => {
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
              rightIcon={images.skip}
              headerTxtMain={strings.addCustomer}
              rightIconPress={() => Actions.ManuallyAddCustomer()}
              isSkipRegistration={true}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              rightIcon={images.skip}
              headerTxtMain={strings.addCustomer}
              rightIconPress={() => Actions.ManuallyAddCustomer()}
              isSkip={true}
            />
          )}>
          <SafeAreaView>
            <View
              style={{
                marginTop: moderateScale(15),
                marginHorizontal: moderateScale(15),
              }}>
              <View style={styles.firstBoxMainView}>
                <Text style={styles.headerStyle}>{strings.typeofsubject}</Text>
                <View style={styles.firstRowView}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', borderWidth: 0}}
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
                    <Text numberOfLines={1} style={styles.customerName}>
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
                    <Text style={styles.dateTimeModal}>{strings.sociaty}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                <Text numberOfLines={1} style={styles.headerStyle}>
                  {strings.mainData}
                </Text>
              </View>
              {subjectType == 1 ? (
                <>
                  <View style={styles.mainDataBoxView}>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.textInputBoxDesign}
                        placeholder={strings.firstN}
                        value={firstNameValue}
                        ref={this.firstNameValueRef}
                        onChangeText={this.inputChangeHandler('firstNameValue')}
                      />
                      {firstNameValue != '' ? null : (
                        <Text style={styles.redStarDesign}>{strings.Star}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.mainDataBoxView}>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.textInputBoxDesign}
                        placeholder={strings.lastN}
                        value={lastNameValue}
                        onChangeText={this.inputChangeHandler('lastNameValue')}
                      />
                      {lastNameValue != '' ? null : (
                        <Text style={styles.redStarDesign}>{strings.Star}</Text>
                      )}
                    </View>
                  </View>
                  {/* Question and Answer */}
                  <View>
                    <Popover
                      visible={this.state.showPopover}
                      fromRect={this.state.popoverAnchor}
                      contentStyle={{
                        borderWidth: 0,
                        marginLeft: moderateScale(30),
                        marginTop: moderateScale(280),
                        borderRadius: moderateScale(5),
                        borderColor: colors.colorGray,
                        // height: moderateScale(150),
                        // width: moderateScale(180),
                      }}
                      arrowStyle={{
                        borderWidth: 0,
                        marginTop: moderateScale(280),
                      }}
                      onClose={this.closePopover}
                      supportedOrientations={['portrait', 'landscape']}
                      // placement="auto"
                    >
                      <View style={styles.filterModalView}>
                        {this.state.showPopover &&
                          Object.entries(this.state.policyAnswers.config).map(
                            ([node, block], index) =>
                              this._renderFilterOptions(
                                node,
                                this.state.policyAnswers.answer_type,
                                index,
                              ),
                          )}
                        {/* {this._renderFilterOptions()} */}
                        {/* <Text style={styles.filerHeading}>
                    {strings.filterBySpecificReasons}
                  </Text> */}
                        {/* <FlatList
                      data={policyAnswers}
                      renderItem={({item, index}) =>
                        this._renderFilterOptions(item, index)
                      }
                      //style={{ flex: 1, marginBottom: moderateScale(10) }}
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      keyExtractor={(item, index) => index.toString()}
                    /> */}
                      </View>
                    </Popover>
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
                          {dateIdentityNatural
                            ? dateIdentityNatural
                            : strings.dateIdent}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={this.state.dateIdentityNaturalVisible}
                        mode="date"
                        onConfirm={this.identityDateNatural}
                        onCancel={this.hideDatePicker}
                      />
                    </View>
                  </View>

                  {/* <View>
                  <Text numberOfLines={1} style={styles.headerStyle}>
                    {strings.docUpload}
                  </Text>
                </View>
                <View style={[styles.thirdBoxView, {height: 'auto'}]}> */}
                  {/* <View style={{flexDirection: 'row'}}> */}
                  {/* <TouchableOpacity
                      onPress={() => {
                        this.takePhotoFromCamera();
                      }}>
                      <Image source={images.upload} style={styles.openCamera} />
                      <Text
                        style={[
                          styles.uploadTxt,
                          {marginLeft: moderateScale(5)},
                        ]}>
                        {!imagesArray ? '' : strings.imageUpload}
                      </Text>
                    </TouchableOpacity> */}

                  {/* <Text numberOfLines={1} style={styles.middleText}>
                      or
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.openExcelGallery();
                      }}>
                      <Image
                        source={images.upload}
                        style={styles.galleryImageDesign}
                      />
                      <Text
                        style={[
                          styles.uploadTxt,
                          // {marginLeft: moderateScale(10)},
                        ]}>
                        {docName ? '' : strings.excelUpload}
                      </Text>
                    </TouchableOpacity>

                    <Text numberOfLines={1} style={styles.middleText}>
                      or
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        this.openCSVGallery();
                      }}>
                      <Image
                        source={images.upload}
                        style={[
                          styles.cameraImageDesign,
                          {marginLeft: moderateScale(5)},
                        ]}
                      />
                      <Text style={styles.uploadTxt}>
                        {docName ? '' : strings.invoiceUpload}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {docName !== '' ? (
                    <Text style={{alignSelf: 'center', marginTop: 5}}>
                      {docName}
                    </Text>
                  ) : null} */}

                  {/* {docDetail !== '' ? (
                  <Image
                    source={{uri: docDetail}}
                    resizeMode="contain"
                    style={{width: 50, height: 50}}
                  />
                ) : null} */}
                  {/* <ScrollView
                    style={{flex: 1, flexDirection: 'row', width: '100%'}}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {imagesArray !== ''
                      ? imagesArray.map((imageUrl, index) => (
                          <View
                            style={{
                              width: moderateScale(80),
                              height: moderateScale(80),
                              borderRadius: 10,
                              marginTop: 10,
                              marginLeft: index === 0 ? 0 : 5,
                              marginBottom: 10,
                            }}>
                            <Image
                              source={imageUrl}
                              style={{
                                width: moderateScale(80),
                                height: moderateScale(80),
                                resizeMode: 'contain',
                              }}
                            />
                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                right: 5,
                                top: -2,
                              }}
                              onPress={() => this.cancleImage(index)}>
                              <Image
                                source={images.close}
                                // resizeMode="contain"
                                style={{width: 15, height: 15}}
                              />
                            </TouchableOpacity>
                          </View>
                        ))
                      : null}
                  </ScrollView>
                  {imagesArray.length > 1 && (
                    <Button
                      buttonTitle={'Merge'}
                      onButtonPress={() => this.combineImage()}
                      height={moderateScale(30)}
                      width={'100%'}
                      backgroundColor={colors.redColor}
                      textStyle={styles.btnTxtStyle}
                    />
                  )} */}
                  {/* </View> */}

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.uploadDoc}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <TouchableOpacity
                        onPress={() => {
                          this.takePhotoFromCamera();
                        }}
                        style={styles.uploadView}>
                        <Image
                          source={images.upload}
                          style={styles.documentStatusImg}
                        />
                        <Text
                          style={[
                            styles.uploadTxt,
                            {marginLeft: moderateScale(5)},
                          ]}>
                          {!imagesArray ? '' : strings.uploadDoc}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView
                      style={{flex: 1, flexDirection: 'row', width: '100%'}}
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                      {imagesArray !== ''
                        ? imagesArray.map((imageUrl, index) => (
                            <View
                              style={{
                                width: moderateScale(80),
                                height: moderateScale(80),
                                borderRadius: 10,
                                marginTop: 10,
                                marginLeft: index === 0 ? 0 : 5,
                                marginBottom: 10,
                              }}>
                              <Image
                                source={imageUrl}
                                style={{
                                  width: moderateScale(80),
                                  height: moderateScale(80),
                                  resizeMode: 'contain',
                                }}
                              />
                              <TouchableOpacity
                                style={{
                                  position: 'absolute',
                                  right: 5,
                                  top: -2,
                                }}
                                onPress={() => this.cancleImage(index)}>
                                <Image
                                  source={images.close}
                                  // resizeMode="contain"
                                  style={{width: 15, height: 15}}
                                />
                              </TouchableOpacity>
                            </View>
                          ))
                        : null}
                    </ScrollView>
                    {imagesArray.length > 1 && (
                      <Button
                        buttonTitle={'Merge'}
                        onButtonPress={() => this.combineImage()}
                        height={moderateScale(30)}
                        width={'100%'}
                        backgroundColor={colors.redColor}
                        textStyle={styles.btnTxtStyle}
                      />
                    )}
                    <Text numberOfLines={5} style={styles.imageDocTxt}>
                      {
                        'Allowed format .jpg and .png. The uploaded image should not be flickering or blurry. The image should be captured without any background.'
                      }
                    </Text>
                  </View>

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.uploadAnotherDoc}
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
                          {this.state.invoiceDocName
                            ? this.state.invoiceDocName
                            : strings.uploadDoc}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.commonRowType}>
                    <View style={styles.madeByView}>
                      <RNPickerSelect
                        placeholder={{
                          label: strings.madeBy,
                          value: null,
                        }}
                        onValueChange={
                          value => this.setState({madeBySelect: value})
                          // console.log('selectedMadebyValue', value)
                        }
                        items={madeBy}
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

                  <View style={styles.mainDataBoxView}>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.textInputBoxDesign}
                        placeholder={strings.notes}
                        value={Notes}
                        onChangeText={this.inputChangeHandler('Notes')}
                        ref={this.invoiceDescRef}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                        }}
                      />
                      {Notes != '' ? null : (
                        <Text style={styles.redStarDesign}>{strings.Star}</Text>
                      )}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.mainDataBoxView}>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.textInputBoxDesign}
                        placeholder={strings.tradeName}
                        value={Tradename}
                        ref={this.TradenameRef}
                        onChangeText={this.inputChangeHandler('Tradename')}
                      />
                      {Tradename != '' ? null : (
                        <Text style={styles.redStarDesign}>{strings.Star}</Text>
                      )}
                    </View>
                  </View>
                  {/* Question and Answer */}
                  <View>
                    <Popover
                      visible={this.state.showPopover}
                      fromRect={this.state.popoverAnchor}
                      contentStyle={{
                        borderWidth: 0,
                        marginLeft: moderateScale(30),
                        marginTop: moderateScale(280),
                        borderRadius: moderateScale(5),
                        borderColor: colors.colorGray,
                        // height: moderateScale(150),
                        // width: moderateScale(180),
                      }}
                      arrowStyle={{
                        borderWidth: 0,
                        marginTop: moderateScale(280),
                      }}
                      onClose={this.closePopover}
                      supportedOrientations={['portrait', 'landscape']}
                      // placement="auto"
                    >
                      <View style={styles.filterModalView}>
                        {this.state.showPopover &&
                          Object.entries(this.state.policyAnswers.config).map(
                            ([node, block], index) =>
                              this._renderFilterOptions(
                                node,
                                this.state.policyAnswers.answer_type,
                                index,
                              ),
                          )}
                      </View>
                    </Popover>
                  </View>

                  {/* <View style={styles.secondBoxMainView}>
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
                          {dateIdentity
                            ? dateIdentity
                            : strings.dateIdent}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={this.state.calenderOpenstatus}
                        mode="date"
                        onConfirm={this.societyHandleConfirm}
                        onCancel={this.hideDatePicker}
                      />
                    </View>
                  </View> */}

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
                          {dateIdentity ? dateIdentity : strings.dateIdent}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={this.state.calenderOpenstatus}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                      />
                    </View>
                  </View>

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={2} style={styles.docUploadTypeTxt}>
                      {strings.uploadChamberDoc}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <TouchableOpacity
                        onPress={() => {
                          this.uploadChamberDoc(true);
                        }}
                        style={styles.uploadView}>
                        <Image
                          source={images.upload}
                          style={styles.documentStatusImg}
                        />
                        <Text
                          style={[
                            styles.uploadTxt,
                            {marginLeft: moderateScale(5)},
                          ]}>
                          {chamberDocName ? chamberDocName : strings.uploadDoc}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {/* <Text numberOfLines={5} style={styles.imageDocTxt}>
                      {
                        'Allowed format .jpg and .png. The uploaded image should not be flickering or blurry. The image should be captured without any background.'
                      }
                    </Text> */}
                  </View>

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.uploadAnotherDoc}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <TouchableOpacity
                        onPress={() => this.societyAnotherDoc(true)}
                        style={styles.uploadView}>
                        <Image
                          source={images.upload}
                          style={styles.documentStatusImg}
                        />
                        <Text style={styles.uploadTxt}>
                          {socAnotherDocName
                            ? socAnotherDocName
                            : strings.uploadDoc}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.commonRowType}>
                    <View style={styles.madeByView}>
                      <RNPickerSelect
                        placeholder={{
                          label: strings.madeBy,
                          value: null,
                        }}
                        onValueChange={value =>
                          this.setState({madeBySelect: value})
                        }
                        items={madeBy}
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

                  <View style={styles.mainDataBoxView}>
                    <View style={{flexDirection: 'row'}}>
                      <TextInput
                        style={styles.textInputBoxDesign}
                        placeholder={strings.notes}
                        value={Notes}
                        onChangeText={text => this.setState({Notes: text})}
                        ref={this.invoiceDescRef}
                      />
                    </View>
                  </View>

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
                        <Text numberOfLines={1} style={styles.customerName}>
                          {strings.selectFromExis}
                        </Text>
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
                        <Text style={styles.dateTimeModal}>
                          {strings.addNew}
                        </Text>
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
                          onValueChange={value =>
                            this.setState({attorneyDataValue: value})
                          }
                          items={this.state.attorneyData}
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
                        {strings.uploadDoc}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <TouchableOpacity
                          onPress={() => {
                            this.takePhotoFromCamera();
                          }}
                          style={styles.uploadView}>
                          <Image
                            source={images.upload}
                            style={styles.documentStatusImg}
                          />
                          <Text
                            style={[
                              styles.uploadTxt,
                              {marginLeft: moderateScale(5)},
                            ]}>
                            {!imagesArray ? '' : strings.uploadDoc}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        style={{flex: 1, flexDirection: 'row', width: '100%'}}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {imagesArray !== ''
                          ? imagesArray.map((imageUrl, index) => (
                              <View
                                style={{
                                  width: moderateScale(80),
                                  height: moderateScale(80),
                                  borderRadius: 10,
                                  marginTop: 10,
                                  marginLeft: index === 0 ? 0 : 5,
                                  marginBottom: 10,
                                }}>
                                <Image
                                  source={imageUrl}
                                  style={{
                                    width: moderateScale(80),
                                    height: moderateScale(80),
                                    resizeMode: 'contain',
                                  }}
                                />
                                <TouchableOpacity
                                  style={{
                                    position: 'absolute',
                                    right: 5,
                                    top: -2,
                                  }}
                                  onPress={() => this.cancleImage(index)}>
                                  <Image
                                    source={images.close}
                                    // resizeMode="contain"
                                    style={{width: 15, height: 15}}
                                  />
                                </TouchableOpacity>
                              </View>
                            ))
                          : null}
                      </ScrollView>
                      {imagesArray.length > 1 && (
                        <Button
                          buttonTitle={'Merge'}
                          onButtonPress={() => this.combineImage()}
                          height={moderateScale(30)}
                          width={'100%'}
                          backgroundColor={colors.redColor}
                          textStyle={styles.btnTxtStyle}
                        />
                      )}
                      <Text numberOfLines={5} style={styles.imageDocTxt}>
                        {
                          'Allowed format .jpg and .png. The uploaded image should not be flickering or blurry. The image should be captured without any background.'
                        }
                      </Text>
                    </View>
                  )}
                </>
              )}
              <View>
                <Text numberOfLines={1} style={styles.headerStyle}>
                  {strings.seriesofQuestion}
                </Text>
              </View>
              {custQuestionListData.map((item, index) => {
                return this.privacyPolicyViewdesign(item, index);
              })}
            </View>
            {/* New Transaction */}
            <View
              style={{
                marginTop: moderateScale(15),
                marginHorizontal: moderateScale(15),
                flexDirection: 'row',
                width: '20%',
              }}>
              <View>
                <Text style={styles.headerStyle}>
                  {strings.newTran + ' : '}
                </Text>
              </View>
              <View style={styles.firstRowView}>
                <TouchableOpacity
                  style={{flexDirection: 'row', borderWidth: 0}}
                  onPress={() => {
                    this.newTranRadioButton(1);
                  }}>
                  <Image
                    source={
                      newTransaction ? images.radioSelect : images.radioUnselect
                    }
                    style={styles.newTranRadioButton}
                  />
                  <Text numberOfLines={1} style={styles.customerName}>
                    {'Yes'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.firstRowView}>
                <TouchableOpacity
                  style={{flexDirection: 'row', borderWidth: 0}}
                  onPress={() => {
                    this.newTranRadioButton(0);
                  }}>
                  <Image
                    source={
                      newTransaction ? images.radioUnselect : images.radioSelect
                    }
                    style={styles.newTranRadioButton}
                  />
                  <Text numberOfLines={1} style={styles.customerName}>
                    {'No'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <SafeAreaView>
              {this.state.tracType == 1 ? (
                <View
                  style={{
                    marginTop: moderateScale(10),
                    marginHorizontal: moderateScale(15),
                  }}>
                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.reason}
                    </Text>
                    {/* <Text style={styles.docUploadTypeTxt}>{strings.invoice}</Text> */}
                    <View style={styles.uploadCSVBoxView}>
                      <RNPickerSelect
                        placeholder={{
                          label: strings.invoiceSelectReason,
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

                  <View style={{marginTop: moderateScale(10)}}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.invoiceRegiDate}
                    </Text>
                    <View style={styles.TransecondBoxMainView}>
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
                      onConfirm={this.transactionRegiDate}
                      onCancel={this.hideDatePicker}
                    />
                  </View>

                  <View style={styles.profViewBox}>
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
                          this.setState({proTypeValue: value})
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
                      {strings.invoiceDesc}
                    </Text>
                    <View
                      style={[
                        styles.descBoxView,
                        {
                          // margin: moderateScale(8),
                          height: moderateScale(60),
                          padding: moderateScale(10),
                        },
                      ]}>
                      <TextInput
                        placeholder={strings.invoiceDesc}
                        style={{fontSize: moderateScale(14)}}
                        value={invoiceDesc}
                        onChangeText={this.inputChangeHandler('invoiceDesc')}
                        textAlignVertical="top"
                        multiline={true}
                      />
                    </View>
                  </View>

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.uploadDoc}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <TouchableOpacity
                        onPress={() => this.trasactionDoc(true)}
                        style={styles.uploadView}>
                        <Image
                          source={images.upload}
                          style={styles.documentStatusImg}
                        />
                        <Text style={styles.uploadTxt}>
                          {tranDocName ? tranDocName : strings.uploadDoc}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* {inVoiceTypeSelect === 3 ? (
                    <View style={styles.commonRowType}>
                      <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                        {strings.invoiceFractional}
                      </Text>
                      <View style={styles.uploadCSVBoxView}>
                        <RNPickerSelect
                          placeholder={{
                            label: strings.invoiceSelectFractional,
                            value: null,
                          }}
                          onValueChange={value =>
                            this.setState({invoiceFractional: value})
                          }
                          items={fractionalData}
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
                  ) : null} */}

                  <View style={styles.commonRowType}>
                    <Text numberOfLines={1} style={styles.docUploadTypeTxt}>
                      {strings.custCounty}
                    </Text>
                    <View style={styles.uploadCSVBoxView}>
                      <RNPickerSelect
                        placeholder={{
                          label: strings.invoiceDesCountry,
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
                            label: strings.invoiceDesProvince,
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
                        <Text numberOfLines={1} style={styles.headerStyle}>
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
                            onChangeText={this.inputChangeHandler(
                              'amountValue',
                            )}
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
                              label: strings.invoiceCurrency,
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
                </View>
              ) : null}
              {/* {settingCustomerList && settingCustomerList.length > 0 ? (
                <AbsoluteBtn
                  btnTxt={strings.sendCustomerDetail}
                  onPressBtn={() => this.validateNewTransaction()}
                  marginRight={0}
                />
              ) : null} */}
            </SafeAreaView>
            <AbsoluteBtn
              btnTxt={strings.sendCustomerDetail}
              onPressBtn={() => this.createNewCustomer()}
              marginRight={0}
            />
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
    addNewCustomer: state.customerReducer.addNewCustomer, //accessing the redux state
    getCustomerQuestionList: state.customerReducer.getCustomerQuestionList, //accessing the redux state
    error: state.customerReducer.error, //accessing the redux state
    isloading: state.ticketReducer.isLoading,
    msgError: state.customerReducer.msgError,
    professionalPerformanceData:
      state.transcationReducer.professionalPerformanceData,
    customerListData: state.customerReducer.customerListData,
    stateList: state.customerReducer.stateList, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);

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
  filterOptionName: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  uploadTxt: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginLeft: 3,
  },
  filterModalView: {
    // height: height * 0.22,
    height: 'auto',
    marginLeft: moderateScale(3),
  },
  filterOptionRenderMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
    width: width * 0.75,
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
    // height: height * 0.12,
    height: 'auto',
    marginBottom: moderateScale(10),
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
    marginBottom: moderateScale(10),
    height: moderateScale(50),
    marginTop: moderateScale(10),
    justifyContent: 'center',
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

  descBoxView: {
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
  redStarDesign: {
    fontSize: moderateScale(15),
    top: moderateScale(10),
    left: moderateScale(10),
    color: colors.redColor,
  },
  uploadDocText: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    marginLeft: moderateScale(5),
  },
  headerStyle: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    top: moderateScale(10),
    marginBottom: moderateScale(5),
    marginLeft: moderateScale(5),
    width: '100%',
  },
  customerName: {
    fontSize: moderateScale(13),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    marginLeft: moderateScale(10),
  },
  locationPIN: {
    height: moderateScale(15),
    width: moderateScale(15),
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
    marginTop: moderateScale(3),
  },
  newTranRadioButton: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
    // marginTop: moderateScale(3),
  },
  galleryImageDesign: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: 'contain',
    marginLeft: moderateScale(10),
    marginTop: moderateScale(15),
  },
  openCamera: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: 'contain',
    marginLeft: moderateScale(10),
    marginTop: moderateScale(15),
  },

  cameraImageDesign: {
    height: moderateScale(50),
    width: moderateScale(50),
    resizeMode: 'contain',
    marginLeft: moderateScale(10),
    marginTop: moderateScale(15),
  },
  middleText: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
    textAlign: 'center',
    // top: moderateScale(20),
    textAlignVertical: 'center',
  },
  fourthViewText: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
  },
  // cameraImageDesign: {
  //   height: moderateScale(50),
  //   width: moderateScale(50),
  //   resizeMode: 'contain',
  //   marginRight: moderateScale(50),
  //   marginTop: moderateScale(25),
  // },
  customerAdd: {
    fontSize: moderateScale(13),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(8),
    flex: 1,
  },
  dateTimeModal: {
    fontSize: moderateScale(13),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(8),
  },
  firstRowView: {
    // height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  btnTxtStyle: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: fonts.PoppinsSemiBold,
    textTransform: 'uppercase',
  },
  commonRowType: {
    flexDirection: 'column',
    // margin: moderateScale(7),
    marginTop: moderateScale(10),
  },
  profViewBox: {
    commonRowType: {
      flexDirection: 'column',
    },
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
    // width: width - moderateScale(30),
    // marginBottom: moderateScale(10),
    // padding: moderateScale(15),
    // marginTop: moderateScale(16),
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
  docUploadTypeTxt: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(15),
    // top: moderateScale(10),
    // margin: moderateScale(4),
    // marginLeft: moderateScale(10),
  },
  imageDocTxt: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(10),
    marginTop: moderateScale(5),
  },
  TransecondBoxMainView: {
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
  calenderTextBoxDesign: {
    borderWidth: 0,
    fontSize: moderateScale(15),
    height: moderateScale(35),
    color: colors.colorGray,
    // left: moderateScale(10),
    // paddingTop: moderateScale(10),
    width: moderateScale(265),
  },
  tranUploadDocText: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    top: moderateScale(10),
    marginBottom: moderateScale(-4),
    marginLeft: moderateScale(5),
  },
  sideDropDownArrImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    // left: moderateScale(10),
    resizeMode: 'contain',
    right: moderateScale(10),
  },
});
