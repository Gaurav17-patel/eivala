import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  FlatList,
  BackHandler,
  TouchableOpacity,
  NativeModules,
  findNodeHandle,
  KeyboardAvoidingView,
} from "react-native";
import { debounce } from "lodash";
import { Actions } from "react-native-router-flux";
import DeviceInfo from "react-native-device-info";
import { Popover, PopoverController } from "react-native-modal-popover";
import ParallaxScrollView from "react-native-parallax-scroll-view";
const { width, height } = Dimensions.get("window");
import { images, fonts, colors } from "../../../themes";
import { moderateScale } from "../../../utils/ResponsiveUi";
import strings from "../../../themes/strings";
import InitialHeader from "../../../components/InitialHeader";
import ParallaxHeader from "../../../components/ParallaxHeader";
import AbsoluteBtn from "../../../components/AbsoluteBtn";
import { ConstantUtils, NetworkUtils, FunctionUtils } from "../../../utils";
import TextFieldWithoutIcon from "../../../components/TextFieldWithoutIcon.js";
import ButtonWithImage from "../../../components/ButtonWithImage.js";
import Loader from "../../../components/LoaderOpacity.js";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../../redux/actions";

let isIpad = DeviceInfo.getModel();

class TicketCreate extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      stickHeaderHeight: 0,
      sowType: strings.definitive,
      isOpen: false,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      currentIndex: 0,
      showPopover: false,
      isLoading: false,
      ticketSubject: '',
      ticketDetails: '',
      support_type_name: '',
      supportTypeOptions: [
        {
          id: 1,
          name: strings.operationalQuery,
        },
        {
          id: 2,
          name: strings.contractQuery,
        },
        {
          id: 3,
          name: strings.transactionQuery,
        },
      ],
      supportTypeId: 0,
    };
    this.ticketDetailsRef = this.updateRef.bind(this, 'ticketDetails');
  }

  updateRef(name, ref) {
    this[name] = ref;
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
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    Actions.pop();
    return true;
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
          onPress={() =>
            this.setState({
              currentIndex: index,
              supportTypeId: item.id,
              support_type_name: item.name,
              showPopover: false,
            })
          }
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

  setFilterOptionsView = (e) => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } });
      });
    }
  };

  validationCheck() {
    const { ticketSubject, supportTypeId, ticketDetails } = this.state;
    if (ticketSubject == '') {
      FunctionUtils.showToast(strings.ticketSubjectBlankError);
    } else if (FunctionUtils.isSpecialCharOnly(ticketSubject)) {
      FunctionUtils.showToast(strings.ticketSubjectError);
    } else if (supportTypeId == 0) {
      FunctionUtils.showToast(strings.ticketTypeBlankError);
    } else if (ticketDetails == "") {
      FunctionUtils.showToast(strings.ticketDetailsBlankError);
    } else if (FunctionUtils.isSpecialCharOnly(ticketDetails)) {
      FunctionUtils.showToast(strings.ticketDetailsError);
    } else {
      this.ticketCreateAPI();
    }
  }

  ticketCreateAPI() {
    const { ticketSubject, supportTypeId, ticketDetails } = this.state;
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      formData.append("ticket_subject", ticketSubject);
      formData.append("support_type", supportTypeId);
      formData.append("details", ticketDetails);
      this.props.createTicket(formData).then(async () => {
        const { createTicketData, error, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (createTicketData) {
          FunctionUtils.showToast(createTicketData.message);
          this.setState({ isLoading: false });
          this.props.gettingTicketListing();
          Actions.pop();
        } else if (errorData && errorData.details) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.details[0]);
        } else if (errorData && errorData.ticket_subject) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.ticket_subject[0]);
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(createTicketData.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  render() {
    const {
      ticketSubject,
      support_type_name,
      supportTypeOptions,
      ticketDetails,
      isLoading,
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
              headerTxtMain={strings.createTickets}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.createTickets}
            />
          )}
        >
          <SafeAreaView>
            <View style={[styles.flexView, { padding: moderateScale(10) }]}>
              <KeyboardAvoidingView behavior="padding" enabled>
                <View style={{ marginTop: moderateScale(15) }}>
                  <TextFieldWithoutIcon
                    onChangeText={(text) =>
                      this.setState({
                        // ticketSubject: text.replace(/[^a-zA-Z]/g, ''),
                        ticketSubject: text,
                      })
                    }
                    placeHolder={strings.ticketSubject}
                    isPassword={false}
                    icon={images.email_logo}
                    height={moderateScale(55)}
                    width={"100%"}
                    value={ticketSubject}
                    marginBottom={moderateScale(13)}
                    isMultiline={false}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      this.ticketDetails.focus();
                    }}
                    blurOnSubmit={false}
                    paddingTop={moderateScale(10)}
                    paddingLeft={moderateScale(10)}
                  />
                  <ButtonWithImage
                    buttonTitle={
                      support_type_name
                        ? support_type_name
                        : strings.selectSupportType
                    }
                    onButtonPress={() => this.openPopover()}
                    height={moderateScale(55)}
                    width={"100%"}
                    backgroundColor={colors.white}
                    marginTop={moderateScale(13)}
                    marginBottom={moderateScale(13)}
                  />
                  <Popover
                    visible={this.state.showPopover}
                    fromRect={this.state.popoverAnchor}
                    contentStyle={{
                      borderWidth: 0,
                      marginLeft: moderateScale(60),
                      marginTop: moderateScale(260),
                      borderRadius: moderateScale(5),
                      borderColor: colors.colorGray,
                    }}
                    onClose={this.closePopover}
                    supportedOrientations={["portrait", "landscape"]}
                    placement="bottom"
                  >
                    <View style={styles.filterModalView}>
                      <Text style={styles.filerHeading}>
                        {strings.supportTypeSelection}
                      </Text>
                      <FlatList
                        data={supportTypeOptions}
                        renderItem={({ item, index }) =>
                          this._renderFilterOptions(item, index)
                        }
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </View>
                  </Popover>
                  <TextFieldWithoutIcon
                    onChangeText={(text) =>
                      this.setState({ ticketDetails: text })
                    }
                    placeHolder={strings.ticketDetail}
                    isPassword={false}
                    icon={images.email_logo}
                    height={moderateScale(123)}
                    width={"100%"}
                    value={ticketDetails}
                    ref={this.ticketDetailsRef}
                    blurOnSubmit={false}
                    marginBottom={moderateScale(13)}
                    marginTop={moderateScale(13)}
                    isMultiline={true}
                    paddingTop={moderateScale(10)}
                    paddingLeft={moderateScale(10)}
                  />
                </View>
              </KeyboardAvoidingView>
            </View>
          </SafeAreaView>
        </ParallaxScrollView>
        <AbsoluteBtn
          btnTxt={strings.createUserTickets}
          onPressBtn={() => this.validationCheck()}
        />
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    createTicketData: state.ticketReducer.createTicketData, //accessing the redux state
    isloading: state.ticketReducer.isLoading,
    error: state.ticketReducer.error, //accessing the redux state
    msgError: state.ticketReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TicketCreate);

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
    height: height * 0.18,
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
