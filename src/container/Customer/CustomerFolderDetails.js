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
  Modal,
  findNodeHandle,
} from 'react-native';
import Share from 'react-native-share';
import { debounce } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Popover } from 'react-native-modal-popover';
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
import DocumentPicker from "react-native-document-picker";
import Tooltip from 'react-native-walkthrough-tooltip';

class CustomerFolderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stickHeaderHeight: 0,
      popoverAnchor: { x: 0, y: 0, width: 0, height: 0 },
      showPopover: false,
      profileImage: "",
      currentIndex: 0,
      document_upload_id: '',
      customerDetailAPIcall: '',
      filterOptions: [
        {
          id: 1,
          name: strings.all,
        },
        {
          id: 2,
          name: strings.compliance,
        },
        {
          id: 3,
          name: strings.nonCompliance,
        },
        {
          id: 4,
          name: strings.partialCompliance,
        },
      ],
      mandatoryDocArr: [],
      mandatoryDocType: [],
      otherDocArr: [],
      docDetail: [],
      toolTipVisible: false,
      isLoading: false,
      modalVisible: false,
      documentStatus: "",
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
    let mandatoryDocArr = this.state.mandatoryDocArr;
    let otherDocArr = this.state.otherDocArr;
    for (let index = 0; index < mandatoryDocArr.length; index++) {
      mandatoryDocArr[index].isOpen = false;
    }
    for (let index = 0; index < otherDocArr.length; index++) {
      otherDocArr[index].isOpen = false;
    }
    this.setState({
      mandatoryDocArr: mandatoryDocArr,
      otherDocArr: otherDocArr,
    });
    this.getCustomerFolderList();
  }

  getCustomerFolderList() {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      this.props
        .customerFolderDetailsExpand(
          globals.tokenValue,
          this.props.customerDetailID.id
        )
        .then(async () => {
          const { customerFolderDetailsExpandData, msgError } = this.props;
          let value = FunctionUtils.unauthMsgHandling(msgError);
          if (customerFolderDetailsExpandData) {
            this.setState({
              isLoading: false,
              customerDetailAPIcall: customerFolderDetailsExpandData,
              documentStatus: customerFolderDetailsExpandData.document_status,
              otherDocArr: customerFolderDetailsExpandData.other_docs,
              mandatoryDocArr: customerFolderDetailsExpandData.mandatory_docs,
              mandatoryDocType:
                customerFolderDetailsExpandData.mandatory_doc_types,
            });
          } else if (value && value == 'Unauthenticated.') {
            FunctionUtils.clearLogin();
          } else {
            this.setState({ isLoading: false });
            FunctionUtils.showToast(customerFolderDetailsExpandData.message);
          }
        });
    } else {
      this.setState({ isLoading: false });
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  shareAllBtnPress(item) {
    let itemName = item ? item.file_name : '';
    let itemUrl = item ? item.doc_urle : '';
    const shareOptions = {
      title: strings.AppName,
      message: 'document name :' + itemName,
      url: itemUrl,
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

  openDocBottomViewMandatoryDoc(item, index) {
    item.isOpen = !item.isOpen;
    this.setState({ mandatoryDocArr: this.state.mandatoryDocArr });
  }

  expandCustomerFolder(item) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
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

  openexpandedDesignView(item) {
    return (
      <View
        style={{
          // marginBottom: moderateScale(75),
          paddingBottom: moderateScale(10),
          paddingHorizontal: moderateScale(15),
        }}
      >
        <View style={styles.docInfoBottomBoxLine} />
        {this.mainExpandingDetails(item)}
        <Image
          source={images.downCrossReverseArr}
          style={[styles.sideCrossDwonArr, { left: moderateScale(15) }]}
        />
      </View>
    );
  }

  async mandatoryDocPicker(type) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv, DocumentPicker.types.xls],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      this.uploadMandatoryAPICall(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("error -----", err);
      } else {
        throw err;
      }
    }
  }

  async otherDocPicker(type) {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.csv, DocumentPicker.types.xls],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      this.uploadOtherAPICall(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("error -----", err);
      } else {
        throw err;
      }
    }
  }

  uploadOtherAPICall(docPath) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      var documentPath = {
        uri: docPath.uri,
        type: docPath.type,
        name: docPath.name,
      };
      formData.append('customer_id', this.props.customerDetailID.id);
      formData.append('doc_file', documentPath);
      this.props.otherDocUploadAP(formData).then(async () => {
        const { otherDocUpload, error, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (otherDocUpload && errorData == '' && msgError == '') {
          FunctionUtils.showToast(otherDocUpload.message);
          this.getCustomerFolderList();
          this.setState({ isLoading: false });
        } else if (errorData && errorData.customer_id) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.customer_id[0]);
        } else if (errorData && errorData.doc_file) {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(errorData.doc_file[0]);
        } else if (value && value == "Unauthenticated.") {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(otherDocUpload.message);
          this.getCustomerFolderList();
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  uploadMandatoryAPICall(docPath) {
    const isConnected = NetworkUtils.isNetworkAvailable();
    if (isConnected) {
      this.setState({ isLoading: true });
      const formData = new FormData();
      var documentPath = {
        uri: docPath.uri,
        type: docPath.type,
        name: docPath.name,
      };
      formData.append('document_type_id', this.state.document_upload_id);
      formData.append('customer_id', this.props.customerDetailID.id);
      formData.append('doc_file', documentPath);
      formData.append('doc_status', this.state.documentStatus);
      this.props.mandatoryDocUploadAP(formData).then(async () => {
        const { mandatoryDocUpload, error, msgError } = this.props;
        let value = FunctionUtils.unauthMsgHandling(msgError);
        let errorData;
        {
          error ? (errorData = JSON.parse(error)) : null;
        }
        if (mandatoryDocUpload && errorData == '' && msgError == '') {
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
        } else if (value && value == "Unauthenticated.") {
          this.setState({ isLoading: false });
          FunctionUtils.clearLogin();
        } else {
          this.setState({ isLoading: false });
          FunctionUtils.showToast(mandatoryDocUpload.message);
          this.getCustomerFolderList();
        }
      });
    } else {
      FunctionUtils.showToast(strings.internetNotAvail);
    }
  }

  // /* Upload Picture */
  showActionSheet = () => {
    this.ActionSheet.show();
  };

  timeFormatechange(item) {
    let date = FunctionUtils.dateSeparate(item);
    return date;
  }

  mainExpandingDetails(item) {
    return (
      <View style={{ flexDirection: "row", top: moderateScale(10) }}>
        <View style={{ width: "50%" }}>
          <Text style={styles.businessSectiorHead}>{strings.uploadedBy}</Text>
          {item && item.uploadedBy ? (
            <Text numberOfLines={1} style={styles.businessSectorVal}>
              {item.uploadedBy.first_name} {item.uploadedBy.last_name}
            </Text>
          ) : null}
          <View style={{ marginTop: moderateScale(20) }}>
            <Text style={styles.businessSectiorHead}>{strings.uploadedOn}</Text>
            <Text numberOfLines={1} style={styles.businessSectorVal}>
              {this.timeFormatechange(item.created_at)}
            </Text>
          </View>
        </View>
        {item && item.documentType ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.businessSectiorHead}>{strings.docType}</Text>
            <Text numberOfLines={1} style={styles.businessSectorVal}>
              {item.documentType.document_name}
            </Text>
            <Text style={styles.businessSectiorHead}>
              {strings.signatureType}
            </Text>
            <Text numberOfLines={1} style={styles.businessSectorVal}>
              {item.documentType.is_customer_signatrue != null
                ? strings.yes
                : strings.no}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  openDocBottomViewOtherDoc(item, index) {
    this.expandCustomerFolder(item);
    item.isOpen = !item.isOpen;
    this.setState({ otherDocArr: this.state.otherDocArr });
  }

  _renderMandatoryDocumentList(item, index) {
    return (
      <TouchableOpacity
        hitSlop={ConstantUtils.hitSlop.twenty}
        style={styles.mainDocumentListView}
        onPress={() => this.openDocBottomViewOtherDoc(item, index)}
      >
        <View style={styles.renderDocView}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.rowCenterFlexView}>
              <Image source={images.pdfDoc} style={styles.pdfDocImg} />
              <View style={{ flexShrink: 1, marginLeft: moderateScale(10) }}>
                <Text numberOfLines={1} style={styles.docName}>
                  {item.document_name}
                </Text>
                {item.expire_date != null ? (
                  <Text style={styles.expiryOnTxt}>
                    Expired On :
                    <Text
                      style={[
                        styles.dateVal,
                        {
                          color: this.expiryDateChecking(item.expire_date)
                            ? colors.partialComp
                            : colors.documentStatusValColorGreen,
                        },
                      ]}
                    >
                      {" "}
                      {item.expire_date}
                    </Text>
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.shareAllBtnPress(item);
              }}
            >
              <Image source={images.share} style={styles.shareImg} />
            </TouchableOpacity>
          </View>
        </View>
        {item.isOpen ? (
          this.openexpandedDesignView(item)
        ) : (
          <Image
            source={images.crossArrowDown}
            style={styles.sideCrossDwonArr}
          />
        )}
      </TouchableOpacity>
    );
  }

  expiryDateChecking(date) {
    var strtDt = new Date();
    var endDt = new Date(date);
    if (endDt <= strtDt) {
      return true;
    } else {
      return false;
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
            <Image source={images.pdfDoc} style={styles.pdfDocImg} />
            <View style={{ marginLeft: moderateScale(10), flexShrink: 1 }}>
              <Text numberOfLines={1} style={styles.docName}>
                {item.document_name}
              </Text>
              {item.expire_date != null ? (
                <Text style={styles.expiryOnTxt}>
                  Expired On :
                  <Text
                    style={[
                      styles.dateVal,
                      {
                        color: this.expiryDateChecking(item.expire_date)
                          ? colors.partialComp
                          : colors.documentStatusValColorGreen,
                      },
                    ]}
                  >
                    {" "}
                    {item.expire_date}
                  </Text>
                </Text>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.shareAllBtnPress(item);
            }}
          >
            <Image source={images.share} style={styles.shareImg} />
          </TouchableOpacity>
        </View>
        {item.isOpen ? (
          this.openexpandedDesignView(item)
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

  setFilterOptionsView = (e) => {
    const handle = findNodeHandle(this.refFilterOptionView);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({ popoverAnchor: { x, y, width, height } });
      });
    }
  };

  toggleModal(visible, item) {
    this.setState({ modalVisible: visible });
    if (item != undefined) {
      this.setState({ document_upload_id: item.id });
      this.mandatoryDocPicker();
    }
  }

  toolTipIconDesign(data) {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.setState({
              toolTipVisible: !this.state.toolTipVisible,
            })
          }
          style={{
            borderWidth: 0,
            left: moderateScale(-30),
            top: moderateScale(2),
          }}
        >
          <Image
            source={images.info}
            style={{
              width: moderateScale(15),
              height: moderateScale(15),
            }}
          />
        </TouchableOpacity>
        <Tooltip
          isVisible={this.state.toolTipVisible}
          animated={true}
          arrowSize={{
            width: moderateScale(60),
            height: moderateScale(80),
          }}
          contentStyle={{
            backgroundColor: colors.toolTipBackColor,
            borderRadius: moderateScale(6),
            top: moderateScale(-30),
          }}
          supportedOrientations={['portrait', 'landscape']}
          content={
            <View
              style={{
                width: moderateScale(200),
                height: moderateScale(90),
                backgroundColor: colors.toolTipBackColor,
                padding: moderateScale(5),
              }}
            >
              <Text style={{ color: colors.colorWhite }}>{data}</Text>
            </View>
          }
          onClose={() => this.setState({ toolTipVisible: false })}
        />
      </View>
    );
  }

  render() {
    const {
      isLoading,
      filterOptions,
      customerDetailAPIcall,
      otherDocArr,
      mandatoryDocArr,
      mandatoryDocType,
    } = this.state;
    return (
      <View style={styles.flexView}>
        <ParallaxScrollView
          backgroundColor={colors.white}
          isForegroundTouchable={true}
          contentBackgroundColor={colors.white}
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
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.customerFolderDetails}
            />
          )}
          renderStickyHeader={() => (
            <ParallaxHeader
              leftIconPress={() => Actions.pop()}
              icon={images.backLeftArr}
              headerTxtMain={strings.customerFolderDetails}
            />
          )}
        >
          <SafeAreaView>
            <View style={styles.mainView}>
              <View style={styles.thirdBoxView}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "50%" }}>
                    <Text style={styles.businessSectiorHead}>
                      {strings.businessName}
                    </Text>
                    <Text numberOfLines={1} style={styles.businessSectorVal}>
                      {this.props.customerDetailID &&
                      this.props.customerDetailID.business_name !== null
                        ? this.props.customerDetailID.business_name
                        : strings.NA}
                    </Text>
                    <View style={{ marginTop: moderateScale(20) }}>
                      <Text style={styles.businessSectiorHead}>
                        {strings.documentStatus}
                      </Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.businessSectorVal,
                            {
                              color:
                                customerDetailAPIcall.document_status ==
                                strings.nonCompl
                                  ? colors.documentStatusValColorRed
                                  : customerDetailAPIcall.document_status ==
                                    strings.partialComp
                                  ? colors.partialComp
                                  : colors.documentStatusValColorGreen,
                            },
                          ]}
                        >
                          {customerDetailAPIcall.document_status}
                        </Text>
                        {customerDetailAPIcall.document_status ==
                        strings.nonCompl
                          ? this.toolTipIconDesign(
                              strings.nonComplienceToolTipData
                            )
                          : customerDetailAPIcall.document_status ==
                            strings.partialComp
                          ? this.toolTipIconDesign(
                              strings.partialComplienceToolTipData
                            )
                          : null}
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.businessSectiorHead}>
                      {strings.customerName}
                    </Text>
                    <Text numberOfLines={1} style={styles.businessSectorVal}>
                      {this.props.customerDetailID &&
                      this.props.customerDetailID.first_name !== null
                        ? this.props.customerDetailID.first_name
                        : strings.NA}{' '}
                      {this.props.customerDetailID &&
                      this.props.customerDetailID.last_name !== null
                        ? this.props.customerDetailID.last_name
                        : strings.NA}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.secondBoxMainView}>
                <Text style={styles.substituteTypeTxt}>
                  {strings.subjectType + " : "}
                  <Text style={styles.substitteVal}>{"Society"}</Text>
                </Text>
              </View>
              <Modal
                animationType={"slide"}
                style={{ borderWidth: 10 }}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ modalVisible: false });
                  }}
                  style={styles.modal}
                >
                  <View style={styles.mainBoxView}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {strings.mandatoryDocuments}
                    </Text>
                    {mandatoryDocType.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            this.toggleModal(!this.state.modalVisible, item);
                          }}
                        >
                          <Text style={styles.text}>{item.document_name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              </Modal>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.docUploadTypeTxt}>
                  {strings.mandatoryDocuments}
                </Text>
                {customerDetailAPIcall.document_status === strings.nonCompl ||
                customerDetailAPIcall.document_status ===
                  strings.partialComp ? (
                  <View
                    style={{
                      width: "30%",
                      top: moderateScale(8),
                      justifyContent: "center",
                      borderRadius: moderateScale(10),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.toggleModal(true)}
                      style={styles.uploadView}
                    >
                      <Image
                        source={images.upload}
                        style={styles.documentStatusImg}
                      />
                      <Text style={styles.uploadTxt}>{strings.upload}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <FlatList
                data={mandatoryDocArr}
                renderItem={({ item, index }) =>
                  this._renderMandatoryDocumentList(item, index)
                }
                style={styles.mandatoryDocFlatList}
                showsVerticalScrollIndicator={false}
                bounces={false}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.docUploadTypeTxt}>
                {strings.otherDocuments}
              </Text>
              <TouchableOpacity
                onPress={() => this.otherDocPicker()}
                style={[
                  styles.uploadView,
                  { width: "30%", left: moderateScale(50) },
                ]}
              >
                <Image
                  source={images.upload}
                  style={styles.documentStatusImg}
                />
                <Text style={styles.uploadTxt}>{strings.upload}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={otherDocArr}
              renderItem={({ item, index }) =>
                this._renderOtherDocumentList(item, index)
              }
              style={styles.mandatoryDocFlatList}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
            />
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
          btnTxt={strings.shareall}
          onPressBtn={() => this.shareAllBtnPress('')}
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
    customerFolderDetailsExpandData:
      state.customerReducer.customerFolderDetailsExpandData, //accessing the redux state
    isloading: state.customerReducer.isLoading,
    error: state.ticketReducer.error, //accessing the redux state
    mandatoryDocUpload: state.customerReducer.mandatoryDocUpload, //accessing the redux state
    msgError: state.customerReducer.msgError, //accessing the redux state
    otherDocUpload: state.customerReducer.otherDocUpload, //accessing the redux state
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerFolderDetails);

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainView: {
    marginTop: moderateScale(10),
    flex: 1,
  },
  modal: {
    alignItems: 'center',
    flex: 1,
    padding: 100,
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  mainBoxView: {
    alignItems: "center",
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
    padding: 20,
    // paddingHorizontal: 10,
    // marginHorizontal: moderateScale(5),
    // marginBottom: moderateScale(15),
    marginTop: moderateScale(160),
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
  docUploadTypeTxt: {
    color: colors.colorBlack,
    fontFamily: fonts.PoppinsSemiBold,
    fontSize: moderateScale(18),
    top: moderateScale(10),
    marginRight: moderateScale(15),
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
    borderRadius: 8,
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
  shareImg: {
    height: moderateScale(20),
    width: moderateScale(20),
    resizeMode: 'contain',
    tintColor: colors.redColor,
    top: moderateScale(5),
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
