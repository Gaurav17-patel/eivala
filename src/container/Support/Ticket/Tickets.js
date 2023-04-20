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
import { Popover, PopoverController } from "react-native-modal-popover";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../../themes";
import { moderateScale } from "../../../utils/ResponsiveUi";
import strings from "../../../themes/strings";
import InitialHeader from "../../../components/InitialHeader";
import ParallaxHeader from "../../../components/ParallaxHeader";
import AbsoluteBtn from "../../../components/AbsoluteBtn";
import Loader from "../../../components/LoaderOpacity.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";
import { FunctionUtils, ConstantUtils, NetworkUtils } from "../../../utils";
import NoDataView from "../../../components/NoDataView";
import moment from "moment";

let isIpad = DeviceInfo.getModel();

class TicketList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      currentIndex: 0,
      currentPage: 1,
      lastPage: 0,
      isLoading: false,
      filterOptions: [
        {
          id: 1,
          name: strings.all,
        },
        {
          id: 2,
          name: strings.open,
        },
        {
          id: 3,
          name: strings.close,
        },
      ],
      showPopover: false,
      ticketListData: [],
      filterName: "all",
      searchBarFocused: false,
      searchText: "",
      next_page_url_tickets: null,
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
    this.ticketListAPICall();
  }

  ticketListAPICall() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.getTicketList(this.state.filterName).then(async () => {
        const { ticketListData, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          ticketListData &&
          ticketListData.ticket_data.data &&
          ticketListData.ticket_data.data.length > 0
        ) {
          this.setState({
            ticketListData: ticketListData.ticket_data.data,
            next_page_url_tickets: ticketListData.ticket_data.links.next,
            isLoading: false,
          });
        } else if (value && value == "Unauthenticated.") {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
            ticketListData: [],
          });
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  ticketListAPICallByFilter(filter_type, filter_options) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getFilterMyTicketList(filter_type, filter_options)
        .then(async () => {
          const { ticketListData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            ticketListData &&
            ticketListData.ticket_data.data &&
            ticketListData.ticket_data.data.length > 0
          ) {
            this.setState({
              ticketListData: ticketListData.ticket_data.data,
              lastPage: ticketListData.ticket_data.meta.total,
              isLoading: false,
            });
          } else if (value && value == "Unauthenticated.") {
            this.setState({ isLoading: false });
            FunctionUtils.clearLogin();
          } else {
            this.setState({
              isLoading: false,
              ticketListData: [],
            });
            // FunctionUtils.showToast(ticketListData.message);
          }
        });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  // onbtnMoreClick = (index) => {
  //   let self = this;
  //   setTimeout(function () {
  //     self.showPostListView(index);
  //   }, 10);
  // };

  // showPostListView = (idex) => {
  //   this.postmenu.show();
  // };

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

  supportTypeSet(support) {
    if (support === 1) {
      return strings.operationalQuery;
    } else if (support === 2) {
      return strings.contractQuery;
    } else if (support === 3) {
      return strings.transactionQuery;
    } else {
      return strings.notAble;
    }
  }

  _renderTicketList(item, index) {
    return (
      <TouchableOpacity
        style={styles.mainBoxView}
        onPress={() => Actions.TicketDetails({ ticketData: item })}
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
              width: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={images.ticketOpen}
              style={styles.customerStatusImg}
            />
          </View>
          <View
            style={{
              height: "100%",
              width: "75%",
              justifyContent: "center",
            }}
          >
            <Text numberOfLines={2} style={styles.businessNameVal}>
              {item.ticket_subject}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.PoppinsRegular,
                fontSize: moderateScale(11),
                color: colors.colorGray,
              }}
            >
              {this.supportTypeSet(item.support_type)}
              <Text
                style={{
                  fontFamily: fonts.PoppinsRegular,
                  fontSize: moderateScale(11),
                  color: colors.colorGray,
                }}
              >
                {" \u25CF"}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.PoppinsRegular,
                  fontSize: moderateScale(11),
                  color: colors.colorGray,
                }}
              >
                {this.timeFormatechange(item.created_at)}
              </Text>
            </Text>
          </View>
          <View
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
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  setFilterData(index, filtername) {
    setTimeout(() => {
      this.setState({
        currentIndex: index,
        showPopover: false,
        filterName: filtername,
      });
      this.ticketListAPICall();
    }, 100);
  }

  _renderFilterOptions(item, index) {
    let filtername = item.name.toLowerCase();
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() => this.setFilterData(index, filtername)}
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

  gettingTicketListing = () => {
    setTimeout(() => {
      this.ticketListAPICall();
    }, 10);
  };

  creatingTicket() {
    Actions.TicketCreate({ gettingTicketListing: this.gettingTicketListing });
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
      this.ticketListAPICallByFilter("filter_by_text", text);
    }, 50);
  }

  timeFormatechange(item) {
    let date = FunctionUtils.dateSeparate(item);
    let time = FunctionUtils.timeSeparate(item);
    let finalData = date + ", " + time;
    return finalData;
  }

  ticketListPaginationAPICall = () => {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getMyTicketListByPagination(this.state.next_page_url_tickets)
        .then(async () => {
          const { ticketListData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            ticketListData &&
            ticketListData.ticket_data.data &&
            ticketListData.ticket_data.data.length > 0
          ) {
            this.setState({
              ticketListData: [
                ...this.state.ticketListData,
                ...ticketListData.ticket_data.data,
              ],
              next_page_url_tickets: ticketListData.ticket_data.links.next,
              isLoading: false,
            });
            // FunctionUtils.showToast(ticketListData.message);
          } else if (value && value == "Unauthenticated.") {
            this.setState({ isLoading: false });
            FunctionUtils.clearLogin();
          } else {
            this.setState({
              isLoading: false,
            });
            // FunctionUtils.showToast(ticketListData.message);
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  };

  searchBarClosed() {
    this.setState({
      searchBarFocused: !this.state.searchBarFocused,
      filterName: 'all',
    });
    setTimeout(() => {
      this.ticketListAPICall();
    }, 20);
  }

  searchBarTextBoxClear() {
    this.setState({ searchText: '', filterName: 'all' });
    setTimeout(() => {
      this.ticketListAPICall();
    }, 20);
  }

  render() {
    const {
      ticketListData,
      isLoading,
      filterOptions,
      searchBarFocused,
      searchText,
      next_page_url_tickets,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          onMomentumScrollEnd={(event) => {
            if (next_page_url_tickets && next_page_url_tickets !== null) {
              this.ticketListPaginationAPICall();
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
              firstRightIconPress={() => this.openPopover()}
              icon={!searchBarFocused ? images.drawer : null}
              rightIconPress={() =>
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                })
              }
              searchBar={searchBarFocused}
              onChangeSearchText={(text) => this.changeText(text)}
              searchValue={searchText}
              searchBarClose={() => {
                this.searchBarClosed();
              }}
              onSearchTextClear={() => {
                this.searchBarTextBoxClear();
              }}
              rightIcon={images.searchBlack}
              isTwoRightIcon={images.filter}
              // rightIcon={
              //   ticketListData && ticketListData.length > 0
              //     ? images.searchBlack
              //     : null
              // }
              // isTwoRightIcon={
              //   ticketListData && ticketListData.length > 0
              //     ? images.filter
              //     : null
              // }
              headerTxtMain={strings.tickets}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              firstRightIconPress={() => this.openPopover()}
              headerTxtMain={strings.tickets}
              icon={!searchBarFocused ? images.drawer : null}
              rightIconPress={() =>
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                })
              }
              searchBar={searchBarFocused}
              onChangeSearchText={(text) => this.changeText(text)}
              searchValue={searchText}
              searchBarClose={() => {
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                });
                this.ticketListAPICall();
              }}
              onSearchTextClear={() => {
                this.setState({ searchText: '' });
                this.ticketListAPICall();
              }}
              // isTwoRightIcon={
              //   ticketListData && ticketListData.length > 0
              //     ? images.filter
              //     : null
              // }
              // rightIcon={
              //   ticketListData && ticketListData.length > 0
              //     ? images.searchWhite
              //     : null
              // }
              rightIcon={images.searchWhite}
              isTwoRightIcon={images.filter}
            />
          )}
        >
          <SafeAreaView>
            {ticketListData && ticketListData.length > 0 ? (
              <View style={[styles.flexView, { padding: moderateScale(10) }]}>
                <View
                  style={{
                    margin: moderateScale(10),
                  }}
                >
                  <FlatList
                    pagingEnabled={true}
                    data={ticketListData}
                    renderItem={({ item, index }) =>
                      this._renderTicketList(item, index)
                    }
                    style={{ flex: 1, marginBottom: moderateScale(10) }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={4}
                    maxToRenderPerBatch={1}
                    onReachedThreshold={0.3}
                    onEndReachedThreshold={0.2}
                  />
                </View>
              </View>
            ) : (
              <NoDataView dataTitle={strings.noCust} />
            )}
            <View style={styles.frstRowMainView}>
              <Popover
                visible={this.state.showPopover}
                fromRect={this.state.popoverAnchor}
                //contentStyle={{borderWidth: 0.5,borderColor: colors.blackShade}}
                contentStyle={{
                  borderWidth: 0,
                  marginLeft: moderateScale(200),
                  marginTop: moderateScale(50),
                  borderRadius: moderateScale(5),
                  borderColor: colors.colorGray,
                  height: moderateScale(120),
                  width: moderateScale(120),
                }}
                    // arrowStyle={{
                    //   borderWidth: 0,
                    //   marginLeft: moderateScale(300),
                    //   marginTop: moderateScale(50),
                    // }}
                onClose={this.closePopover}
                supportedOrientations={["portrait", "landscape"]}
                placement="bottom"
              >
                  <View style={styles.filterModalView}>
                      {/* <Text style={styles.filerHeading}>
                      {strings.filterBySpecificReasons}
                    </Text> */}
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
          </SafeAreaView>
        </ParallaxScrollView>
        <AbsoluteBtn
          btnType={"full"}
          btnTxt={strings.createTicket}
          onPressBtn={() => this.creatingTicket()}
          marginRight={0}
        />
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    ticketListData: state.ticketReducer.ticketListData, //accessing the redux state
    isloading: state.ticketReducer.isLoading,
    ticketListPaginationData: state.ticketReducer.ticketListPaginationData, //accessing the redux state
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketList);

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
    marginBottom: moderateScale(5),
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
    marginTop: moderateScale(3),
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
