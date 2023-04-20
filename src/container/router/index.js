import React, { Component } from "react";
import { Dimensions, Text, Image, View, StyleSheet } from "react-native";
import {
  Scene,
  Router,
  Tabs,
  Stack,
  ActionConst,
  Drawer,
} from "react-native-router-flux";
import LoginScreem from "../Auth/Login";
import UniqueId from "../Auth/UniqueId";
import ForgotPassword from "../Auth/ForgotPassword";
import Dashboard from "../Dashboard/Dashboard";
import CustomerList from "../Customer/CustomerList";

import AddCustomer from "../Customer/AddCustomer";
import NewTransaction from "../Customer/NewTransaction";
import ModifyCustomer from "../Customer/ModifyCustomer";
import CompleteModifyCustomer from "../Customer/CompleteModifyCustomer";

import ViewCustomer from "../Customer/ViewCustomer";
import ManuallyAddCustomer from "../Customer/ManuallyAddCustomer";
import CompleteManuallyAddCustomer from "../Customer/CompleteManuallyAddCustomer";

import SideMenu from "../Drawer/SideMenu";
import MyProfile from "../Profile/MyProfile";
import EditProfile from "../Profile/EditProfile";
import ChangePassword from "../Profile/ChangePassword";
import CustomerFolder from "../Customer/CustomerFolder";
import CustomerFolderDetails from "../Customer/CustomerFolderDetails";
import * as globals from "../../utils/globals";
import { moderateScale } from "../../utils/ResponsiveUi";
import TicketList from "../Support/Ticket/Tickets";
import TicketCreate from "../Support/Ticket/TicketCreate";
import TicketDetails from "../Support/Ticket/TicketDetails";
import ChatList from "../Support/Chatbot/ChatList";
import ChatDetails from "../Support/Chatbot/ChatDetails";
import Risk from "../Risk/Risk";
import Otp from "../Auth/Otp";
import Notifications from "../Notifications/Notifications";
import { images, colors } from "../../themes";
import strings from "../../themes/strings";
import AllNews from "../Dashboard/AllNews";

const { width } = Dimensions.get("window");

class TabIcon extends React.Component {
  render() {
    return (
      <View style={styles.tabIconView}>
        <Image
          source={this.getTabIcon(this.props.title, this.props.focused)}
          style={styles.tabIcon}
        />
        {this.props.focused ? <View style={styles.selectedTabDot} /> : null}
        {/* <Text
          style={{
            marginTop: moderateScale(4),
            fontSize: moderateScale(10),
            color: this.props.focused ? colors.colorPrimary : colors.colorGray,
          }}
        >
          {this.props.title}
        </Text> */}
      </View>
    );
  }

  getTabIcon(title, isFocused) {
    if (title === strings.addCustomer) {
      return isFocused ? images.selectedUserProfile : images.unselectAddUser;
    } else if (title === strings.newTran) {
      return isFocused ? images.selectedFrame : images.unselectedFrame;
    } else if (title === strings.modifyCust) {
      return isFocused ? images.selectedEditUser : images.unselectEditUser;
    } else {
      return images.unselectAddUser;
    }
  }
}

export default class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene
            initial={!globals.isLoggedIn}
            key="UniqueId"
            gesturesEnabled={false}
            component={UniqueId}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="Login"
            component={LoginScreem}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
            // type={ActionConst.RESET}
          />
          <Scene
            key="ForgotPassword"
            component={ForgotPassword}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="EditProfile"
            component={EditProfile}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="ChangePassword"
            component={ChangePassword}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="ViewCustomer"
            component={ViewCustomer}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="CustomerFolderDetails"
            component={CustomerFolderDetails}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="ManuallyAddCustomer"
            component={ManuallyAddCustomer}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="CompleteManuallyAddCustomer"
            component={CompleteManuallyAddCustomer}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Tabs
            key={"AddCustomer"}
            routeName={"AddCustomer"}
            showLabel={false}
            hideNavBar={true}
            tabBarStyle={styles.tabStyle}
          >
            <Scene
              key={strings.addCustomer}
              hideNavBar={true}
              title={strings.addCustomer}
              component={AddCustomer}
              icon={TabIcon}
            />
            <Scene
              key={strings.newTran}
              hideNavBar={true}
              title={strings.newTran}
              component={NewTransaction}
              icon={TabIcon}
            />
            <Scene
              key={strings.modifyCust}
              hideNavBar={true}
              title={strings.modifyCust}
              component={ModifyCustomer}
              icon={TabIcon}
            />
          </Tabs>
          <Scene
            key="TicketCreate"
            component={TicketCreate}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="TicketDetails"
            component={TicketDetails}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="ChatDetails"
            component={ChatDetails}
            title=""
            hideNavBar={true}
          />
          <Scene
            key="AllNews"
            component={AllNews}
            gesturesEnabled={false}
            title=""
            hideNavBar={true}
          />
          <Scene key="Otp" component={Otp} title="" hideNavBar={true} />
          <Scene
            key="CompleteModifyCustomer"
            component={CompleteModifyCustomer}
            title=""
            hideNavBar={true}
          />
          <Drawer
            hideNavBar
            initial={globals.isLoggedIn}
            drawerLockMode="locked-closed"
            drawerPosition="left"
            key="Main"
            contentComponent={SideMenu}
            drawerWidth={width - moderateScale(50)}
            {...this.props}
            drawerBackgroundColor="transparent"
          >
            <Scene
              key="Dashboard"
              component={Dashboard}
              title=""
              hideNavBar={true}
              // type={ActionConst.RESET}
            />
            <Scene
              key="MyProfile"
              component={MyProfile}
              title=""
              hideNavBar={true}
            />
            <Scene
              key="CustomerList"
              component={CustomerList}
              title=""
              // onEnter={() => console.log("Entered")}
              hideNavBar={true}
            />
            <Scene
              key="TicketList"
              component={TicketList}
              title=""
              hideNavBar={true}
            />
            <Scene
              key="ChatList"
              component={ChatList}
              title=""
              hideNavBar={true}
            />
            <Scene
              key="Notifications"
              component={Notifications}
              title=""
              hideNavBar={true}
            />
            <Scene
              key="CustomerFolder"
              component={CustomerFolder}
              title=""
              hideNavBar={true}
            />
            <Scene key="Risk" component={Risk} title="" hideNavBar={true} />
          </Drawer>
        </Stack>
      </Router>
    );
  }
}
const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: colors.blackShade,
    height: moderateScale(70),
    borderWidth: 0,
    marginRight: moderateScale(-1),
    marginBottom: moderateScale(-10),
    borderTopLeftRadius: moderateScale(15),
    borderTopRightRadius: moderateScale(15),
    // borderColor: colors.lightGray,
    //paddingTop: moderateScale(16)
  },
  view_tab_item: {
    backgroundColor: colors.colorWhite,
    width: "100%",
    height: moderateScale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  image_tab: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  tabIconView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    borderRadius: moderateScale(10),
    justifyContent: "center",
  },
  tabIcon: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  selectedTabDot: {
    width: moderateScale(8),
    top: moderateScale(10),
    height: moderateScale(8),
    backgroundColor: colors.colorWhite,
    borderRadius: moderateScale(20),
    borderWidth: 0,
  },
});
