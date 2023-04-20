import React from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import ParallaxScrollView from "react-native-parallax-scroll-view";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../themes";
import { moderateScale } from "../../utils/ResponsiveUi";
import strings from "../../themes/strings";
import InitialHeader from "../../components/InitialHeader";
import ParallaxHeader from "../../components/ParallaxHeader";
import { FunctionUtils, NetworkUtils } from "../../utils";
import Loader from "../../components/LoaderOpacity.js";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../redux/actions';
import * as globals from '../../utils/globals';

let isIpad = DeviceInfo.getModel();

class AllNews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      currentIndex: 0,
      showPopover: false,
      newsArray: [],
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
    this.getAllNews();
  }

  async getAllNews() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.newsListData(globals.tokenValue).then(async () => {
        const { newsDataList, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (newsDataList !== null) {
          this.setState({
            newsArray: newsDataList.news_list.data,
            isLoading: false,
          });
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
          });
          FunctionUtils.showToast(newsDataList.message);
        }
      });
    } else {
      this.setState({ isLoading: false });
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
  shareBtnClick() {}

  _renderNewsList(item, index) {
    return (
      <TouchableOpacity style={styles.mainBoxView}>
        <View style={styles.endView}>
          <Text
            style={{
              fontFamily: fonts.PoppinsRegular,
              fontSize: moderateScale(14),
              fontWeight: "500",
              color: colors.colorBlack,
              marginTop: moderateScale(5),
              textTransform:'capitalize',
              paddingBottom: moderateScale(10),
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.PoppinsRegular,
              fontSize: moderateScale(12),
              fontWeight: "400",
              color: colors.colorGray,
            }}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { newsArray, isLoading } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={height * 0.19}
          scrollEvent={(event) => {
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
              headerTxtMain={strings.news}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.news}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <View style={{ marginTop: moderateScale(15) }}>
                <FlatList
                  data={newsArray}
                  renderItem={({ item, index }) =>
                    this._renderNewsList(item, index)
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
    isloading: state.dashboardReducer.isLoading,
    newsDataList: state.dashboardReducer.newsDataList,
    msgError: state.dashboardReducer.msgError, //accessing the redux state
    error: state.dashboardReducer.error, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AllNews);

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
