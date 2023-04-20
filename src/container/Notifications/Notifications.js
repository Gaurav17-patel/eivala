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
} from "react-native";
import { debounce } from "lodash";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../themes";
import { moderateScale } from "../../utils/ResponsiveUi";
import strings from "../../themes/strings";
import InitialHeader from "../../components/InitialHeader";
import ParallaxHeader from "../../components/ParallaxHeader";
import * as globals from "../../utils/globals";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { ConstantUtils, FunctionUtils, NetworkUtils } from "../../utils";
import Loader from "../../components/LoaderOpacity";

let isIpad = DeviceInfo.getModel();
// For multiple pagination call
const delay = 1000; // anti-rebound for 1000ms
let lastExecution = 0;

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      notificationsList: [],
      next_page_url: null,
      isLoading: false,
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
    this.getNotificationListAPICall();
  }

  getNotificationListAPICall() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getNotificationList(globals.tokenValue)
        .then(async (response) => {
          const { notificationListData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            notificationListData &&
            notificationListData.hasOwnProperty('user_notification') &&
            notificationListData.user_notification.data.length > 0
          ) {
            this.setState({
              notificationsList: notificationListData.user_notification.data,
              isLoading: false,
              next_page_url: notificationListData.user_notification.links.next,
            });
          } else if (value && value == 'Unauthenticated.') {
            this.setState({ isLoading: false });
            FunctionUtils.clearLogin();
          } else {
            FunctionUtils.showToast(notificationListData.message);
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  notificationListPaginationAPICall() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getNotificationListByPagination(this.state.next_page_url)
        .then(async (response) => {
          const { notificationListData, msgError } = this.props;
          console.log("notificationListData ===", notificationListData);
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            notificationListData &&
            notificationListData.hasOwnProperty('user_notification') &&
            notificationListData.user_notification.data.length > 0
          ) {
            this.setState({
              notificationsList: [
                ...this.state.notificationsList,
                ...notificationListData.user_notification.data,
              ],
              isLoading: false,
              next_page_url: notificationListData.user_notification.links.next,
            });
          } else if (value && value == 'Unauthenticated.') {
            this.setState({ isLoading: false });
            FunctionUtils.clearLogin();
          } else {
            FunctionUtils.showToast(notificationListData.message);
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

  addCustomerBtnClick() {
    Actions.AddCustomer();
  }

  onEndReached = (nativeEvent) => {
    if (FunctionUtils.isCloseToBottom(nativeEvent) && (lastExecution + delay) < Date.now()) {
      lastExecution = Date.now();
      console.log("onEndReached AAAA ===", "onEndReached")
      this.notificationListPaginationAPICall();
    }
  };

  shareBtnClick() {}

  timeFormatechange(item) {
    let date = FunctionUtils.notificationDateTimeSeparate(item);
    return date;
  }

  _renderNotificationList(item, index) {
    return (
      <TouchableOpacity
        style={
          item.read_at ? styles.mainBoxViewNotification : styles.mainBoxView
        }
      >
        <View style={styles.endView}>
          <View style={{ flex: 0.9 }}>
            <Text
              style={{
                fontFamily: fonts.PoppinsRegular,
                fontSize: moderateScale(12),
                fontWeight: "400",
                color: colors.colorBlack,
              }}
            >
              {item.notification}
            </Text>
            {/* <Text
              style={{
                fontFamily: fonts.PoppinsRegular,
                fontSize: moderateScale(10),
                fontWeight: "400",
                color: colors.colorGray,
                marginTop: moderateScale(5),
                paddingBottom: moderateScale(10),
              }}
            > */}
            {/* {this.timeFormatechange("15th April, 1:26 am")} */}
            {/* {"15th April, 1:26 am"}
            </Text> */}
          </View>
          {item.read_at ? (
            <View
              style={{
                flex: 0.1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Image
                source={images.checkIcon}
                style={styles.sideDropDownArrImg}
              />
            </View>
          ) : null}
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

  render() {
    const { notificationsList, next_page_url, isLoading } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          onMomentumScrollEnd={({ nativeEvent }) => {
            console.log("next_page_url ===", next_page_url)
            if (next_page_url && next_page_url !== null) {
              this.onEndReached(nativeEvent)
            }
          }}
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
              icon={images.drawer}
              headerTxtMain={strings.notifications}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              icon={images.drawer}
              headerTxtMain={strings.notifications}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <View style={{ marginTop: moderateScale(15) }}>
                <FlatList
                  data={notificationsList}
                  renderItem={({ item, index }) =>
                    this._renderNotificationList(item, index)
                  }
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
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
    notificationListData: state.notificationReducer.notificationListData, //accessing the redux state
    isloading: state.notificationReducer.isLoading,
    msgError: state.notificationReducer.msgError, //accessing the redux state
  };
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

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
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(10),
    paddingHorizontal: 10,
    marginHorizontal: moderateScale(5),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  mainBoxViewNotification: {
    backgroundColor: colors.lightGray,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: moderateScale(1),
    },
    shadowOpacity: moderateScale(0.25),
    shadowRadius: moderateScale(4),
    elevation: moderateScale(5),
    borderRadius: moderateScale(10),
    paddingTop: moderateScale(10),
    paddingBottom: moderateScale(10),
    paddingHorizontal: 10,
    marginHorizontal: moderateScale(5),
    marginBottom: moderateScale(10),
    marginTop: moderateScale(10),
  },
  customerStatusImg: {
    height: height * 0.05,
    width: height * 0.05,
    resizeMode: "contain",
    marginTop: moderateScale(2),
  },
  sideDropDownArrImg: {
    height: moderateScale(15),
    width: moderateScale(15),
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
    flexDirection: "row",
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
