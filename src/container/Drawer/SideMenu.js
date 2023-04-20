import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {debounce} from 'lodash';
import {moderateScale} from '../../utils/ResponsiveUi';
import {images, fonts, colors, string} from '../../themes';
import strings from '../../themes/strings';
import {Actions, ActionConst} from 'react-native-router-flux';
const {width, height} = Dimensions.get('window');
import {FunctionUtils, NetworkUtils} from '../../utils';
import * as globals from '../../utils/globals';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from '../../redux/actions';
import {PreferenceKey, PreferenceManager} from '../../utils';

class side_menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openOperationsMenu: false,
      openSupportMenu: false,
      fname: '',
      lname: '',
      email: '',
      contactNum: '',
      profileImage: '',
      clientDynmicLogo: '',
    };
  }

  async componentDidMount() {
    this.menuItemClick = debounce(this.menuItemClick.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.getUniqueId();
    this.getMyProfileData();
  }

  async getUniqueId() {
    let clientLogoImage = await PreferenceManager.getPreferenceValue(
      PreferenceKey.CLIENTLOGO,
    );
    this.setState({clientDynmicLogo: clientLogoImage});
  }

  async getMyProfileData() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getMyProfile(globals.tokenValue).then(async response => {
        const {myProfileData, msgError} = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (myProfileData && myProfileData.hasOwnProperty('data')) {
          if (myProfileData.data.status == 1) {
            this.setState({
              fname: myProfileData.data.first_name,
              lname: myProfileData.data.last_name,
              email: myProfileData.data.email,
              contactNum: myProfileData.data.phone,
              profileImage: myProfileData.data.profile_image_url,
            });
          } else if (value && value === 'Unauthenticated.') {
            FunctionUtils.clearLogin();
          }
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  clickOperationsTab() {
    this.setState({openOperationsMenu: !this.state.openOperationsMenu});
    if (this.state.openSupportMenu) {
      this.setState({openSupportMenu: false});
    }
  }

  clickSupportView() {
    this.setState({openSupportMenu: !this.state.openSupportMenu});
    if (this.state.openOperationsMenu) {
      this.setState({openOperationsMenu: false});
    }
  }

  async logout() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.userLogout(globals.tokenValue).then(async response => {
        const {userLogoutData, msgError, error} = this.props;
        let errorData, value;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        {
          msgError ? (value = msgError.error.replace(/\"/g, '')) : null;
        }

        if (userLogoutData != null) {
          FunctionUtils.clearLogin();
          FunctionUtils.showToast(userLogoutData.message);
        } else if (value && value == 'Unauthenticated.') {
          FunctionUtils.clearLogin();
        } else {
          FunctionUtils.showToast(userLogoutData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  menuItemClick(id) {
    if (id === 1) {
      if (Actions.currentScene === '_MyProfile') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.MyProfile();
      }
    } else if (id === 2) {
      if (Actions.currentScene === '_Dashboard') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.Dashboard();
      }
    } else if (id === 3) {
      if (Actions.currentScene === '_CustomerList') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.CustomerList();
      }
    } else if (id === 4) {
      if (Actions.currentScene === '_CustomerFolder') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.CustomerFolder();
      }
    } else if (id === 5) {
      if (Actions.currentScene === '_TicketList') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.TicketList();
      }
    } else if (id === 6) {
      if (Actions.currentScene === '_ChatList') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.ChatList();
      }
    } else if (id === 7) {
      if (Actions.currentScene === '_Risk') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.Risk();
      }
    } else if (id === 8) {
      if (Actions.currentScene === '_Notifications') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.Notifications();
      }
    } else if (id === 9) {
      this.logoutConfirmation();
    } else if (id === 10) {
      if (Actions.currentScene === '_Identification') {
        Actions.refresh({key: Math.random()});
      } else {
        Actions.AddCustomer();
      }
    }
    Actions.drawerClose();
  }

  logoutConfirmation() {
    // Actions.Login()
    Alert.alert(
      strings.AppName,
      strings.logoutConfirmMsg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.logout()},
      ],
      {cancelable: false},
    );
  }

  //Design:- render design here..
  render() {
    const {
      openOperationsMenu,
      fname,
      lname,
      email,
      openSupportMenu,
      profileImage,
      clientDynmicLogo,
    } = this.state;
    return (
      <View
        style={{
          flex: 1,
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          backgroundColor: 'white',
          shadowOffset: {width: 2, height: 0},
          shadowOpacity: 0.5,
          shadowRadius: 3,
          elevation: 5,
          shadowColor: colors.colorBlack,
        }}>
        {/* <SafeAreaView forceInset={{ bottom: 'always' }} > */}
        <View>
          <ScrollView
            style={styles.mainSideView}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={{flex: 1}}>
              <View style={styles.imgRowView}>
                <TouchableOpacity onPress={() => this.menuItemClick(1)}>
                  <View style={styles.logoImgView}>
                    <Image
                      source={{uri: profileImage}}
                      style={styles.userImg}
                    />
                  </View>
                </TouchableOpacity>
                {/* <View style={styles.logoView}>
                  <Image
                    source={{uri: clientDynmicLogo}}
                    style={styles.logoImg}
                  />
                </View> */}
              </View>
              <Text numberOfLines={1} style={styles.userName}>
                {fname}
                {lname}
              </Text>
              <Text numberOfLines={1} style={styles.userEmail}>
                {email}
              </Text>
              <View style={styles.sideOptionsMainView}>
                <View style={styles.optionsInnerMainView}>
                  <TouchableOpacity
                    style={[styles.optionsRowView]}
                    onPress={() => this.menuItemClick(2)}>
                    <Image source={images.dashboard} style={styles.menuImges} />
                    <Text style={styles.sideOptionsTxt}>
                      {strings.dashboard}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity
                    style={[styles.optionsRowView]}
                    onPress={() => this.menuItemClick(10)}>
                    <Image source={images.dashboard} style={styles.menuImges} />
                    <Text style={styles.sideOptionsTxt}>
                      {strings.identification}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity
                    onPress={() => this.clickOperationsTab()}
                    style={styles.optionsRowView}>
                    <Image
                      source={images.operations}
                      style={styles.menuImges}
                    />
                    <Text style={styles.sideOptionsTxt}>
                      {strings.aml + ' - ' + strings.operations}{' '}
                    </Text>
                    {!openOperationsMenu ? (
                      <Image source={images.downArr} style={styles.upDownArr} />
                    ) : (
                      <Image source={images.upArr} style={styles.upDownArr} />
                    )}
                  </TouchableOpacity>
                  {openOperationsMenu ? (
                    <View>
                      <TouchableOpacity onPress={() => this.menuItemClick(3)}>
                        <Text style={styles.innerOptionTxt}>
                          {strings.customers}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => this.menuItemClick(4)}>
                        <Text
                          style={[
                            styles.innerOptionTxt,
                            {paddingBottom: height * 0.025},
                          ]}>
                          {strings.customersFolder}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity
                    style={[styles.optionsRowView]}
                    onPress={() => this.clickSupportView()}>
                    <Image source={images.support} style={styles.menuImges} />
                    <Text style={styles.sideOptionsTxt}>{strings.support}</Text>
                    {!openSupportMenu ? (
                      <Image source={images.downArr} style={styles.upDownArr} />
                    ) : (
                      <Image source={images.upArr} style={styles.upDownArr} />
                    )}
                  </TouchableOpacity>
                  {openSupportMenu ? (
                    <View>
                      <TouchableOpacity onPress={() => this.menuItemClick(5)}>
                        <Text style={styles.innerOptionTxt}>
                          {strings.ticketsReq}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.menuItemClick(6)}>
                        <Text
                          style={[
                            styles.innerOptionTxt,
                            {paddingBottom: height * 0.025},
                          ]}>
                          {strings.chatBot}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity onPress={() => this.menuItemClick(7)}>
                    <View style={styles.optionsRowView}>
                      <Image source={images.risk} style={styles.menuImges} />
                      <Text style={styles.sideOptionsTxt}>{strings.risk}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity onPress={() => this.menuItemClick(8)}>
                    <View style={styles.optionsRowView}>
                      <Image
                        source={images.notifications}
                        style={styles.menuImges}
                      />
                      <Text style={styles.sideOptionsTxt}>
                        {strings.notifications}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.horizontalLine} />
                  <TouchableOpacity
                    style={[
                      styles.optionsRowView,
                      {borderWidth: 0, top: moderateScale(-20)},
                    ]}
                    onPress={() => this.menuItemClick(9)}>
                    <View style={styles.optionsRowView}>
                      <Image source={images.logout} style={styles.menuImges} />
                      <Text style={styles.sideOptionsTxt}>
                        {strings.logout}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.bottomView}>
              <View style={styles.langSelectHorizontalView}>
                <Text style={styles.langColorTxt}>{strings.english}</Text>
                {/* <Image
                  source={images.languageSelArr}
                  style={styles.selLangMenu}
                /> */}
              </View>
              <View style={styles.termsPrivacyView}>
                <Text style={styles.termsPrivacyLine}>
                  {strings.privacyPolicy}
                </Text>
                <Image
                  source={images.ellipse}
                  style={styles.privacyTermsRound}
                />
                <Text style={styles.termsPrivacyLine}>
                  {strings.termsConditions}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = state => {
  return {
    myProfileData: state.profileReducer.myProfileData, //accessing the redux state
    userLogoutData: state.profileReducer.userLogoutData, //accessing the redux state
    error: state.profileReducer.error, //accessing the redux state
    msgError: state.profileReducer.msgError, //accessing the redux state
    isloading: state.profileReducer.isLoading,
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(side_menu);

const styles = StyleSheet.create({
  mainSideView: {
    marginHorizontal: moderateScale(15),
    // marginTop: moderateScale(5),
    height: '96%',
    backgroundColor: colors.white,
  },
  imgRowView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: height * 0.09,
  },
  logoImgView: {
    width: '33%',
  },
  userImg: {
    height: moderateScale(75),
    width: moderateScale(75),
    resizeMode: 'contain',
    borderRadius: moderateScale(37)
  },
  logoView: {
    marginTop: moderateScale(12),
    marginLeft: moderateScale(7),
  },
  logoImg: {
    height: moderateScale(40),
    width: moderateScale(80),
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontWeight: '500',
    // marginRight: moderateScale(10),
    alignSelf: 'center'
  },
  userEmail: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    color: colors.colorGray,
    // marginRight: moderateScale(10),
    alignSelf: 'center'
  },
  sideOptionsMainView: {
    //height: '70%',
  },
  optionsInnerMainView: {
    marginTop: height / 20,
  },
  optionsRowView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: height * 0.025,
    paddingVertical: height * 0.025,
  },
  menuImges: {
    height: moderateScale(20),
    width: moderateScale(18),
    resizeMode: 'contain',
  },
  horizontalLine: {
    height: 0.5,
    width: '60%',
    backgroundColor: colors.colorGray,
    // marginVertical: height * 0.025,
  },
  sideOptionsTxt: {
    color: colors.blackShade,
    fontSize: moderateScale(15),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(10),
  },
  upDownArr: {
    height: moderateScale(12),
    width: moderateScale(12),
    resizeMode: 'contain',
    marginLeft: moderateScale(7),
  },
  innerOptionTxt: {
    color: colors.menuTxtClr,
    fontSize: moderateScale(13),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginLeft: moderateScale(28),
    marginTop: moderateScale(9),
  },
  selLangMenu: {
    height: moderateScale(13),
    width: moderateScale(11),
    resizeMode: 'contain',
    marginLeft: 5,
    top: moderateScale(-3),
  },
  langColorTxt: {
    color: colors.colorGray,
    fontSize: moderateScale(12),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '600',
  },
  langSelectHorizontalView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    marginTop: height * 0.09,
    paddingBottom: moderateScale(20),
    borderBottomRightRadius: moderateScale(30),
  },
  termsPrivacyView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsPrivacyLine: {
    color: colors.blackShade,
    fontSize: moderateScale(13),
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    marginVertical: moderateScale(10),
  },
  privacyTermsRound: {
    height: moderateScale(10),
    width: moderateScale(9),
    resizeMode: 'contain',
    marginHorizontal: moderateScale(7),
  },
});
