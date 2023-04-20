import React from 'react';
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
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import { debounce } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Popover, PopoverController } from 'react-native-modal-popover';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
const { width, height } = Dimensions.get('window');
import { images, fonts, colors } from '../../themes';
import { moderateScale } from '../../utils/ResponsiveUi';
import strings from '../../themes/strings';
import InitialHeader from '../../components/InitialHeader';
import ParallaxHeader from '../../components/ParallaxHeader';
import AbsoluteBtn from '../../components/AbsoluteBtn';
import { ConstantUtils } from '../../utils';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionCreators } from "../../redux/actions";
import { FunctionUtils, NetworkUtils } from "../../utils";
import * as globals from "../../utils/globals";
import Loader from '../../components/LoaderOpacity.js';
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import DocumentPicker from 'react-native-document-picker';
import NoDataView from "../../components/NoDataView";

const delay = 1000; // anti-rebound for 1000ms
let lastExecution = 0;

class CustomerFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      searchBarFocused: false,
      searchText: '',
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      showPopover: false,
      profileImage: "",
      currentIndex: 0,
      expandCustomerId: 0,
      filterOptions: [
        {
          id: 0,
          name: strings.all,
        },
        {
          id: 1,
          name: strings.compliance,
        },
        {
          id: 2,
          name: strings.nonCompliance,
        },
        {
          id: 3,
          name: strings.partialCompliance,
        },
      ],
      otherDocArr: [],
      docDetail: [],
      isLoading: false,
      next_page_url: null,
    };
  }

  componentDidMount() {
    this.shareAllBtnPress = debounce(this.shareAllBtnPress.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.shareDocClick = debounce(this.shareDocClick.bind(this), 1000, {
      leading: true,
      trailing: false,
    });
    this.getCustomerFolderList();
  }

  getCustomerFolderList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props.addCustomerFolderListAPI(globals.tokenValue).then(async () => {
        const { customerFolderListData, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        if (
          customerFolderListData &&
          customerFolderListData.folder_list.data &&
          customerFolderListData.folder_list.data.length > 0
        ) {
          this.setState({
            otherDocArr: customerFolderListData.folder_list.data,
            isLoading: false,
            next_page_url: customerFolderListData.folder_list.links.next,
          });
          for (let index = 0; index < this.state.otherDocArr.length; index++) {
            this.state.otherDocArr[index].isOpen = false;
          }
        } else if (value && value == 'Unauthenticated.') {
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  customerFolderListPaginationAPICall = () => {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .getListByPagination(this.state.next_page_url)
        .then(async () => {
          const { customerFolderListData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            customerFolderListData &&
            customerFolderListData.folder_list.data &&
            customerFolderListData.folder_list.data.length > 0
          ) {
            this.setState({
              otherDocArr: [
                ...this.state.otherDocArr,
                ...customerFolderListData.folder_list.data,
              ],
              next_page_url: customerFolderListData.folder_list.links.next,
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

  customerFolderFilterBy(filter_type, filter_options) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      // this.setState({ isLoading: true });
      this.props
        .getFilterMyCustomerFolder(filter_type, filter_options)
        .then(async () => {
          const { customerFolderListData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (
            customerFolderListData &&
            customerFolderListData.folder_list.data &&
            customerFolderListData.folder_list.data.length > 0
          ) {
            this.setState({
              otherDocArr: customerFolderListData.folder_list.data,
              isLoading: false,
              showPopover: false,
            });
          } else if (value && value == 'Unauthenticated.') {
            FunctionUtils.clearLogin();
          } else {
            this.setState({
              isLoading: false,
              otherDocArr: [],
              showPopover: false,
            });
          }
        });
    } else {
      this.setState({ isLoading: false, showPopover: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  shareAllBtnPress() {
    const shareOptions = {
      message: 'document name :',
    };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  infoBtnPress() {
    this.setviewInfo();
    this.setState({ showPopover: true });
  }

  closePopover = () => this.setState({ showPopover: false });

  expandCustomerFolder(item) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ expandCustomerId: item.id });
      this.props
        .customerFolderExpand(globals.tokenValue, item.id)
        .then(async () => {
          const { customerFolderExpandDetail } = this.props;
          if (
            customerFolderExpandDetail.data &&
            customerFolderExpandDetail.data.length > 0
          ) {
            this.setState({
              docDetail: customerFolderExpandDetail.data,
            });
          }
        });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  openDocBottomViewOtherDoc(item, index) {
    this.expandCustomerFolder(item);
    this.state.otherDocArr[index].isOpen = !item.isOpen;
    this.setState({ otherDocArr: this.state.otherDocArr });
  }

  shareDocClick(item) {
    const shareOptions = {
      message: 'document name :' + item.name,
    };
    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  openexpandedDesignView(item, index) {
    return (
      <View
        style={{
          // marginBottom: moderateScale(75),
          paddingBottom: moderateScale(10),
          paddingHorizontal: moderateScale(15),
        }}
      >
        <View style={styles.docInfoBottomBoxLine} />
        {this.state.docDetail.map((item) => {
          return this.mainExpandingDetails(item, index);
        })}
        <Image
          source={images.downCrossReverseArr}
          style={[styles.sideCrossDwonArr, { left: moderateScale(15) }]}
        />
      </View>
    );
  }

  _onImagePicker(index) {
    if (index == 0) {
      this.imagePicker("library");
    } else if (index == 1) {
      this.imagePicker("camera");
    }
  }

  imagePicker(type) {
    if (type == "library") {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        this.setState({ profileImage: image.path });
      });
    } else {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
      }).then((image) => {
        this.setState({ profileImage: image.path });
      });
    }
  }

  /* Upload Picture */
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  async mandatoryDocPicker(item) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      this.uploadMandatoryAPICall(res, item);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('error -----', err);
      } else {
        throw err;
      }
    }
  }

  uploadMandatoryAPICall(docPath, customerDetail) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      var documentPath = {
        uri: docPath.uri,
        type: docPath.type,
        name: docPath.name,
      };
      formData.append("document_type_id", customerDetail.id);
      formData.append("customer_id", this.state.expandCustomerId);
      formData.append("doc_file", documentPath);
      this.props.mandatoryDocUploadAP(formData).then(async () => {
        const { mandatoryDocUpload, error, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (mandatoryDocUpload && errorData == "" && msgError == "") {
          FunctionUtils.showToast(mandatoryDocUpload.message);
          this.getCustomerFolderList();
          this.setState({ isLoading: false });
        } else if (errorData && errorData.document_type_id) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.document_type_id[0]);
        } else if (errorData && errorData.customer_id) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.customer_id[0]);
        } else if (errorData && errorData.doc_file) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.doc_file[0]);
        } else if (value && value == 'Unauthenticated.') {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          this.getCustomerFolderList();
          FunctionUtils.showToast(mandatoryDocUpload.message);
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  mainExpandingDetails(item, index) {
    return (
      <View
        style={{
          width: '100%',
          borderWidth: 0,
          marginTop: moderateScale(10),
          flexDirection: 'row',
          marginBottom: moderateScale(10),
        }}
      >
        <View
          style={{
            width: '65%',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.PoppinsRegular,
              fontWeight: '400',
              fontSize: moderateScale(15),
            }}
          >
            {item.document_name}
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              width: '70%',
              justifyContent: 'center',
            }}
          >
            {item.doc_upload === 'No' ? (
              <TouchableOpacity
                onPress={() => this.mandatoryDocPicker(item)}
                style={styles.uploadView}
              >
                <Image
                  source={images.upload}
                  style={styles.documentStatusImg}
                />
                <Text style={styles.uploadTxt}>{strings.upload}</Text>
              </TouchableOpacity>
            ) : (
              <Image
                source={images.checkMark}
                style={styles.documentStatusImg}
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  imageSelection(item) {
    if (item.folder_status === strings.compliance) {
      return images.greenFolder;
    } else if (item.folder_status === strings.nonCompl) {
      return images.redFolder;
    } else if (item.folder_status === strings.partialComp) {
      return images.orangeFolder;
    } else {
      return images.greenFolder;
    }
  }

  _renderOtherDocumentList(item, index) {
    return (
      <TouchableOpacity
        hitSlop={ConstantUtils.hitSlop.twenty}
        style={styles.mainDocumentListView}
        onPress={() => this.openDocBottomViewOtherDoc(item, index)}
      >
        <View style={styles.renderDocView}>
          <View style={styles.rowCenterFlexView}>
            <Image
              source={this.imageSelection(item)}
              style={styles.pdfDocImg}
            />
            <View style={{ marginLeft: moderateScale(10) }}>
              <Text numberOfLines={1} style={styles.docName}>
                {item.first_name}
              </Text>
              <Text style={styles.expiryOnTxt}>
                Company :
                <Text style={styles.dateVal}> {item.business_name}</Text>
              </Text>
            </View>
          </View>
        </View>
        {item.isOpen ? (
          this.openexpandedDesignView(item, index)
        ) : (
          <Image
            source={images.crossArrowDown}
            style={styles.sideCrossDwonArr}
          />
        )}
      </TouchableOpacity>
    );
  }

  setviewInfo = (e) => {
    const handle = findNodeHandle(this.viewInfo);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } }, () => {
          console.log('x y --->' + x + '---y - ' + y);
        });
      });
    }
  };

  _renderFilterOptions(item, index) {
    return (
      <View style={styles.filterOptionRenderMainView}>
        <TouchableOpacity
          hitSlop={ConstantUtils.hitSlop.twenty}
          onPress={() => this.onPressFilterOption(item, index)}
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

  onPressFilterOption(item, index) {
    this.setState({ currentIndex: index, showPopover: false });
    this.customerFolderFilterBy('filter_by_status', item.id);
  }

  closePopover = () => this.setState({ showPopover: false });

  onEndReached = (nativeEvent) => {
    if (FunctionUtils.isCloseToBottom(nativeEvent) && (lastExecution + delay) < Date.now()) {
      lastExecution = Date.now();
      this.customerFolderListPaginationAPICall();
    }
  };

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
      this.customerFolderFilterBy('filter_by_text', text);
    }, 50);
  }

  render() {
    const {
      isLoading,
      searchBarFocused,
      filterOptions,
      otherDocArr,
      searchText,
      next_page_url,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
          // onMomentumScrollEnd={(event) => {
          //   if (next_page_url && next_page_url !== null) {
          //     this.customerFolderListPaginationAPICall();
          //   }
          // }}
          onMomentumScrollEnd={({ nativeEvent }) => {
            if (next_page_url && next_page_url !== null) {
              this.onEndReached(nativeEvent)
            }
          }}
          parallaxHeaderHeight={height * 0.19}
          scrollEvent={(event) => {
            this.setviewInfo();
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
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                });
                this.getCustomerFolderList();
              }}
              onSearchTextClear={() => {
                this.setState({ searchText: '' });
                this.getCustomerFolderList();
              }}
              rightIcon={
                // otherDocArr && otherDocArr.length > 0
                // ?
                images.searchBlack
                // : null
              }
              isTwoRightIcon={
                // otherDocArr && otherDocArr.length > 0 ?
                images.filter
                // : null
              }
              headerTxtMain={strings.customerFolder}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.drawerOpen()}
              firstRightIconPress={() => this.openPopover()}
              icon={!searchBarFocused ? images.drawer : null}
              searchBar={searchBarFocused}
              onChangeSearchText={(text) => this.changeText(text)}
              searchValue={searchText}
              searchBarClose={() => {
                this.setState({
                  searchBarFocused: !this.state.searchBarFocused,
                });
                this.getCustomerFolderList();
              }}
              onSearchTextClear={() => {
                this.setState({ searchText: '' });
                this.getCustomerFolderList();
              }}
              rightIcon={
                otherDocArr && otherDocArr.length > 0
                  ? images.searchBlack
                  : null
              }
              isTwoRightIcon={
                otherDocArr && otherDocArr.length > 0 ? images.filter : null
              }
              headerTxtMain={strings.customerFolder}
            />
          )}
        >
          {/* {otherDocArr && otherDocArr.length > 0 ? ( */}
            <SafeAreaView>
              {otherDocArr && otherDocArr.length > 0 ? (
              <View style={styles.mainView}>
                <ActionSheet
                  ref={(o) => (this.ActionSheet = o)}
                  title={strings.selectMediaType}
                  options={ConstantUtils.IMAGE_AND_VIDEO_OPTION}
                  cancelButtonIndex={2}
                  onPress={(index) => this._onImagePicker(index)}
                />
                <FlatList
                  data={otherDocArr}
                  pagingEnabled={true}
                  renderItem={({ item, index }) =>
                    this._renderOtherDocumentList(item, index)
                  }
                  style={styles.mandatoryDocFlatList}
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
              <View style={styles.frstRowMainView}>
                <Popover
                  visible={this.state.showPopover}
                  fromRect={this.state.popoverAnchor}
                  contentStyle={{
                    borderWidth: 0,
                    marginLeft: moderateScale(150),
                    marginTop: moderateScale(50),
                    borderRadius: moderateScale(5),
                    borderColor: colors.colorGray,
                    height: moderateScale(150),
                    width: moderateScale(180),
                  }}
                  // arrowStyle={{
                  //   borderWidth: 0,
                  //   marginLeft: moderateScale(300),
                  //   marginTop: moderateScale(50),
                  // }}
                  onClose={this.closePopover}
                  supportedOrientations={['portrait', 'landscape']}
                  placement="auto"
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
          {/* ) : (
            <NoDataView dataTitle={strings.noCust} />
          )} */}
        </ParallaxScrollView>
        {otherDocArr && otherDocArr.length > 0 ? (
          <AbsoluteBtn
            btnTxt={strings.shareall}
            onPressBtn={() => this.shareAllBtnPress()}
            marginRight={0}
          />
        ) : null}
        {isLoading && <Loader />}
      </View>
    );
  }
}

//Following the code for connecting the container class with redux
const mapStateToProps = (state) => {
  return {
    customerFolderListData: state.customerReducer.customerFolderListData, //accessing the redux state
    customerFolderExpandDetail:
      state.customerReducer.customerFolderExpandDetail, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    error: state.ticketReducer.error, //accessing the redux state
    mandatoryDocUpload: state.customerReducer.mandatoryDocUpload, //accessing the redux state
    msgError: state.customerReducer.msgError, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerFolder);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    marginTop: moderateScale(10),
    flex: 1,
  },
  secondBoxMainView: {
    flex: 1,
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
    //width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    height: height * 0.07,
    marginTop: moderateScale(13),
    marginHorizontal: moderateScale(13),
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowCenterView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mandatoryDocMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(13),
    marginTop: moderateScale(10),
  },
  thirdBoxView: {
    flex: 1,
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
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    padding: moderateScale(15),
    marginTop: moderateScale(16),
    marginHorizontal: moderateScale(13),
  },
  documentStatusImg: {
    height: moderateScale(13),
    width: moderateScale(13),
    resizeMode: 'contain',
    marginLeft: moderateScale(3),
  },
  customerName: {
    fontSize: moderateScale(15),
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontWeight: '500',
    flex: 1,
    marginLeft: moderateScale(20),
  },
  substituteTypeTxt: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    marginLeft: moderateScale(15),
  },
  substitteVal: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
  },
  businessSectiorHead: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(10),
  },
  businessSectorVal: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    flex: 1,
  },
  documentStatusVal: {
    color: colors.documentStatusValColorRed,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(12),
  },
  blackToolTipTxt: {
    color: colors.colorWhite,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(11),
    flex: 1,
  },
  uploadView: {
    backgroundColor: colors.lightPink,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: moderateScale(6),
    borderRadius: 3,
    borderWidth: 0.6,
    borderColor: colors.pinkBorder,
  },
  headingDocu: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  uploadTxt: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginLeft: 3,
  },
  mainDocumentListView: {
    flex: 1,
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
    // width: width - moderateScale(30),
    marginBottom: moderateScale(10),
    marginHorizontal: moderateScale(13),
    paddingTop: moderateScale(15),
    marginTop: moderateScale(5),
  },
  pdfDocImg: {
    height: moderateScale(25),
    width: moderateScale(30),
    resizeMode: 'contain',
  },
  renderDocView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: moderateScale(15),
  },
  rowCenterFlexView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  endView: {
    alignItems: 'flex-end',
  },
  mandatoryDocFlatList: {
    flex: 1,
    marginTop: moderateScale(10),
  },
  popOverContainer: {
    backgroundColor: colors.blackToolTip,
    borderRadius: 5,
  },
  docName: {
    color: colors.blackShade,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(13),
    flex: 1,
  },
  expiryOnTxt: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(10),
    flex: 1,
    marginTop: 2,
  },
  dateVal: {
    color: colors.fontColor,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(11),
    flex: 1,
    marginTop: 2,
  },
  sideCrossDwonArr: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginBottom: 2,
    marginRight: 2,
  },
  docDetailHead: {
    color: colors.grayNameHeading,
    fontFamily: fonts.PoppinsRegular,
    fontSize: moderateScale(10),
    marginTop: moderateScale(15),
  },
  docInfoBottomBoxLine: {
    height: 0.8,
    backgroundColor: colors.borderLineBox,
    marginTop: moderateScale(15),
  },
  frstRowMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(10),
    alignItems: 'center',
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
