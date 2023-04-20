import React from "react";
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
} from "react-native";
import { debounce } from "lodash";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import { Popover, PopoverController } from "react-native-modal-popover";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../../themes";
import { moderateScale } from "../../../utils/ResponsiveUi";
import strings from "../../../themes/strings";
import InitialHeader from "../../../components/InitialHeader";
import ParallaxHeader from "../../../components/ParallaxHeader";
import { ConstantUtils, FunctionUtils, NetworkUtils } from "../../../utils";
import * as globals from "../../../utils/globals";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import Loader from '../../../components/LoaderOpacity.js';
import NoDataView from "../../../components/NoDataView";

let isIpad = DeviceInfo.getModel();

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
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
      chatList: [],
      searchBarFocused: false,
      searchText: '',
      isLoading: false,
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
    this.chatAPIList();
  }

  chatCountAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props.getUserChatCountList(globals.tokenValue).then(async () => {
        const { chatCountList, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          chatCountList &&
          chatCountList.data.counts &&
          chatCountList.data.counts.length > 0
        ) {
          for (
            let mainIndex = 0;
            mainIndex < this.state.chatList.length;
            mainIndex++
          ) {
            for (
              let index = 0;
              index < chatCountList.data.counts.length;
              index++
            ) {
              if (
                this.state.chatList[mainIndex].id ===
                chatCountList.data.counts[index].sender_id
              ) {
                this.state.chatList[mainIndex].userCount =
                  chatCountList.data.counts[index].count;
              } else {
                this.state.chatList[mainIndex].userCount = 0;
              }
            }
          }
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

  chatAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getUserChatList(this.state.searchText).then(async () => {
        const { chatListResData, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          chatListResData &&
          chatListResData.users &&
          chatListResData.users.length > 0
        ) {
          this.setState({
            chatList: chatListResData.users,
            isLoading: false,
            // next_page_url: chatListResData.customer_data.links.next,
          });
          this.chatCountAPIList();
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

  _renderChatList(item, index) {
    return (
      <TouchableOpacity
        style={styles.mainBoxView}
        onPress={() => Actions.ChatDetails({ chatDetailsData: item })}
      >
        <View
          style={{
            flexDirection: "row",
            height: "96%",
            width: "96%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.profile_img_url ? (
              <Image
                source={{ uri: item.profile_img_url }}
                style={styles.customerStatusImg}
              />
            ) : (
              <Image
                source={images.email_logo}
                style={styles.customerStatusImg}
              />
            )}
          </View>
          <View
            style={{
              height: "100%",
              width: "80%",
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: "50%",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "65%",
                  flexDirection: "row",
                  alignItems: 'flex-end',
                }}
              >
                <Text numberOfLines={1} style={styles.businessNameVal}>
                  {item.first_name} {item.last_name}
                </Text>
              </View>

              <View
                style={{
                  height: "100%",
                  width: "35%",
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: moderateScale(9),
                    fontFamily: fonts.PoppinsRegular,
                    color: colors.colorGray,
                    maxWidth: "100%",
                  }}
                >
                  {"Today, 04:10 pm"}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: "50%",
                width: "100%",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: "80%",
                  flexDirection: "row",
                }}
              >
                <Text numberOfLines={1} style={styles.businessChatVal}>
                  {item.last_message}
                </Text>
              </View>
              <View
                style={{
                  height: "100%",
                  width: "20%",
                }}
              >
                <View
                  style={{
                    height: "50%",
                    width: "100%",
                  }}
                >
                  {item.unread_msg_count > 0 ? (
                    <View
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(20),
                        borderRadius: moderateScale(10),
                        backgroundColor: colors.redColor,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: 'center',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.PoppinsRegular,
                          fontSize: moderateScale(8),
                          color: colors.white,
                        }}
                      >
                        {item.unread_msg_count}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View
                  style={{
                    height: "50%",
                    width: "100%",
                  }}
                >
                  <Image
                    source={images.crossArrowDown}
                    style={[
                      styles.sideDropDownArrImg,
                      { alignSelf: "flex-end" },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
          {/* <View
            style={{
              height: "100%",
              width: "10%",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Image
              source={images.crossArrowDown}
              style={styles.sideDropDownArrImg}
            />
          </View> */}
        </View>
      </TouchableOpacity>
    );
  }

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

  searchBarDesign() {
    this.setState({
      searchBarFocused: !this.state.searchBarFocused,
    });
  }

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

  changeText(text) {
    this.setState({ searchText: text });
    setTimeout(() => {
      this.chatAPIList();
    }, 50);
  }

  render() {
    const {
      chatList,
      searchBarFocused,
      searchText,
      filterOptions,
      isLoading,
    } = this.state;
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
              leftIconPress={() => Actions.drawerOpen()}
              headerTxtMain={strings.chatbot}
              icon={images.drawer}
              // icon={!searchBarFocused ? images.drawer : null}
              // rightIconPress={() => this.searchBarDesign()}
              // onChangeSearchText={(text) => this.changeText(text)}
              // searchValue={searchText}
              // searchBar={searchBarFocused}
              // rightIcon={
              //   chatList && chatList.length && !searchBarFocused > 0
              //     ? images.searchBlack
              //     : null
              // }
              // searchBarClose={() => {
              //   this.setState({
              //     searchBarFocused: !this.state.searchBarFocused,
              //   });
              //   this.chatAPIList();
              // }}
              // onSearchTextClear={() => {
              //   this.setState({ searchText: '' });
              //   this.chatAPIList();
              // }}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              icon={images.drawer}
              rightIcon={images.searchWhite}
              headerTxtMain={strings.chatbot}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <View style={styles.frstRowMainView}>
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
              {chatList && chatList.length > 0 ? (
                <View style={{ marginTop: moderateScale(15) }}>
                  <FlatList
                    data={chatList}
                    renderItem={({ item, index }) =>
                      this._renderChatList(item, index)
                    }
                    style={{ flex: 1, marginBottom: moderateScale(10) }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              ) : (
                <NoDataView dataTitle={strings.noCust} />
              )}
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
    chatListResData: state.chatReducer.chatListResData, //accessing the redux state
    chatCountList: state.chatReducer.chatCountList, //accessing the redux state
    isloading: state.chatReducer.isLoading,
    msgError: state.chatReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);

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
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    // resizeMode: "contain",
    // borderWidth: 2,
    // borderColor: colors.colorGray,
  },
  sideDropDownArrImg: {
    height: moderateScale(22),
    width: moderateScale(22),
    resizeMode: "contain",
    marginBottom: moderateScale(5),
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
    fontWeight: "600",
  },
  businessChatVal: {
    fontSize: moderateScale(11),
    fontFamily: fonts.PoppinsRegular,
    color: colors.colorGray,
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
