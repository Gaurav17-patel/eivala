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
  Alert,
  PermissionsAndroid,
} from "react-native";
import { Actions } from "react-native-router-flux";
import ParallaxScrollView from "react-native-parallax-scroll-view";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../themes";
import strings from "../../themes/strings";
import InitialHeader from "../../components/InitialHeader";
import ParallaxHeader from "../../components/ParallaxHeader";
import { moderateScale } from "../../utils/ResponsiveUi";
import FusionCharts from "react-native-fusioncharts";
import { TouchableOpacity } from "react-native-gesture-handler";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import DeviceInfo from "react-native-device-info";
import { FunctionUtils, NetworkUtils, ApiUtils, WebService } from "../../utils";
import RNFetchBlob from 'rn-fetch-blob';

let isIpad = DeviceInfo.getModel();
let dataSource = {};
const options = {
  global: {
    useUTC: false,
  },
  lang: {
    decimalPoint: ",",
    thousandsSep: ".",
  },
};

class Risk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      riskReportDownload: [],
      dataSourced: dataSource,
      isConnectedInternet: true,
      myRisk: "0",
      customerRisk: "0",
      transactionRisk: "0",
    };
    this.libraryPath = Platform.select({
      // Specify fusioncharts.html file location
      ios: require("../../../assets/fusioncharts.html"),
      android: { uri: "file:///android_asset/fusioncharts.html" },
    });
  }

  componentDidMount() {
    this.getRiskData();
  }

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

  async getRiskData() {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isConnectedInternet: true });
      await ApiUtils.getWithToken(WebService.RISKDATA, "")
        .then((response) => {
          console.log("response", response);
          this.setState({
            customerRisk: response.customer_risk,
            myRisk: response.my_risk,
            transactionRisk: response.customer_transaction_risk,
            riskReportDownload: response.reports,
          });
        })
        .catch((e) => {
          FunctionUtils.showToast(e.message);
        });
    } else {
      this.setState({ isConnectedInternet: false });
    }
  }

  renderRecentTrancationsItem = ({ item }) => {
    return (
      <View
        style={{
          height: moderateScale(60),
          width: "100%",
          borderBottomColor: colors.lightGray,
          borderBottomWidth: 0.5,
          justifyContent: "center",
          flexDirection: "row",
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
          <TouchableOpacity>
            <Image
              source={images.pdf}
              style={{
                resizeMode: "contain",
                height: moderateScale(30),
                width: moderateScale(23),
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ height: "100%", width: "70%", justifyContent: "center" }}
        >
          <Text style={styles.trancationText}>{item.name}</Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "15%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.riskReportDownload(item.file_url);
            }}
          >
            <Image
              source={images.download}
              style={{
                resizeMode: "contain",
                height: moderateScale(24),
                width: moderateScale(19),
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  riskReportDownload(url) {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission
    if (Platform.OS === 'ios') {
      this.downloadRiskReport(url);
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage title',
            message: 'storage_permission',
          }
        ).then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            console.log('Storage Permission Granted.');
            this.downloadRiskReport(url);
          } else {
            //If permission denied then show alert 'Storage Permission Not Granted'
            Alert.alert('storage_permission');
          }
        });
      } catch (err) {
        //To handle permission related issue
        console.log('error', err);
      }
    }
  }

  downloadRiskReport(url) {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Risk_Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    config(options)
      .fetch('GET', url)
      .then((res) => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Report Downloaded Successfully.');
      });
  }

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
          {"AML is coming with big news"}
        </Text>
        <Text numberOfLines={3} style={styles.newsDetailText}>
          {
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          }
        </Text>
      </View>
    );
  };

  renderMenuOptionss() {
    return (
      <Menu
        style={{ marginTop: moderateScale(10) }}
        ref={(ref) => (this.postmenu = ref)}
      >
        <MenuItem
          textStyle={styles.menuItemTxtSyle}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(0)}
        >
          {strings.definitive}
        </MenuItem>
        <MenuItem
          textStyle={styles.menuItemTxtSyle}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(1)}
        >
          {strings.temporary}
        </MenuItem>
        <MenuItem
          textStyle={styles.menuItemTxtSyle}
          style={styles.menuItemStyle}
          onPress={(event) => this.hidePostMenuListView(2)}
        >
          {strings.canceled}
        </MenuItem>
      </Menu>
    );
  }

  render() {
    const {
      myRisk,
      customerRisk,
      riskReportDownload,
      transactionRisk,
    } = this.state;
    return (
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
              headerTxtMain={strings.risk}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              icon={images.drawer}
              headerTxtMain={strings.risk}
            />
          )}
        >
          <SafeAreaView>
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
              }}
            >
              <View
                style={{
                  height: "20%",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.headerTitles}>{strings.myRisk}</Text>
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
                    bottom: moderateScale(10),
                    position: "absolute",
                  }}
                />
              </View>
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
              }}
            >
              <View
                style={{
                  height: "20%",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.headerTitles}>{strings.customerRisk}</Text>
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
                  dataSource={this.chartLoad(customerRisk)}
                  libraryPath={this.libraryPath} //set the libraryPath property
                />
                <View
                  style={{
                    backgroundColor: colors.white,
                    height: moderateScale(20),
                    width: "30%",
                    bottom: moderateScale(10),
                    position: "absolute",
                  }}
                />
              </View>
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
              }}
            >
              <View
                style={{
                  height: "20%",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.headerTitles}>
                  {strings.transactionRisk}
                </Text>
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
                  dataSource={this.chartLoad(transactionRisk)}
                  libraryPath={this.libraryPath} // set the libraryPath property
                />
                <View
                  style={{
                    backgroundColor: colors.white,
                    height: moderateScale(20),
                    width: "30%",
                    bottom: moderateScale(10),
                    position: "absolute",
                  }}
                />
              </View>
            </View>
            <View
              style={{
                // height: moderateScale(214),
                flex: 1,
                width: "90%",
                backgroundColor: colors.white,
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
                }}
              >
                <Text style={styles.headerTitles}>{strings.reports}</Text>
              </View>
              <View
                style={{
                  // height: "80%",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <FlatList
                  data={riskReportDownload}
                  renderItem={this.renderRecentTrancationsItem}
                  keyExtractor={(item) => item.id}
                  extraData={this.state}
                  scrollEnabled={false}
                />
              </View>
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
      </View>
    );
  }
}

export default Risk;

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
  headerTitles: {
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(17),
    color: colors.colorBlack,
    marginLeft: moderateScale(5),
    fontWeight: "500",
  },
  viewAll: {
    fontFamily: fonts.PoppinsRegular,
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
