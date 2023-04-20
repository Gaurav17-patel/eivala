import React from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import { Actions } from "react-native-router-flux";
import ParallaxScrollView from "react-native-parallax-scroll-view";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../themes";
import strings from "../../themes/strings";
import InitialHeader from "../../components/InitialHeader";
import ParallaxHeader from "../../components/ParallaxHeader";
import HandleBack from '../BackHandler/BackHandler';
import ChartView from "../../customLibraries/highCharts/react-native-highcharts";
import { moderateScale } from "../../utils/ResponsiveUi";
import FusionCharts from "react-native-fusioncharts";
import { TouchableOpacity } from "react-native-gesture-handler";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import DeviceInfo from "react-native-device-info";
import ButtonWithImage from "../../components/ButtonWithImage.js";
import Loader from '../../components/LoaderOpacity.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../redux/actions';
import { NetworkUtils, FunctionUtils } from "../../utils";

let isIpad = DeviceInfo.getModel();

const dataSource = {
  chart: {
    captionpadding: "0",
    origw: "320",
    origh: "300",
    gaugeouterradius: "115",
    gaugestartangle: "270",
    gaugeendangle: "-25",
    showvalue: "0",
    valuefontsize: "30",
    majortmnumber: "13",
    majortmthickness: "2",
    majortmheight: "13",
    minortmheight: "7",
    minortmthickness: "1",
    minortmnumber: "1",
    showgaugeborder: "0",
    theme: "fusion",
    credits: false,
    bgColor: colors.redColor,
    bgAlpha: "0",
    borderThickness: "0",
    creditgroup: "",
    id: "revenue-chart",
  },
  colorrange: {
    color: [
      {
        minvalue: "0",
        maxvalue: "110", //my_risk
        code: colors.speedChartColor,
      },
      {
        minvalue: "110", //my_risk
        maxvalue: "280",
        code: colors.borderLineBox,
      },
    ],
  },
  dials: {
    dial: [
      {
        value: "110", //my_risk
        id: "Dial 1",
        basewidth: "8",
        color: colors.redColor,
      },
    ],
  },
  annotations: {
    groups: [
      {
        items: [
          {
            type: "text",
            id: "text",
            text: "110",
            x: "$gaugeCenterX",
            y: "$gaugeCenterY + 40",
            fontsize: "20",
            color: "#555555",
          },
        ],
      },
    ],
  },
};

const options = {
  global: {
    useUTC: false,
  },
  lang: {
    decimalPoint: ",",
    thousandsSep: ".",
  },
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      dataSourced: dataSource,
      isLoading: false,
      customerStatisticsMonth: [],
      customerStatisticsTransaction: [],
      customerStatisticsFolder: [],
      dashboardData: {},
      arrRecentTransaction: [],
      arrRecentNews: [],
      notificationCount: 0,
      myRisk: "0",
      yearWiseDataList: [
        { id: 0, yearName: strings.yearWise0 },
        { id: 1, yearName: strings.yearWise1 },
        { id: 2, yearName: strings.yearWise2 },
        { id: 3, yearName: strings.yearWise3 },
        { id: 4, yearName: strings.yearWise4 },
        { id: 5, yearName: strings.yearWise5 },
        { id: 6, yearName: strings.yearWise6 },
        { id: 7, yearName: strings.yearWise7 },
      ],
      filterYearName: strings.yearWise0,
    };
    this.libraryPath = Platform.select({
      // Specify fusioncharts.html file location
      ios: require("../../../assets/fusioncharts.html"),
      android: {
        uri: "file:///android_asset/fusioncharts.html",
      },
    });
  }

  componentDidMount() {
    this.getDashboard();
  }
  //getting the user dashboard data
  async getDashboard() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log("isConnected ====", isConnected)
    let {
      customerStatisticsMonth,
      customerStatisticsTransaction,
      customerStatisticsFolder,
    } = this.state;
    if (isConnected) {
      console.log("this.state.filterYearName ====", this.state.filterYearName)
      this.setState({ isLoading: true });
      this.props.DashboardData(this.state.filterYearName).then(async () => {
        const { dashboardDataList, msgError } = this.props;
        console.log("dashboardDataList ===", dashboardDataList);
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (dashboardDataList !== null) {
          this.setState({
            arrRecentTransaction: dashboardDataList.recent_transaction,
            arrRecentNews: dashboardDataList.recent_news,
            myRisk: dashboardDataList.my_risk,
            dashboardData: dashboardDataList.customer_statistics,
            notificationCount: dashboardDataList.notification_count,
            isLoading: false,
          }, () => {
            let statisticsMonth = [];
            let statisticsTransaction = [];
            let statisticsFolder = [];
            dashboardDataList.customer_statistics.chart_data.map(
              (data, dataIndex) => {
                statisticsMonth.push(data.month_name);
                statisticsTransaction.push(data.transaction_count);
                statisticsFolder.push(data.folder_count)
                // customerStatisticsMonth.push(data.month_name);
                // customerStatisticsTransaction.push(data.transaction_count);
                // customerStatisticsFolder.push(data.folder_count);
              }
            );
            this.setState({
              customerStatisticsMonth: statisticsMonth,
              customerStatisticsTransaction: statisticsTransaction,
              customerStatisticsFolder: statisticsFolder,
            })
          });
          
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({
            isLoading: false,
          });
          FunctionUtils.showToast(dashboardDataList.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }
  //recent transaction list
  renderRecentTrancationsItem = ({ item }) => {
    return (
      <View
        style={{
          height: moderateScale(60),
          width: "100%",
          borderBottomColor: colors.lightGray,
          borderBottomWidth: 0.5,
          justifyContent: "center",
        }}
      >
        <Text style={styles.trancationText}>{item.log_text}</Text>
      </View>
    );
  };
  //recent news list
  renderRecentNewsItem = ({ item }) => {
    return (
      <View
        style={{
          height: moderateScale(100),
          width: "100%",
          borderBottomColor: colors.lightGray,
          borderBottomWidth: 0.5,
          justifyContent: "center",
        }}
      >
        <Text numberOfLines={1} style={styles.newsText}>
          {item.title}
        </Text>
        <Text numberOfLines={3} style={styles.newsDetailText}>
          {item.description}
        </Text>
      </View>
    );
  };
  //year wise listing view
  yearWiseDesignView(item) {
    return (
      <MenuItem
        textStyle={styles.menuItemTxtSyle}
        style={styles.menuItemStyle}
        onPress={(event) => this.hidePostMenuListView(item.yearName)}
      >
        {item.yearName}
      </MenuItem>
    );
  }
  // menu rendering view
  renderMenuOptionss() {
    return (
      <Menu
        style={{ marginTop: moderateScale(10) }}
        ref={(ref) => (this.postmenu = ref)}
      >
        {this.state.yearWiseDataList.map((item, index) => {
          return this.yearWiseDesignView(item);
        })}
      </Menu>
    );
  }
  //hide the year wise menu
  hidePostMenuListView(year_name) {
    this.postmenu.hide();
    this.setState({ filterYearName: year_name });
    setTimeout(() => {
      this.getDashboard();
    }, 50);
  }
  //showing popup
  onbtnMoreClick = (index) => {
    let self = this;
    setTimeout(function () {
      self.showPostListView(index);
    }, 10);
  };
  //showing the menu data
  showPostListView = (idex) => {
    this.postmenu.show();
  };
  //call when back button press
  onBack = () => {
    FunctionUtils.appExitMsg();
    return true;
  };
  generateArrayOfYears = () => {
    var max = new Date().getFullYear();
    var min = max - 9;
    var years = [];
  
    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  }
  //showing the risk data of customer
  chartLoad(value) {
    const dataSource = {
      chart: {
        captionpadding: "0",
        origw: "320",
        origh: "300",
        gaugeouterradius: "115",
        gaugestartangle: "270",
        gaugeendangle: "-25",
        showvalue: "0",
        valuefontsize: "30",
        majortmnumber: "13",
        majortmthickness: "2",
        majortmheight: "13",
        minortmheight: "7",
        minortmthickness: "1",
        minortmnumber: "1",
        showgaugeborder: "0",
        theme: "fusion",
        credits: false,
        bgColor: colors.redColor,
        bgAlpha: "0",
        borderThickness: "0",
        creditgroup: "",
        id: "revenue-chart",
        myRisk: value,
        customerRisk: "155",
        transactionRisk: "55",
      },
      colorrange: {
        color: [
          {
            minvalue: "0",
            maxvalue: value,
            code: colors.speedChartColor,
          },
          {
            minvalue: value,
            maxvalue: "280",
            code: colors.borderLineBox,
          },
        ],
      },
      dials: {
        dial: [
          {
            value: value,
            basewidth: "8",
            color: colors.redColor,
            borderthickness: "0",
          },
        ],
      },
      annotations: {
        groups: [
          {
            items: [
              {
                type: "text",
                id: "text",
                text: value,
                x: "$gaugeCenterX",
                y: "$gaugeCenterY + 40",
                fontsize: "20",
                fontWeight: "bold",
                color: "#555555",
              },
            ],
          },
        ],
      },
    };
    return dataSource;
  }
  // main view rendering
  render() {
    const {
      arrRecentNews,
      isLoading,
      notificationCount,
      filterYearName,
      myRisk,
      arrRecentTransaction,
      customerStatisticsMonth,
      customerStatisticsTransaction,
      customerStatisticsFolder,
    } = this.state;
    var conf = {
      chart: {
        type: "column",
      },
      title: {
        text: null,
        align: "left",
      },
      subtitle: {
        text: null,
        align: "left",
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: false,
      },
      legend: {
        enabled: false,
        align: "right",
        verticalAlign: "middle",
      },
      xAxis: {
        categories: customerStatisticsMonth, //month_name
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: null,
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      //it only shows the data which it greater than 0
      series: [
        {
          name: "Folder",
          data: customerStatisticsFolder, //folder_count
          color: "#E2001A",
        },
        {
          name: "Transaction",
          data: customerStatisticsTransaction, //transaction_count
          color: "#9267EF",
        },
      ],
    };
    return (
      <HandleBack onBack={this.onBack}>
        <View style={styles.flexView}>
          <ParallaxScrollView
            bounces={false}
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
                leftIconPress={() => Actions.drawerOpen()}
                icon={images.drawer}
                rightIcon={images.blackNoti}
                notificationsCount={notificationCount}
                rightIconPress={() => {
                  Actions.Notifications();
                }}
                headerTxtMain={strings.dashboard}
              />
            )}
            renderStickyHeader={() => (
              <ParallaxHeader
                leftIconPress={() => Actions.drawerOpen()}
                icon={images.drawer}
                rightIcon={images.whiteNoti}
                notificationsCount={notificationCount}
                rightIconPress={() => {
                  Actions.Notifications();
                }}
                headerTxtMain={strings.dashboard}
              />
            )}
          >
            <SafeAreaView>
              <View
                style={{
                  height: moderateScale(320),
                  width: "90%",
                  backgroundColor: "white",
                  alignSelf: "center",
                  shadowColor: colors.colorGray2,
                  elevation: moderateScale(8),
                  shadowOpacity: 1.0,
                  shadowRadius: 8,
                  shadowOffset: { height: 5, width: 0 },
                  marginTop: moderateScale(25),
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "70%",
                      height: "100%",
                      marginLeft: moderateScale(2),
                      marginTop: moderateScale(5),
                    }}
                  >
                    <Text style={styles.headerTitles2}>
                      {strings.monthwiseTitle}
                    </Text>
                    <Text style={styles.headerTitles}>
                      {strings.customerStatics}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "30%",
                      height: "100%",
                    }}
                  >
                    <ButtonWithImage
                      buttonTitle={filterYearName}
                      onButtonPress={() => this.onbtnMoreClick()}
                      height={moderateScale(25)}
                      width={"80%"}
                      backgroundColor={colors.white}
                      marginTop={moderateScale(13)}
                      marginRight={5}
                      marginBottom={moderateScale(13)}
                    />
                  </View>
                  {this.renderMenuOptionss()}
                </View>
                <ChartView
                  ref={"chartComponent"}
                  style={{
                    height: "75%",
                    width: "100%",
                    alignSelf: "center",
                  }}
                  config={conf}
                  options={options}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              </View>
              <View
                style={{
                  height: moderateScale(260),
                  width: "90%",
                  backgroundColor: "white",
                  alignSelf: "center",
                  shadowColor: colors.colorGray2,
                  elevation: moderateScale(8),
                  shadowOpacity: 1.0,
                  shadowRadius: 15,
                  shadowOffset: { height: 5, width: 0 },
                  marginTop: moderateScale(25),
                  marginBottom: moderateScale(25)
                }}
              >
                <View
                  style={{
                    height: "20%",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text style={styles.headerTitles}>{strings.myRiskTitle}</Text>
                </View>
                <View
                  style={{
                    height: "80%",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FusionCharts
                    type={"angulargauge"}
                    width={"100%"}
                    height={moderateScale(200)}
                    dataSource={this.chartLoad(myRisk)}
                    libraryPath={this.libraryPath} // set the libraryPath property
                  />
                  <View
                    style={{
                      backgroundColor: colors.white,
                      height: moderateScale(20),
                      width: "30%",
                      bottom: moderateScale(2),
                      position: "absolute",
                    }}
                  />
                </View>
              </View>
              {arrRecentTransaction && arrRecentTransaction.length > 0 ? (
                <View
                  style={{
                    // height: moderateScale(214),
                    width: "90%",
                    backgroundColor: colors.white,
                    alignSelf: "center",
                    shadowColor: colors.colorGray2,
                    elevation: moderateScale(8),
                    shadowOpacity: 1.0,
                    shadowRadius: 15,
                    marginBottom: moderateScale(30),
                    shadowOffset: { height: 5, width: 0 },
                    marginTop: moderateScale(25),
                  }}
                >
                  <View
                    style={{
                      // height: "20%",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={styles.headerTitles}>
                      {strings.recentTransation}
                    </Text>
                  </View>
                  <View
                    style={{
                      // height: "200%",
                      // flex: 1,
                      width: "100%",
                      borderWidth: 0,
                      justifyContent: "center",
                      marginBottom: moderateScale(20),
                    }}
                  >
                    <FlatList
                      data={arrRecentTransaction}
                      renderItem={this.renderRecentTrancationsItem}
                      keyExtractor={(item) => item.id}
                      extraData={this.state}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              ) : null}
              {arrRecentNews && arrRecentNews.length > 0 ? (
                <View
                  style={{
                    // height: moderateScale(240),
                    width: "90%",
                    flex: 1,
                    padding: moderateScale(10),
                    backgroundColor: "white",
                    alignSelf: "center",
                    shadowColor: colors.colorGray2,
                    elevation: moderateScale(8),
                    shadowOpacity: 1.0,
                    shadowRadius: 15,
                    shadowOffset: { height: 5, width: 0 },
                    marginTop: moderateScale(25),
                    marginBottom: moderateScale(25),
                  }}
                >
                  <View
                    style={{
                      height: "20%",
                      width: "100%",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        width: "80%",
                        height: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={styles.headerTitles}>
                        {strings.recentNews}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: "20%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity onPress={() => Actions.AllNews()}>
                        <Text style={styles.viewAll}>{strings.viewAll}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <FlatList
                      data={arrRecentNews}
                      renderItem={this.renderRecentNewsItem}
                      keyExtractor={(item) => item.id}
                      extraData={this.state}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              ) : null}
            </SafeAreaView>
          </ParallaxScrollView>
          {isLoading && <Loader />}
        </View>
      </HandleBack>
    );
  }
}
//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    isloading: state.dashboardReducer.isLoading,
    dashboardDataList: state.dashboardReducer.dashboardDataList,
    msgError: state.dashboardReducer.msgError, //accessing the redux state
    error: state.dashboardReducer.error, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
  headerTitles: {
    fontFamily: fonts.PoppinsBold,
    fontSize: moderateScale(17),
    color: colors.colorBlack,
    marginLeft: moderateScale(8),
    marginTop: moderateScale(10),
    fontWeight: "500",
  },
  viewAll: {
    fontFamily: fonts.PoppinsMedium,
    fontSize: moderateScale(14),
    color: colors.colorRed,
    fontWeight: "500",
  },
  trancationText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(14),
    color: colors.colorBlack,
    fontWeight: "400",
    marginLeft: moderateScale(5),
  },
  newsText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(14),
    color: colors.colorBlack,
    fontWeight: "500",
    marginLeft: moderateScale(5),
  },
  newsDetailText: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    color: colors.colorGray,
    fontWeight: "400",
    marginLeft: moderateScale(5),
  },
  headerTitles2: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(17),
    color: colors.colorBlack,
    marginLeft: moderateScale(5),
    fontWeight: "300",
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
});
