import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import {debounce} from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ActionCreators} from '../../redux/actions';
import {FunctionUtils, NetworkUtils} from '../../utils';
import {Actions} from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
import {Popover, PopoverController} from 'react-native-modal-popover';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
const {width, height} = Dimensions.get('window');
import {images, fonts, colors} from '../../themes';
import {moderateScale} from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import AbsoluteBtn from '../../components/AbsoluteBtn';
import {ConstantUtils} from '../../utils';
import * as globals from '../../utils/globals';
import Loader from '../../components/LoaderOpacity.js';
import NoDataView from '../../components/NoDataView';
import Share from 'react-native-share';

let isIpad = DeviceInfo.getModel();
// For multiple pagination call
const delay = 1000; // anti-rebound for 1000ms
let lastExecution = 0;

let TAG = 'CustomerList:==';
class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      currentIndex: 0,
      multiClicks: false,
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
      customerList: [],
      isLoading: false,
      searchBarFocused: false,
      searchText: '',
      next_page_url: null,
    };
  }

  componentDidMount() {
    this.addCustomerBtnClick = debounce(
      this.addCustomerBtnClick.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      },
    );
    this.redirectToViewCustomer = debounce(
      this.redirectToViewCustomer.bind(this),
      1000,
      {
        leading: true,
        trailing: false,
      },
    );
    this.shareBtnClick = debounce(this.shareBtnClick.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.customerAPIList();
  }

  customerAPIList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props.getMyCustomerList(globals.tokenValue).then(async () => {
        const {customerListData, msgError} = this.props;
        console.log('customerListData****', customerListData);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          customerListData &&
          customerListData.customer_data.data &&
          customerListData.customer_data.data.length > 0
        ) {
          this.setState({
            customerList: customerListData.customer_data.data,
            isLoading: false,
            next_page_url: customerListData.customer_data.links.next,
          });
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

  customerListPaginationAPICall = () => {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({isLoading: true});
      this.props
        .getCustomerListByPagination(this.state.next_page_url)
        .then(async () => {
          const {customerListData, msgError} = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            customerListData &&
            customerListData.customer_data.data &&
            customerListData.customer_data.data.length > 0
          ) {
            this.setState({
              customerList: [
                ...this.state.customerList,
                ...customerListData.customer_data.data,
              ],
              isLoading: false,
              next_page_url: customerListData.customer_data.links.next,
            });
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
  };

  onEndReached = nativeEvent => {
    if (
      FunctionUtils.isCloseToBottom(nativeEvent) &&
      lastExecution + delay < Date.now()
    ) {
      lastExecution = Date.now();
      this.customerListPaginationAPICall();
    }
  };

  onbtnMoreClick = index => {
    let self = this;
    setTimeout(function () {
      self.showPostListView(index);
    }, 10);
  };

  showPostListView = idex => {
    this.postmenu.show();
  };

  customerListFilterBy(filter_type, filter_options) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.props
        .getFilterMyCustomerList(filter_type, filter_options)
        .then(async () => {
          const {customerListData} = this.props;
          if (
            customerListData.customer_data.data &&
            customerListData.customer_data.data.length > 0
          ) {
            this.setState({
              customerList: customerListData.customer_data.data,
              isLoading: false,
            });
          } else {
            this.setState({
              isLoading: false,
              customerList: [],
            });
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  hidePostMenuListView(position) {
    this.postmenu.hide();
    let self = this;
    if (position == 0) {
      this.setState({sowType: strings.definitive});
      this.customerListFilterBy('filter_by_show', 'definitive');
    } else if (position == 1) {
      this.setState({sowType: strings.temporary});
      this.customerListFilterBy('filter_by_show', 'temporary');
    } else {
      this.setState({sowType: strings.canceled});
      this.customerListFilterBy('filter_by_show', 'canceled');
    }
  }

  getUpdatedUsersList = () => {
    setTimeout(() => {
      this.customerAPIList();
    }, 200);
  };

  addCustomerBtnClick() {
    // Actions.AddCustomer();
    Actions.AddCustomer({getUpdatedUsersList: this.getUpdatedUsersList});
  }

  redirectToViewCustomer(item) {
    console.log('itemitem', item);
    Actions.ViewCustomer({customerProfileDetail: item, customerID: item.id});
  }

  shareBtnClick() {
    const shareOptions = {
      message: 'document name :',
    };
    Share.open(shareOptions)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  }

  _renderCustomerList(item, index) {
    return (
      <TouchableOpacity
        style={styles.mainBoxView}
        onPress={() => this.redirectToViewCustomer(item)}>
        <View style={styles.renderItemMainView}>
          <View style={styles.rowMainView}>
            <View style={styles.statusImgView}>
              <Image
                source={images.customerStatus}
                style={styles.customerStatusImg}
              />
            </View>
            <View style={{width: '40%'}}>
              <Text style={styles.businessNameHeading}>
                {strings.businessName}
              </Text>
              <Text style={styles.businessNameVal}>
                {item && item.business_name !== null
                  ? item.business_name
                  : item.first_name+ ' ' + item.last_name}
              </Text>
            </View>
            <View style={{width: '40%'}}>
              <Text style={styles.businessNameHeading}>
                {strings.subsituteType}
              </Text>
              <Text style={styles.businessNameVal}>
                {/* {item && item.customer_type !== null && item.customer_type == 1
                  ? strings.naturalPerson
                  : strings.sociaty} */}
                {item && item.subject_type !== null && item.subject_type == 1
                  ? strings.naturalPerson
                  : strings.sociaty}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.endView}>
          <Image
            source={images.crossArrowDown}
            style={styles.sideDropDownArrImg}
          />
        </View>
      </TouchableOpacity>
    );
  }

  onPressFilterOption(item, index) {
    this.setState({currentIndex: index, showPopover: false});
    this.customerListFilterBy('filter_by_specific_risk', item.id);
  }

  _renderFilterOptions(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() => this.onPressFilterOption(item, index)}>
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
    this.setState({showPopover: true});
  }

  closePopover = () => this.setState({showPopover: false});

  renderMenuOptionss() {
    const {customerList, sowType} = this.state;
    return (
      <Menu
        style={{marginTop: moderateScale(10)}}
        ref={ref => (this.postmenu = ref)}>
        <MenuItem
          textStyle={[
            styles.menuItemTxtSyle,
            {
              fontWeight: sowType == strings.definitive ? 'bold' : 'normal',
            },
          ]}
          style={styles.menuItemStyle}
          onPress={event => this.hidePostMenuListView(0)}>
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
          onPress={event => this.hidePostMenuListView(1)}>
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
          onPress={event => this.hidePostMenuListView(2)}>
          {strings.canceled}
        </MenuItem>
      </Menu>
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

  searchBarDesign() {
    this.setState({
      searchBarFocused: !this.state.searchBarFocused,
    });
  }

  changeText(text) {
    this.setState({searchText: text});
    setTimeout(() => {
      this.customerListFilterBy('filter_by_text', text);
    }, 50);
  }

  render() {
    const {
      customerList,
      isLoading,
      searchBarFocused,
      filterOptions,
      searchText,
      next_page_url,
    } = this.state;
    console.log('customerList>>', customerList);
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          onMomentumScrollEnd={({nativeEvent}) => {
            if (next_page_url && next_page_url !== null) {
              this.onEndReached(nativeEvent);
            }
          }}
          // onMomentumScrollEnd={(event) => {
          //   console.log("event ===", event);
          //   if (next_page_url && next_page_url !== null) {
          //     this.customerListPaginationAPICall();
          //   }
          // }}
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
              leftIconPress={() => Actions.drawerOpen()}
              icon={!searchBarFocused ? images.drawer : null}
              rightIconPress={() => this.searchBarDesign()}
              onChangeSearchText={text => this.changeText(text)}
              searchValue={searchText}
              searchBar={searchBarFocused}
              rightIcon={
                // customerList && customerList.length && !searchBarFocused > 0
                //   ? images.searchBlack
                //   : null
                images.searchBlack
              }
              headerTxtMain={strings.customers}
              searchBarClose={() => {
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                });
                this.customerAPIList();
              }}
              onSearchTextClear={() => {
                this.setState({searchText: ''});
                this.customerAPIList();
              }}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              icon={!searchBarFocused ? images.drawer : null}
              rightIconPress={() => this.searchBarDesign()}
              onChangeSearchText={text => this.changeText(text)}
              searchValue={searchText}
              searchBar={searchBarFocused}
              rightIcon={
                // customerList && customerList.length && !searchBarFocused > 0
                //   ? images.searchWhite
                //   : null
                images.searchWhite
              }
              headerTxtMain={strings.customers}
              searchBarClose={() => {
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                });
                this.customerAPIList();
              }}
              onSearchTextClear={() => {
                this.setState({searchText: ''});
                this.customerAPIList();
              }}
            />
          )}>
          <SafeAreaView>
            <View style={[styles.flexView, {padding: moderateScale(10)}]}>
              <View style={styles.frstRowMainView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.showTxt}>{strings.show + ':'}</Text>
                  {this.renderMenuOptionss()}
                  <TouchableOpacity
                    hitSlop={ConstantUtils.hitSlop.twenty}
                    onPress={() => this.onbtnMoreClick()}
                    style={styles.dropdownMainView}>
                    <Text style={styles.dropDownVal}>{this.state.sowType}</Text>

                    <Image
                      source={images.dropDownArr}
                      style={styles.dropDownArrImg}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  hitSlop={ConstantUtils.hitSlop.twenty}
                  ref={r => {
                    this.refFilterOptionView = r;
                  }}
                  onLayout={this.setFilterOptionsView}
                  onPress={() => this.openPopover()}>
                  <Image source={images.filter} style={styles.filterImg} />
                </TouchableOpacity>
                <Popover
                  visible={this.state.showPopover}
                  fromRect={this.state.popoverAnchor}
                  contentStyle={{
                    borderWidth: 0,
                    borderRadius: moderateScale(5),
                    borderColor: colors.colorGray,
                  }}
                  onClose={this.closePopover}
                  supportedOrientations={['portrait', 'landscape']}
                  placement="bottom">
                  <View style={styles.filterModalView}>
                    <Text style={styles.filerHeading}>
                      {strings.filterBySpecificReasons}
                    </Text>
                    <FlatList
                      data={filterOptions}
                      renderItem={({item, index}) =>
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
              {customerList && customerList.length > 0 ? (
                <View style={{marginTop: moderateScale(15)}}>
                  <FlatList
                    data={customerList}
                    pagingEnabled={true}
                    renderItem={({item, index}) =>
                      this._renderCustomerList(item, index)
                    }
                    style={{flex: 1, marginBottom: moderateScale(10)}}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={4}
                    maxToRenderPerBatch={1}
                    onReachedThreshold={0.3}
                    onEndReachedThreshold={0.2}
                  />
                </View>
              ) : (
                <NoDataView dataTitle={strings.noCust} />
              )}
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        {/* <AbsoluteBtn
          btnType={customerList && customerList.length > 0 ? 'half' : 'full'}
          btnLeftTxt={strings.addcustomer}
          btnRightTxt={
            customerList && customerList.length > 0 ? strings.share : null
          }
          btnTxt={
            customerList && customerList.length > 0 ? null : strings.addcustomer
          }
          onPressBtn={() =>
            customerList && customerList.length > 0
              ? null
              : this.addCustomerBtnClick()
          }
          onPressBtnLeft={() => this.addCustomerBtnClick()}
          onPressBtnRight={() => this.shareBtnClick()}
          marginRight={0}
        /> */}

        <AbsoluteBtn
          btnType={'full'}
          btnTxt={
            customerList && customerList.length > 0 ? strings.share : null
          }
          onPressBtn={() =>
            customerList && customerList.length > 0
              ? this.shareBtnClick()
              : null
          }
          marginRight={0}
        />
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = state => {
  return {
    customerListData: state.customerReducer.customerListData, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);

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
    flex: 1,
    alignItems: 'center',
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
    paddingTop: 10,
    paddingHorizontal: 10,
    marginHorizontal: moderateScale(5),
    marginBottom: moderateScale(15),
    marginTop: moderateScale(2),
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
