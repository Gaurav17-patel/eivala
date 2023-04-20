import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeModules,
  findNodeHandle,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { debounce } from 'lodash';
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import { Popover } from 'react-native-modal-popover';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Menu, { MenuItem } from 'react-native-material-menu';
const { width, height } = Dimensions.get('window');
import { images, fonts, colors } from '../../../themes';
import { moderateScale } from '../../../utils/ResponsiveUi';
import strings from '../../../themes/strings';
import InitialHeader from '../../../components/InitialHeader';
import ParallaxHeader from '../../../components/ParallaxHeader';
import Button from '../../../components/Button.js';
import MessageBubble from '../../../components/MessageBubble';
import Loader from '../../../components/LoaderOpacity.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../../redux/actions';
import {
  FunctionUtils,
  PreferenceKey,
  PreferenceManager,
  ConstantUtils,
  NetworkUtils,
} from '../../../utils';
import DocumentPicker from 'react-native-document-picker';

let isIpad = DeviceInfo.getModel();

class TicketDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      keyboardOffset: 0,
      isIssueAttached: '',
      sowType: strings.definitive,
      isOpen: false,
      isLoading: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      fbData: [],
      getChatText: '',
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
      loggedinUserId: 0,
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
    {
      this.props.ticketData ? this.getTicketComment() : null;
    }
    this.getUserId();
  }

  async getUserId() {
    let userid = await PreferenceManager.getPreferenceValue(
      PreferenceKey.USER_ID
    );
    this.setState({ loggedinUserId: parseInt(userid, 10) });
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  getTicketComment() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    console.log("ticketData ===", this.props.ticketData);
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getTicketCommentList(this.props.ticketData.id)
        .then(async () => {
          console.log("getTicketComment response ===", this.props);
          const { getTicketComment, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (getTicketComment.data) {
            this.setState({
              isLoading: false,
              fbData: getTicketComment.data,
              isIssueAttached: getTicketComment.data[0].attachment_url,
            });
          } else if (value && value == "Unauthenticated.") {
            FunctionUtils.clearLogin();
          } else {
            this.setState({ isLoading: false });
            FunctionUtils.showToast(getTicketComment.message);
          }
        }).catch((err) => {
          this.setState({ isLoading: false });
          console.log("getTicketComment err ===", err);
        });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
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
    const { sowType } = this.state;
    return (
      <Menu
        style={{ marginTop: moderateScale(10) }}
        ref={(ref) => (this.postmenu = ref)}
      >
        <MenuItem
          textStyle={[
            styles.menuItemTxtSyle,
            {
              fontWeight: sowType == strings.definitive ? 'bold' : 'normal',
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
              fontWeight: sowType == strings.temporary ? 'bold' : 'normal',
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
              fontWeight: sowType == strings.canceled ? 'bold' : 'normal',
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
    if (this.state.getChatText === '') {
      return Alert.alert(
        '',
        'Please enter a message!',
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else {
      this.commentAddingAPICall('');
    }
    const tempDate = new Date();
    let curDate = `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()} ${tempDate.getHours()}:${tempDate.getMinutes()}:${tempDate.getSeconds()}`;
    const user_id = this.state.loggedinUserId;
    const comments = this.state.getChatText + "";
    const uID = "a001";
    const userName = "Me";
    const created_at = curDate;
    const chatData = {
      user_id,
      comments,
      uID,
      userName,
      created_at,
    };
    this.setState({
      fbData: this.state.fbData.concat(chatData),
      getChatText: "",
    });
  };

  closeUserTicket() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getCloseTicket(this.props.ticketData.id).then(async () => {
        const { closeTicket, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (closeTicket) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(closeTicket.message);
          Actions.pop();
        } else if (value && value == "Unauthenticated.") {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
          });
          FunctionUtils.showToast(closeTicket.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  reopenUserTicket() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getReopenTicket(this.props.ticketData.id).then(async () => {
        const { reopenTicket, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (reopenTicket) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(reopenTicket.message);
          Actions.pop();
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
          });
          FunctionUtils.showToast(reopenTicket.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  async addAttachment() {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      this.commentAddingAPICall(res.uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  commentAddingAPICall(documentType) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("ticket_id", this.props.ticketData.id);
      formData.append("comments", this.state.getChatText);
      formData.append("attachment", documentType);
      this.props.addCommentInTicket(formData).then(async () => {
        const { ticketCommentList, error, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (ticketCommentList && errorData == "" && msgError == "") {
          FunctionUtils.showToast(ticketCommentList.message);
          this.setState({ isLoading: false });
          Actions.pop();
        } else if (errorData && errorData.attachment) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.attachment[0]);
        } else if (errorData && errorData.comments) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.comments[0]);
        } else if (errorData && errorData.ticket_id) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.ticket_id[0]);
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(ticketCommentList.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  chatData(fbDataItem) {
    if (fbDataItem.item && fbDataItem.item.comments !== null) {
      return (
        <MessageBubble
          mine={
            fbDataItem.item &&
            fbDataItem.item.user_id === this.state.loggedinUserId
              ? false
              : true
          }
          text={fbDataItem.item.comments}
          userName={
            fbDataItem.item && fbDataItem.item.users
              ? fbDataItem.item.users.short_name
              : fbDataItem.item.userName
          }
          date={this.chatDateFormate(fbDataItem.item.created_at)}
          image={fbDataItem.item.attachment_url}
        />
      );
    }
  }

  supportTypeSet(support) {
    if (support == 1) {
      return strings.operationalQuery;
    } else if (support == 2) {
      return strings.contractQuery;
    } else if (support == 3) {
      return strings.transactionQuery;
    } else {
      return strings.notAble;
    }
  }

  timeFormatechange(item) {
    let date = FunctionUtils.dateSeparate(item);
    let time = FunctionUtils.timeSeparate(item);
    let finalData = date + ", " + time;
    return finalData;
  }

  chatDateFormate(item) {
    let date = FunctionUtils.chatDateSeparate(item);
    return date;
  }

  render() {
    const {
      isLoading,
      isIssueAttached,
      filterOptions,
      fbData,
      isOpen,
    } = this.state;
    const { ticketData } = this.props;
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
              headerTxtMain={strings.ticketsConversations}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.ticketsConversations}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <View style={styles.frstRowMainView}>
                <Popover
                  visible={this.state.showPopover}
                  fromRect={this.state.popoverAnchor}
                  onClose={this.closePopover}
                  supportedOrientations={['portrait', 'landscape']}
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
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </Popover>
              </View>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: isOpen ? moderateScale(220) : moderateScale(80),
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
                }}
                onPress={() => this.setState({ isOpen: !this.state.isOpen })}
              >
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      height: this.state.isOpen ? '20%' : '96%',
                      width: '96%',
                    }}
                  >
                    <View
                      style={{
                        height: '100%',
                        width: '15%',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        source={images.ticketOpen}
                        style={styles.customerStatusImg}
                      />
                    </View>
                    <View
                      style={{
                        height: '100%',
                        width: '75%',
                        justifyContent: 'center',
                      }}
                    >
                      <Text numberOfLines={2} style={styles.businessNameVal}>
                        {ticketData.ticket_subject}
                      </Text>
                      {!isOpen ? (
                        <Text
                          style={{
                            fontFamily: fonts.PoppinsRegular,
                            fontSize: moderateScale(11),
                            color: colors.colorGray,
                          }}
                        >
                          {this.timeFormatechange(ticketData.created_at)}
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: fonts.PoppinsRegular,
                            fontSize: moderateScale(11),
                            color: colors.colorGray,
                          }}
                        >
                          {this.supportTypeSet(ticketData.support_type)}
                          <Text
                            style={{
                              fontFamily: fonts.PoppinsRegular,
                              fontSize: moderateScale(11),
                              color: colors.colorGray,
                            }}
                          >
                            {' \u25CF'}
                          </Text>
                          <Text
                            style={{
                              fontFamily: fonts.PoppinsRegular,
                              fontSize: moderateScale(11),
                              color: colors.colorGray,
                            }}
                          >
                            {this.timeFormatechange(ticketData.created_at)}
                          </Text>
                        </Text>
                      )}
                      {/* </Text> */}
                    </View>
                    {!isOpen && (
                      <View
                        style={{
                          height: '100%',
                          width: '10%',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Image
                          source={images.crossArrowDown}
                          style={styles.sideDropDownArrImg}
                        />
                      </View>
                    )}
                  </View>

                  {isOpen && (
                    <View
                      style={{
                        width: '100%',
                        top: 10,
                      }}
                    >
                      <Image
                        source={images.line}
                        style={{
                          width: '100%',
                          height: moderateScale(1),
                          marginTop: moderateScale(10),
                          marginBottom: moderateScale(10),
                        }}
                      />
                      <View
                        style={{
                          height: '25%',
                          width: '100%',
                          flexDirection: 'row',
                          paddingLeft: moderateScale(10),
                        }}
                      >
                        <View
                          style={{
                            width: '60%',
                            height: '100%',
                            margin: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: "#3E4954",
                              fontSize: moderateScale(12),
                            }}
                          >
                            {'Submitted By'}
                          </Text>
                          <Text
                            style={{
                              color: "#3E4954",
                              lineHeight: moderateScale(20),
                              fontSize: moderateScale(15),
                            }}
                          >
                            {ticketData.users.short_name}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '40%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            right: moderateScale(20),
                          }}
                        >
                          <Button
                            buttonTitle={
                              ticketData.status == 1
                                ? strings.closeTicket
                                : strings.reopenTicket
                            }
                            onButtonPress={() =>
                              ticketData.status == 1
                                ? this.closeUserTicket()
                                : this.reopenUserTicket()
                            }
                            height={moderateScale(25)}
                            width={'70%'}
                            borderRadiusApply={5}
                            borderWidth={1}
                            backgroundColor={
                              ticketData.status == 1
                                ? colors.colorGray
                                : colors.lightPink
                            }
                            textStyle={{
                              color:
                                ticketData.status == 1
                                  ? "white"
                                  : colors.colorBlack,
                              fontFamily: fonts.PoppinsRegular,
                              fontSize: moderateScale(12),
                            }}
                          />
                        </View>
                      </View>
                      {isIssueAttached !== "" && isIssueAttached !== null ? (
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            paddingLeft: moderateScale(10),
                          }}
                        >
                          <Text
                            numberOfLines={5}
                            style={{
                              fontSize: moderateScale(12),
                              color: colors.colorGray,
                              margin: moderateScale(10),
                              lineHeight: moderateScale(20),
                            }}
                          >
                            {ticketData.details}
                          </Text>
                        </View>
                      ) : null}
                      <View
                        style={{
                          height: moderateScale(25),
                          width: '100%',
                          flexDirection: 'row',
                        }}
                      >
                        <View
                          style={{
                            width: '80%',
                            height: '100%',
                            justifyContent: 'center',
                          }}
                        >
                          <View style={{ marginLeft: 10, borderWidth: 0 }}>
                            {isIssueAttached !== "" &&
                            isIssueAttached !== "" ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  height: moderateScale(25),
                                  width: '60%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <View
                                  style={{
                                    width: '10%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                  }}
                                >
                                  <Image
                                    source={images.filleAttachment}
                                    style={{
                                      height: moderateScale(20),
                                      width: moderateScale(20),
                                      resizeMode: 'contain',
                                      marginLeft: moderateScale(15),
                                    }}
                                  />
                                </View>
                                <View
                                  style={{
                                    width: '90%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: colors.redColor,
                                      left: moderateScale(8),
                                    }}
                                  >
                                    {'File issue attached'}
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                          </View>
                        </View>
                        <View
                          style={{
                            width: '20%',
                            height: '100%',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}
                        >
                          <Image
                            source={images.downCrossReverseArr}
                            style={styles.sideDropDownArrImg}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <Image
                source={images.line}
                style={{
                  width: '100%',
                  height: moderateScale(1),
                  marginTop: moderateScale(5),
                }}
              />
              <FlatList
                ref={(ref) => {
                  this.chatFlatList = ref;
                }}
                style={{ height: height - moderateScale(305) }}
                onContentSizeChange={() => this.chatFlatList.scrollToEnd()}
                data={fbData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(fbDataItem) => this.chatData(fbDataItem)}
              />
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: moderateScale(55),
            backgroundColor: colors.white,
            borderRadius: moderateScale(15),
            margin: moderateScale(15),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
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
              this.addAttachment();
            }}
          >
            <Image
              source={images.attachment}
              style={{
                height: moderateScale(17),
                width: moderateScale(17),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              width: '75%',
              height: moderateScale(55),
              paddingBottom: 0,
              paddingTop: 0,
              fontSize: moderateScale(12),
              marginTop: 0,
              marginBottom: 0,
              textAlignVertical: 'center',
              marginLeft: 5,
            }}
            onChangeText={(getChatText) => this.setState({ getChatText })}
            value={this.state.getChatText}
            placeholder={'Type your message here...'}
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
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    closeTicket: state.ticketReducer.closeTicket, //accessing the redux state
    reopenTicket: state.ticketReducer.reopenTicket, //accessing the redux state
    ticketCommentList: state.ticketReducer.ticketCommentList, //accessing the redux state
    isloading: state.ticketReducer.isLoading,
    getTicketComment: state.ticketReducer.getTicketComment, //accessing the redux state
    error: state.ticketReducer.error, //accessing the redux state
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetails);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
  frstRowMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
    alignItems: 'center',
  },
  showTxt: {
    color: colors.colorGray,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  dropdownMainView: {
    height: moderateScale(25),
    // width: height * 0.1,
    paddingHorizontal: 5,
    borderWidth: 0.7,
    borderColor: colors.borderLineBox,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropDownArrImg: {
    height: moderateScale(10),
    width: moderateScale(10),
    resizeMode: 'contain',
    marginLeft: moderateScale(15),
  },
  dropDownVal: {
    color: colors.textDropDownVal,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  filterImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
  },
  mainBoxView: {
    width: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerStatusImg: {
    height: height * 0.05,
    width: height * 0.05,
    resizeMode: 'contain',
    marginTop: moderateScale(2),
  },
  sideDropDownArrImg: {
    height: moderateScale(22),
    width: moderateScale(22),
    resizeMode: 'contain',
  },
  businessNameHeading: {
    fontSize: moderateScale(10),
    fontFamily: fonts.PoppinsRegular,
    color: colors.grayNameHeading,
  },
  businessNameVal: {
    fontSize: moderateScale(15),
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    marginTop: 3,
  },
  menuItemStyle: {
    backgroundColor: colors.white,
    marginVertical: isIpad.indexOf('iPad') != -1 ? 0 : -7,
  },
  menuItemTxtSyle: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.blackShade,
    fontSize: moderateScale(12),
  },
  renderItemMainView: {
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rowMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusImgView: {
    flex: 1,
    width: '20%',
    justifyContent: 'center',
  },
  endView: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  filterSelectionImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: moderateScale(6),
    width: width * 0.75,
  },
  filerHeading: {
    fontFamily: fonts.PoppinsRegular,
    color: colors.colorBlack,
    fontSize: moderateScale(12),
    marginBottom: moderateScale(6),
    fontWeight: '500',
  },
});
