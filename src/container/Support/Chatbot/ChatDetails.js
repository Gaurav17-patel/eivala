import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  NativeModules,
  findNodeHandle,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Keyboard,
} from "react-native";
import { debounce } from "lodash";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import { Popover } from "react-native-modal-popover";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Menu, { MenuItem } from "react-native-material-menu";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../../themes";
import { moderateScale } from "../../../utils/ResponsiveUi";
import strings from "../../../themes/strings";
import InitialHeader from "../../../components/InitialHeader";
import ParallaxHeader from "../../../components/ParallaxHeader";
import MessageBubble from "../../../components/MessageBubble";
import { FunctionUtils, ConstantUtils, NetworkUtils } from '../../../utils';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import SocketIOClient from 'socket.io-client';
import { PreferenceKey, PreferenceManager } from '../../../utils';

let isIpad = DeviceInfo.getModel();

class ChatDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      isOpen: false,
      receiverId: '',
      receiverProfilePic: '',
      keyboardOffset: 0,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      uniqueId: "",
      userFName: "",
      userLName: "",
      fbData: [
        // {
        //   userID: "efgh1234",
        //   text: "Thank you for that.",
        //   uID: "a002",
        //   userName: "Sophia",
        //   chatDate: "2021-6-15 16:6:34",
        // },
      ],
      getChatText: "",
      currentIndex: 0,
      filterOptions: [
        {
          id: 1,
          name: strings.allReasons,
        },
        {
          id: 2,
          name: strings.notverySignificant,
        },
        {
          id: 3,
          name: strings.aenanOption,
        },
        {
          id: 4,
          name: strings.loremisum,
        },
        {
          id: 5,
          name: strings.inMAxNisi,
        },
        {
          id: 6,
          name: strings.loremisum,
        },
      ],
      showPopover: false,
      customerList: [
        {
          id: 1,
          substituteType: "Society",
          businessName: "Donica Mont",
        },
        {
          id: 2,
          substituteType: "Societyyy",
          businessName: "Arvila",
        },
        {
          id: 3,
          substituteType: "xyz",
          businessName: "Donica Mont",
        },
      ],
    };
  }

  componentDidMount() {
    this.addCustomerBtnClick = debounce(
      this.addCustomerBtnClick.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      }
    );
    this.shareBtnClick = debounce(this.shareBtnClick.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this)
    );
    this.receiverIDSetting();
    setTimeout(() => {
      this.previousLoadConverstions();
      this.connectWebSocketWatch();
      this.getSenderId();
    }, 100);
  }

  async getSenderId() {
    let value = await PreferenceManager.getPreferenceValue(
      PreferenceKey.USER_DATA
    );
    this.setState({ uniqueId: value });
  }

  /* Socket connection */
  connectWebSocketWatch = () => {
    console.log('----this.receiverId', this.state.receiverId);
    this.socket = SocketIOClient('alavie.project-demo-server.com:8005', {
      forceNew: true,
      jsonp: false,
    });
    console.log(
      '----this.socket',
      this.socket.on('user_connected' + this.state.receiverId)
    );
    this.socket.on('user_connected' + this.state.receiverId, (data) => {
      console.log('----userMessageData', data);
      // var userMessageData = JSON.parse(data);
      // var chatDataArray = [...this.state.userChatList];
      // let message = [userMessageData];
      // let newChatArray = message.concat(chatDataArray);
      // this.setState({
      //   userChatList: newChatArray,
      //   chatMessage: '',
      // });
    });
  };

  previousLoadConverstions() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append('receiver', this.state.receiverId);
      this.props.loadUsersPreviousMessages(formData).then(async () => {
        const { previousChatResData, msgError } = this.props;
        console.log('--------previousChatResData', previousChatResData);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          previousChatResData &&
          previousChatResData.data.messages &&
          previousChatResData.data.messages.length > 0
        ) {
          this.setState({
            fbData: previousChatResData.data.messages,
            isLoading: false,
            // next_page_url: chatListResData.customer_data.links.next,
          });
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
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

  receiverIDSetting() {
    if (
      this.props.chatDetailsData &&
      this.props.chatDetailsData.receiver != ""
    ) {
      this.setState({
        receiverProfilePic: this.props.chatDetailsData.profile_img_url,
        receiverId: this.props.chatDetailsData.receiver,
        userFullName:
          this.props.chatDetailsData.first_name +
          this.props.chatDetailsData.last_name,
      });
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(event) {
    this.setState({
      keyboardOffset: event.endCoordinates.height,
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyboardOffset: 0,
    });
  }

  onbtnMoreClick = (index) => {
    let self = this;
    setTimeout(function () {
      self.showPostListView(index);
    }, 10);
  };

  showPostListView = (idex) => {
    this.postmenu.show();
  };

  hidePostMenuListView(position) {
    this.postmenu.hide();
    let self = this;
    if (position == 0) {
      this.setState({ sowType: strings.definitive });
    } else if (position == 1) {
      this.setState({ sowType: strings.temporary });
    } else {
      this.setState({ sowType: strings.canceled });
    }
  }

  addCustomerBtnClick() {}
  shareBtnClick() {}

  _renderFilterOptions(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() => this.setState({ currentIndex: index })}
        >
          <Image
            source={
              index == this.state.currentIndex
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

  openPopover() {
    this.setFilterOptionsView();
    this.setState({ showPopover: true });
  }

  closePopover = () => this.setState({ showPopover: false });

  renderMenuOptionss() {
    const { customerList, sowType } = this.state;
    return (
      <Menu
        style={{ marginTop: moderateScale(10) }}
        ref={(ref) => (this.postmenu = ref)}
      >
        <MenuItem
          textStyle={[
            styles.menuItemTxtSyle,
            {
              fontWeight: sowType == strings.definitive ? "bold" : "normal",
            },
          ]}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(0)}
        >
          {strings.definitive}
        </MenuItem>
        <MenuItem
          textStyle={[
            styles.menuItemTxtSyle,
            {
              fontWeight: sowType == strings.temporary ? "bold" : "normal",
            },
          ]}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(1)}
        >
          {strings.temporary}
        </MenuItem>
        <MenuItem
          textStyle={[
            styles.menuItemTxtSyle,
            {
              fontWeight: sowType == strings.canceled ? "bold" : "normal",
            },
          ]}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(2)}
        >
          {strings.canceled}
        </MenuItem>
      </Menu>
    );
  }

  setFilterOptionsView = (e) => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } });
      });
    }
  };

  _sendMsg = async () => {
    if (this.state.getChatText === "") {
      return Alert.alert(
        "",
        "Please enter a message!",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      this.sendUserMessages();
    }
    const tempDate = new Date();
    let curDate = `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()} ${tempDate.getHours()}:${tempDate.getMinutes()}:${tempDate.getSeconds()}`;
    const sender = this.state.uniqueId;
    const message = this.state.getChatText + "";
    const userName = "Me";
    const created_at = curDate;
    const chatData = {
      sender,
      message,
      userName,
      created_at,
    };
    this.setState({
      fbData: this.state.fbData.concat(chatData),
      getChatText: "",
    });
  };

  sendUserMessages() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    let { receiverId, getChatText } = this.state;
    if (isConnected) {
      const formData = new FormData();
      formData.append('message', getChatText);
      formData.append('receiver', receiverId);
      this.props.sendUserMessages(formData).then(async () => {
        const { sendMessageResData, msgError, error } = this.props;
        console.log('---sendMessageResData', sendMessageResData);
        // let value = FunctionUtils.unauthMsgHandling(msgError);
        // let errorData;
        // {
        //   error ? (errorData = JSON.parse(error)) : null;
        // }
        // if (addNewCustomer != null) {
        //   FunctionUtils.showToast(addNewCustomer.message);
        //   Actions.pop();
        //   this.setState({ isLoading: false });
        // } else if (errorData && errorData.date_identification) {
        //   this.setState({ isLoading: false });
        //   FunctionUtils.showToast(errorData.date_identification[0]);
        // } else if (errorData && errorData.doc_file) {
        //   this.setState({ isLoading: false });
        //   FunctionUtils.showToast(errorData.doc_file[0]);
        // } else if (value && value == 'Unauthenticated.') {
        //   this.setState({ isLoading: false });
        //   FunctionUtils.clearLogin();
        // } else if (value && value !== 'Unauthenticated.') {
        //   this.setState({ isLoading: false });
        //   FunctionUtils.showToast(value);
        // } else {
        //   this.setState({ isLoading: false });
        //   FunctionUtils.showToast(addNewCustomer.message);
        // }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  chatDateFormate(item) {
    let date = FunctionUtils.chatDateTimeSeparate(item);
    return date;
  }

  render() {
    const {
      filterOptions,
      uniqueId,
      userFullName,
      receiverProfilePic,
      fbData,
    } = this.state;
    const Layout = {
      window: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      },
      fsS: 14,
      fsXXS: 10,
    };
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
              headerTxtMain={userFullName}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={userFullName}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <View style={styles.frstRowMainView}>
                {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.showTxt}>{strings.show + ":"}</Text>
                  {this.renderMenuOptionss()}
                  <TouchableOpacity
                    hitSlop={ConstantUtils.hitSlop.twenty}
                    onPress={() => this.onbtnMoreClick()}
                    style={styles.dropdownMainView}
                  >
                    <Text style={styles.dropDownVal}>{this.state.sowType}</Text>

                    <Image
                      source={images.dropDownArr}
                      style={styles.dropDownArrImg}
                    />
                  </TouchableOpacity>
                </View> */}

                {/* <TouchableOpacity
                  hitSlop={ConstantUtils.hitSlop.twenty}
                  ref={(r) => {
                    this.refFilterOptionView = r;
                  }}
                  onLayout={this.setFilterOptionsView}
                  onPress={() => this.openPopover()}
                >
                  <Image source={images.filter} style={styles.filterImg} />
                </TouchableOpacity> */}
                <Popover
                  visible={this.state.showPopover}
                  fromRect={this.state.popoverAnchor}
                  //contentStyle={{borderWidth: 0.5,borderColor: colors.blackShade}}
                  onClose={this.closePopover}
                  supportedOrientations={["portrait", "landscape"]}
                  placement="bottom"
                >
                  <View style={styles.filterModalView}>
                    <Text style={styles.filerHeading}>
                      {strings.filterBySpecificReasons}
                    </Text>
                    <FlatList
                      data={filterOptions}
                      renderItem={({ item, index }) =>
                        this._renderFilterOptions(item, index)
                      }
                      //style={{ flex: 1, marginBottom: moderateScale(10) }}
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </Popover>
              </View>
              <KeyboardAvoidingView behavior="padding" enabled>
                <View style={{ marginTop: moderateScale(15) }}>
                  <FlatList
                    ref={(ref) => {
                      this.chatFlatList = ref;
                    }}
                    onContentSizeChange={() => this.chatFlatList.scrollToEnd()}
                    data={fbData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(fbDataItem) => (
                      <MessageBubble
                        mine={
                          uniqueId === fbDataItem.item.sender ? false : true
                        }
                        text={fbDataItem.item.message}
                        userName={
                          uniqueId === fbDataItem.item.sender
                            ? 'ND'
                            : receiverProfilePic
                        }
                        date={this.chatDateFormate(fbDataItem.item.created_at)}
                      />
                    )}
                  />
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        <View
          style={{
            flexDirection: "row",
            width: "90%",
            height: 55,
            backgroundColor: colors.white,
            borderRadius: moderateScale(15),
            margin: moderateScale(15),
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            bottom: this.state.keyboardOffset,
            shadowColor: colors.gray,
            shadowOffset: {
              width: 0,
              height: moderateScale(1),
            },
            shadowOpacity: moderateScale(0.25),
            shadowRadius: moderateScale(4),
            elevation: moderateScale(5),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this._sendMsg();
            }}
          >
            <Image
              source={images.attachment}
              style={{
                height: moderateScale(17),
                width: moderateScale(17),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              width: "75%",
              height: 55,
              paddingBottom: 0,
              paddingTop: 0,
              marginTop: 0,
              marginBottom: 0,
              textAlignVertical: "center",
              marginLeft: 5,
            }}
            onChangeText={(getChatText) => this.setState({ getChatText })}
            value={this.state.getChatText}
            placeholder={"Type your message here..."}
          />

          <TouchableOpacity
            onPress={() => {
              this._sendMsg();
            }}
          >
            <Image
              source={images.sendChat}
              style={{
                height: moderateScale(30),
                width: moderateScale(30),
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    sendMessageResData: state.chatReducer.sendMessageResData, //accessing the redux state
    previousChatResData: state.chatReducer.previousChatResData, //accessing the redux state
    isloading: state.chatReducer.isLoading,
    msgError: state.chatReducer.msgError, //accessing the redux state
    error: state.chatReducer.error, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatDetails);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
  frstRowMainView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(10),
    alignItems: "center",
  },
  showTxt: {
    color: colors.colorGray,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    fontWeight: "500",
  },
  dropdownMainView: {
    height: moderateScale(25),
    // width: height * 0.1,
    paddingHorizontal: 5,
    borderWidth: 0.7,
    borderColor: colors.borderLineBox,
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  dropDownArrImg: {
    height: moderateScale(10),
    width: moderateScale(10),
    resizeMode: "contain",
    marginLeft: moderateScale(15),
  },
  dropDownVal: {
    color: colors.textDropDownVal,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    fontWeight: "500",
  },
  filterImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: "contain",
  },
  mainBoxView: {
    width: "100%",
    height: moderateScale(80),
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  customerStatusImg: {
    height: height * 0.05,
    width: height * 0.05,
    resizeMode: "contain",
    marginTop: moderateScale(2),
  },
  sideDropDownArrImg: {
    height: moderateScale(22),
    width: moderateScale(22),
    resizeMode: "contain",
  },
  businessNameHeading: {
    fontSize: moderateScale(10),
    fontFamily: fonts.PoppinsRegular,
    color: colors.grayNameHeading,
  },
  businessNameVal: {
    fontSize: moderateScale(13),
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    marginTop: 3,
  },
  menuItemStyle: {
    backgroundColor: colors.white,
    marginVertical: isIpad.indexOf("iPad") != -1 ? 0 : -7,
  },
  menuItemTxtSyle: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    fontSize: moderateScale(12),
  },
  renderItemMainView: {
    height: "65%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  rowMainView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  statusImgView: {
    flex: 1,
    width: "20%",
    justifyContent: "center",
  },
  endView: {
    flex: 1,
    alignSelf: "flex-end",
  },
  filterSelectionImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: "contain",
  },
  filterOptionName: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    fontSize: moderateScale(12),
    marginLeft: moderateScale(6),
  },
  filterModalView: {
    height: height * 0.22,
    marginLeft: moderateScale(3),
  },
  filterOptionRenderMainView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(6),
    width: width * 0.75,
  },
  filerHeading: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.colorBlack,
    fontSize: moderateScale(12),
    marginBottom: moderateScale(6),
    fontWeight: "500",
  },
});
