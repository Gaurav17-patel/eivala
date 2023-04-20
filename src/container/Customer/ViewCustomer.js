import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {debounce} from 'lodash';
import {Actions} from 'react-native-router-flux';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const {width, height} = Dimensions.get('window');
import {images, fonts, colors} from '../../themes';
import {moderateScale} from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import AbsoluteBtn from '../../components/AbsoluteBtn';
import {ActionCreators} from '../../redux/actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {FunctionUtils, NetworkUtils} from '../../utils';
import * as globals from '../../utils/globals';
import Loader from '../../components/LoaderOpacity';
import moment from 'moment';

class ViewCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      // customerDetailId:
      customerFirstName: '',
      customerLastName: '',
      customerAddress: '',
      customerSubjectType: '',
      customerVerificationType: '',
      customerCountryAddress: '',
      customerSpecificRiskType: '',
      isLoading: false,
      customerDetailsList: [],
      CompanyName: '',
      vatNumbers: '',
      fiscal_Code: '',
      performed_Activity: '',
      ateco_code: '',
      residenceAddress: '',
      city: '',
      state: '',
      dataLogging: '',
      postcode_residence: '',
      relation_Enddate: '',
      dateOfBirth: '',
      Provience: '',
      cityResidence: '',
      countryResidence: '',
      residence_ProvinceData: '',
      CAPCode: '',
      identification_Type: '',
      docExpiryDate: '',
      docType: '',
      docIdentityNumber: '',
      docIdentityissue: '',
      headquarters_address: '',
      headquarters_province: '',
      headquarters_state: '',
      headquarters_city: '',
      gender: '',
      status: '',
      docIdentityDate: '',
      docIdentityRealeseDate: '',
    };
  }

  componentDidMount() {
    this.pressFolderDetails = debounce(
      this.pressFolderDetails.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      },
    );
    // this.setUserData();
    this.customerDetails();
  }

  customerDetails() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    let {customerID} = this.props;
    console.log('customerID***', customerID);
    if (isConnected) {
      this.setState({isLoading: true});
      this.props
        .getCustomerDetails(globals.tokenValue, customerID)
        .then(async () => {
          const {customerDetails, msgError} = this.props;
          console.log('customerDetails****', customerDetails);
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (customerDetails && customerDetails.data) {
            this.setState({
              customerDetailsList: customerDetails.data,
              isLoading: false,
            });
            this.setUserData();
          } else if (value && value == 'Unauthenticated.') {
            this.setState({isLoading: false});
            FunctionUtils.clearLogin();
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  dateFormate = dates => {
    if (dates) {
      return moment(dates, 'DD/MM/YYYY').format('DD/MM/YYYY');
    } else {
      return '';
    }
  };

  checkGender = gen => {
    if (['m', 'M', 'Male'].includes(gen)) {
      return 'Male';
    }
    if (['f', 'F', 'Female'].includes(gen)) {
      return 'Female';
    }
  };

  checkStatus = status => {
    console.log('status', status);
    if (['0', 0].includes(status)) {
      return 'Canceled';
    }
    if (['1', 1].includes(status)) {
      return 'Temporary';
    }
    if (['2', 2].includes(status)) {
      return 'Definitive';
    }
  };

  setUserData() {
    let {customerProfileDetail} = this.props;
    const {customerDetailsList} = this.state;
    console.log('--------customerProfileDetail', customerProfileDetail);
    this.setState({
      // customerFirstName:
      //   customerProfileDetail.first_name !== null
      //     ? customerProfileDetail.first_name
      //     : strings.NA,
      // customerLastName:
      //   customerProfileDetail.last_name !== null
      //     ? customerProfileDetail.last_name
      //     : strings.NA,
      // customerAddress:
      //   customerProfileDetail.birthProvinceData !== null
      //     ? customerProfileDetail.birthProvinceData.name
      //     : strings.NA,
      // customerCountryAddress:
      //   customerProfileDetail.birthStateData !== null
      //     ? customerProfileDetail.birthStateData.name
      //     : strings.NA,
      // customerSubjectType:
      //   customerProfileDetail.subject_type !== null
      //     ? customerProfileDetail.subject_type
      //     : strings.NA,
      // customerVerificationType:
      //   customerProfileDetail.customerDetails !== null &&
      //   customerProfileDetail.customerDetails.verification_type_id !== null
      //     ? customerProfileDetail.customerDetails.verification_type_id
      //     : strings.NA,
      // customerSpecificRiskType:
      //   customerProfileDetail.customerDetails !== null &&
      //   customerProfileDetail.customerDetails.specific_risk !== null
      //     ? customerProfileDetail.customerDetails.specific_risk.value_name
      //     : strings.NA,

      customerFirstName:
        customerDetailsList?.first_name !== null
          ? customerDetailsList?.first_name
          : customerDetailsList?.business_name,
      customerLastName:
        customerDetailsList?.last_name !== null
          ? customerDetailsList?.last_name
          : '',
      customerAddress:
        customerDetailsList?.birthProvinceData !== null
          ? customerDetailsList?.birthProvinceData?.name
          : '-',
      customerCountryAddress:
        customerDetailsList?.birthStateData !== null
          ? customerDetailsList?.birthStateData?.name
          : '-',
      CompanyName:
        customerDetailsList?.business_name !== null
          ? customerDetailsList?.business_name
          : '-',
      vatNumbers:
        customerDetailsList?.vat_number !== null
          ? customerDetailsList?.vat_number
          : '-',
      fiscal_Code:
        customerDetailsList?.fiscal_code !== null
          ? customerDetailsList?.fiscal_code
          : '-',
      performed_Activity:
        customerDetailsList?.performed_activity !== null
          ? customerDetailsList?.performed_activity
          : '-',
      ateco_Code:
        customerDetailsList?.atecoCodeData !== null
          ? customerDetailsList?.atecoCodeData?.ateco_code
          : '-',
      residenceAddress:
        customerDetailsList?.residence_address !== null
          ? customerDetailsList?.residence_address
          : '-',
      city:
        customerDetailsList?.common_foreign_birth !== null
          ? customerDetailsList?.common_foreign_birth
          : '-',
      state:
        customerDetailsList?.birthStateData !== null
          ? customerDetailsList?.birthStateData.name
          : '-',
      status:
        customerDetailsList?.save_type_id !== null
          ? this.checkStatus(customerDetailsList?.save_type_id)
          : '-',
      gender:
        customerDetailsList?.customerDetails?.doc_gender_identity !== null
          ? this.checkGender(
              customerDetailsList?.customerDetails?.doc_gender_identity,
            )
          : '-',
      dataLogging:
        customerDetailsList?.registration_date !== null
          ? customerDetailsList?.registration_date
          : '-',
      postcode_Residence:
        customerDetailsList?.postcode_residence !== null
          ? customerDetailsList?.postcode_residence
          : '-',
      relation_Enddate:
        customerDetailsList?.relation_end_date !== null
          ? customerDetailsList?.relation_end_date
          : '-',
      dateOfBirth:
        customerDetailsList?.date_of_birth !== null
          ? customerDetailsList?.date_of_birth
          : '-',
      Provience:
        customerDetailsList?.birthProvinceData !== null
          ? customerDetailsList?.birthProvinceData.name
          : '-',
      cityResidence:
        customerDetailsList?.customerDetails?.common_foreign_residence !== null
          ? customerDetailsList?.customerDetails?.common_foreign_residence
          : '-',
      countryResidence:
        customerDetailsList?.residenceStateData !== null
          ? customerDetailsList?.residenceStateData?.name
          : '-',
      residence_ProvinceData:
        customerDetailsList?.residenceProvinceData !== null
          ? customerDetailsList?.residenceProvinceData?.name
          : '-',
      CAPCode:
        customerDetailsList?.postcode_residence !== null
          ? customerDetailsList?.postcode_residence
          : '-',
      identification_Type:
        customerDetailsList?.customerDetails?.IdentificationType
          ?.identification_type !== null
          ? customerDetailsList?.customerDetails?.IdentificationType
              ?.identification_type
          : '-',
      docIdentityDate:
        customerDetailsList?.customerDetails?.doc_identity_date !== null
          ? customerDetailsList?.customerDetails?.doc_identity_date
          : '-',
      docIdentityRealeseDate:
        customerDetailsList?.customerDetails?.doc_identity_release_date !== null
          ? customerDetailsList?.customerDetails?.doc_identity_release_date
          : '-',
      docExpiryDate:
        customerDetailsList?.customerDetails?.doc_identity_expiry_date !== null
          ? customerDetailsList?.customerDetails?.doc_identity_expiry_date
          : '-',
      docType:
        customerDetailsList?.customerDetails?.CustomerDocumentType !== null
          ? customerDetailsList?.customerDetails?.CustomerDocumentType
              ?.document_name
          : '-',
      docIdentityNumber:
        customerDetailsList?.customerDetails?.doc_identity_number !== null
          ? customerDetailsList?.customerDetails?.doc_identity_number
          : '-',
      docIdentityissue:
        customerDetailsList?.customerDetails?.doc_auth_local_identity_issue !==
        null
          ? customerDetailsList?.customerDetails?.doc_auth_local_identity_issue
          : '-',
      headquarters_address:
        customerDetailsList?.headqrtr_address !== null
          ? customerDetailsList?.headqrtr_address
          : '-',
      headquarters_province:
        customerDetailsList?.headquarterProvinceData !== null
          ? customerDetailsList?.headquarterProvinceData?.name
          : '-',
      headquarters_state:
        customerDetailsList?.headquarterCountryData !== null
          ? customerDetailsList?.headquarterCountryData?.name
          : '-',
      headquarters_city:
        customerDetailsList?.muncipality_foreign_headquarters !== null
          ? customerDetailsList?.muncipality_foreign_headquarters
          : '-',
    });
  }

  pressFolderDetails() {
    Actions.CustomerFolderDetails({
      customerDetailID: this.props.customerProfileDetail,
    });
  }

  render() {
    let {
      customerFirstName,
      customerLastName,
      customerAddress,
      customerCountryAddress,
      CompanyName,
      vatNumbers,
      fiscal_Code,
      performed_Activity,
      ateco_Code,
      residenceAddress,
      city,
      state,
      dataLogging,
      postcode_Residence,
      relation_Enddate,
      dateOfBirth,
      Provience,
      cityResidence,
      countryResidence,
      residence_ProvinceData,
      CAPCode,
      identification_Type,
      docIdentityDate,
      docIdentityRealeseDate,
      docExpiryDate,
      docType,
      docIdentityNumber,
      docIdentityissue,
      isLoading,
      customerDetailsList,
      headquarters_address,
      headquarters_province,
      headquarters_state,
      headquarters_city,
      gender,
      status,
      // customerVerificationType,
      // customerSpecificRiskType,
    } = this.state;
    console.log('customerDetailsList***', this.state.customerDetailsList);
    console.log(
      'customerFirstName>>',
      typeof customerDetailsList?.registration_date,
    );
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
              headerTxtMain={strings.viewCustomer}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.viewCustomer}
            />
          )}>
          <SafeAreaView>
            <View
              style={{
                marginTop: moderateScale(15),
                marginHorizontal: moderateScale(15),
              }}>
              <View style={styles.firstBoxMainView}>
                <View style={styles.firstRowView}>
                  <Image
                    source={images.customerStatus}
                    style={styles.customerStatusImg}
                  />
                  <Text numberOfLines={1} style={styles.customerName}>
                    {customerFirstName + ' ' + customerLastName}
                  </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Image
                    source={images.locationPIN}
                    style={styles.locationPIN}
                  />
                  <Text style={styles.customerAdd}>
                    {customerAddress + ' ' + customerCountryAddress}
                  </Text>
                </View>
              </View>
              {/* <View style={styles.secondBoxMainView}>
                <Text style={styles.substituteTypeTxt}>
                  {strings.specificRisk + ' : '}
                  <Text style={styles.substitteVal}>
                    {customerSpecificRiskType}
                  </Text>
                </Text>

                <Text style={styles.substituteTypeTxt2}>
                  {strings.typeVerification + ' : '}
                  <Text style={styles.substitteVal}>
                    {customerVerificationType === 1
                      ? strings.verificationTypeFirst
                      : customerVerificationType === 2
                      ? strings.verificationTypeSecond
                      : strings.verificationTypeThird}
                  </Text>
                </Text>
              </View> */}

              <View style={styles.secondBoxMainView}>
                <Text style={styles.mainBoxHeading}>Main data</Text>
                <View
                  style={{flexDirection: 'row', marginTop: moderateScale(5)}}>
                  <View style={{flexDirection: 'column', width: '50%'}}>
                    <Text style={styles.substituteTypeTxt}>
                      Company Name :
                      <Text style={styles.substitteVal}>
                        {' ' + CompanyName}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      VAT Number :
                      <Text style={styles.substitteVal}>
                        {' ' + vatNumbers}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Fiscal Code :
                      <Text style={styles.substitteVal}>
                        {' ' + fiscal_Code}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Performed activity :
                      <Text style={styles.substitteVal}>
                        {' ' + performed_Activity}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Ateco Code :
                      <Text style={styles.substitteVal}>
                        {' ' + ateco_Code}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      City :
                      <Text style={styles.substitteVal}>{' ' + city}</Text>
                    </Text>
                    {['1', 1].includes(customerDetailsList?.subject_type) && (
                      <Text style={styles.substituteTypeTxt}>
                        State :
                        <Text style={styles.substitteVal}>{' ' + state}</Text>
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: 'column',
                      width: '50%',
                      height: '100%',
                    }}>
                    <Text style={styles.substituteTypeTxt}>
                      Status :
                      <Text style={styles.substitteVal}>{' ' + status}</Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Gender :
                      <Text style={styles.substitteVal}>{' ' + gender}</Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Data Logging :
                      <Text style={styles.substitteVal}>
                        {' ' + dataLogging}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      End date of the relationship :
                      <Text style={styles.substitteVal}>
                        {' ' + relation_Enddate}
                      </Text>
                    </Text>
                    {['1', 1].includes(customerDetailsList?.subject_type) && (
                      <>
                        <Text style={styles.substituteTypeTxt}>
                          Date of birth :
                          <Text style={styles.substitteVal}>
                            {' ' + dateOfBirth}
                          </Text>
                        </Text>
                        <Text style={styles.substituteTypeTxt}>
                          Provience :
                          <Text style={styles.substitteVal}>
                            {' ' + Provience}
                          </Text>
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* <Text style={styles.substituteTypeTxt2}>
                  {strings.typeVerification + ' : '}
                  <Text style={styles.substitteVal}>
                    {customerVerificationType === 1
                      ? strings.verificationTypeFirst
                      : customerVerificationType === 2
                      ? strings.verificationTypeSecond
                      : strings.verificationTypeThird}
                  </Text>
                </Text> */}
              </View>
              {['1', 1].includes(customerDetailsList?.subject_type) ? (
                <View style={styles.secondBoxMainView}>
                  <Text style={styles.mainBoxHeading}>Residence</Text>
                  <View
                    style={{flexDirection: 'row', marginTop: moderateScale(5)}}>
                    <View style={{flexDirection: 'column', width: '50%'}}>
                      <Text style={styles.substituteTypeTxt}>
                        Residence address :
                        <Text style={styles.substitteVal}>
                          {' ' + residenceAddress}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        City of residence :
                        <Text style={styles.substitteVal}>
                          {' ' + cityResidence}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Country of Residence :
                        <Text style={styles.substitteVal}>
                          {' ' + countryResidence}
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'column',
                        width: '50%',
                        height: '100%',
                      }}>
                      <Text style={styles.substituteTypeTxt}>
                        Province of residence :
                        <Text style={styles.substitteVal}>
                          {' ' + residence_ProvinceData}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Address 1 :
                        <Text style={styles.substitteVal}>
                          {' ' + residenceAddress}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        POSTAL CODE :
                        <Text style={styles.substitteVal}>
                          {' ' + postcode_Residence}
                        </Text>
                      </Text>
                      {/* <Text style={styles.substituteTypeTxt}>
                        CAP :
                        <Text style={styles.substitteVal}>{' ' + CAPCode}</Text>
                      </Text> */}
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.secondBoxMainView}>
                  <Text style={styles.mainBoxHeading}>Site</Text>
                  <View
                    style={{flexDirection: 'row', marginTop: moderateScale(5)}}>
                    <View style={{flexDirection: 'column', width: '50%'}}>
                      <Text style={styles.substituteTypeTxt}>
                        Headquarters address :
                        <Text style={styles.substitteVal}>
                          {' ' + headquarters_address}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Headquarters Province :
                        <Text style={styles.substitteVal}>
                          {' ' + headquarters_province}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Headquarters State :
                        <Text style={styles.substitteVal}>
                          {' ' + headquarters_state}
                        </Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'column',
                        width: '50%',
                        height: '100%',
                      }}>
                      <Text style={styles.substituteTypeTxt}>
                        Headquarters City :
                        <Text style={styles.substitteVal}>
                          {' ' + headquarters_city}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Postal Code Location :
                        <Text style={styles.substitteVal}>{' ' + CAPCode}</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.secondBoxMainView}>
                <Text style={styles.mainBoxHeading}>Identification</Text>
                <View
                  style={{flexDirection: 'row', marginTop: moderateScale(5)}}>
                  <View style={{flexDirection: 'column', width: '50%'}}>
                    <Text style={styles.substituteTypeTxt}>
                      Type of identification :
                      <Text style={styles.substitteVal}>
                        {' ' + identification_Type}
                      </Text>
                    </Text>
                    <Text style={styles.substituteTypeTxt}>
                      Identification date :
                      <Text style={styles.substitteVal}>
                        {/* {' ' + docIdentityDate} */}
                        {' ' + docIdentityRealeseDate}
                      </Text>
                    </Text>
                    {['1', 1].includes(customerDetailsList?.subject_type) && (
                      <>
                        <Text style={styles.substituteTypeTxt}>
                          Document release date :
                          <Text style={styles.substitteVal}>
                            {' ' + docIdentityRealeseDate}
                          </Text>
                        </Text>
                        <Text style={styles.substituteTypeTxt}>
                          Document expiration date :
                          <Text style={styles.substitteVal}>
                            {' ' + docExpiryDate}
                          </Text>
                        </Text>
                      </>
                    )}
                  </View>
                  {['1', 1].includes(customerDetailsList?.subject_type) && (
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '50%',
                        height: '100%',
                      }}>
                      <Text style={styles.substituteTypeTxt}>
                        Type of document :
                        <Text style={styles.substitteVal}>{' ' + docType}</Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Document number :
                        <Text style={styles.substitteVal}>
                          {' ' + docIdentityNumber}
                        </Text>
                      </Text>
                      <Text style={styles.substituteTypeTxt}>
                        Authority and place of issue :
                        <Text style={styles.substitteVal}>
                          {' ' + docIdentityissue}
                        </Text>
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* <View style={styles.thirdBoxView}>
                <Text style={[styles.businessSectiorHead, {marginTop: 0}]}>
                  {strings.businesSector}
                </Text>
                <Text numberOfLines={1} style={styles.businessSectorVal}>
                  Produzione di viti e pai
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '50%'}}>
                    <Text style={styles.businessSectiorHead}>
                      {strings.beneficialOWner}
                    </Text>
                    <Text numberOfLines={1} style={styles.businessSectorVal}>
                      Produzione di viti e pai
                    </Text>
                    <Text style={styles.businessSectiorHead}>
                      {strings.subjectType}
                    </Text>
                    <Text numberOfLines={1} style={styles.businessSectorVal}>
                      Produzione di viti e pai
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={styles.businessSectiorHead}>
                      {strings.legalRepresentative}
                    </Text>
                    <Text numberOfLines={1} style={styles.businessSectorVal}>
                      Produzione di viti e pai
                    </Text>
                  </View>
                </View>
              </View> */}
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        <AbsoluteBtn
          btnTxt={strings.folderDetails}
          onPressBtn={() => this.pressFolderDetails()}
          marginRight={0}
        />
        {isLoading && <Loader />}
      </View>
    );
  }
}

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
    height: 'auto',
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
    marginTop: moderateScale(16),
  },
  customerStatusImg: {
    height: height * 0.05,
    width: height * 0.05,
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
    marginTop: moderateScale(3),
  },
  customerName: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    marginLeft: moderateScale(20),
  },
  locationPIN: {
    height: moderateScale(15),
    width: moderateScale(15),
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
    marginTop: moderateScale(3),
  },
  customerAdd: {
    fontSize: moderateScale(12),
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(5),
    flex: 1,
  },
  firstRowView: {
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainBoxHeading: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: moderateScale(15),
    marginLeft: moderateScale(12),
    marginTop: moderateScale(5),
    fontWeight: '400',
  },
  substituteTypeTxt: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    marginLeft: moderateScale(12),
    fontWeight: '400',
    marginBottom: moderateScale(10),
  },
  substituteTypeTxt2: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    marginLeft: moderateScale(15),
    fontWeight: '400',
  },
  substitteVal: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    fontWeight: '400',
    flex: 1,
  },
  businessSectiorHead: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(10),
    marginTop: moderateScale(15),
  },
  businessSectorVal: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    flex: 1,
  },
});

const mapStateToProps = state => {
  console.log('state****', state);
  return {
    isloading: state.customerReducer.isLoading,
    msgError: state.customerReducer.msgError, //accessing the redux state
    customerDetails: state.customerReducer.customerDetail,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCustomer);
