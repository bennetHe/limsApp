/**
 * 导航
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';


import Icon from 'react-native-vector-icons/FontAwesome';

import Login from './containers/Login/Login';

import Lims from './containers/Lims';

import OrderReceiveList from './containers/OrderReceiveList';
import OrderDetail from './containers/OrderDetail';
import OrderReceive from './containers/OrderReceive';
import OrderRequestModification from './containers/OrderRequestModification';

import OrderAllocationList from './containers/OrderAllocationList'; // 整订单任务分配

import SampleCodeReceive from './containers/SampleCodeReceive';

import SampleReceiveCodeForm from './containers/SampleReceiveCodeForm';

import SampleReceiveList from './containers/SampleReceiveList';

import SampleTransferList from './containers/SampleTransferList';
import SampleCodeTransferDetail from './containers/SampleCodeTransferDetail';

import SampleUsesList from './containers/SampleUsesList';
import SampleCodeUsesDetail from './containers/SampleCodeUsesDetail';


import SampleBackList from './containers/SampleBackList';
import SampleCodeBackDetail from './containers/SampleCodeBackDetail';

import SampleReturnList from './containers/SampleReturnList'; // 样品退回
import SampleCodeReturnDetail from './containers/SampleCodeReturnDetail'; //样品退回详情

import OrderModuleReceiveList from './containers/OrderModule/OrderModuleReceiveList'; //模块订单接收
import OrderModuleTaskGrabList from './containers/OrderModule/OrderModuleTaskGrabList'; // 模块任务抢单


import OrderModuleDetail from './containers/OrderModule/OrderModuleDetail'; //模块订单详情

import OrderModuleRequestModification from './containers/OrderModule/OrderModuleRequestModification'; // 模块订单接收要求修改

import OrderFlowRecord from './containers/OrderFlowRecord'; // 订单流转记录

import OrderInspectList from './containers/Inspect/OrderInspectList'; // 整机订单检测
import OrderInspectProcessItems from './containers/Inspect/OrderInspectProcessItems'; //检测过程
import InspectSampleCode from './containers/Inspect/InspectSampleCode'; // 整机检测条码
import InspectSampleCodeDetail from './containers/Inspect/InspectSampleCodeDetail'; // 整机检测详情

import Calendars from './components/Calendars';
import Mag from './components/Mag';

import ImageUpload from './containers/ImageUpload';

import Scan from './containers/ScannerCodeScreen/scan';

import RNCamera from './containers/RNCamera';

import ScannerScreen from './containers/ScannerCodeScreen/ScannerScreen';
import ScanSuccess from './containers/ScannerCodeScreen/ScanSuccess';
import ScanConnectCode from './containers/ScannerCodeScreen/ScanConnectCode';

import InspectDevice from './containers/Inspect/InspectDevice';


import SearchList from './containers/Search/SearchList';

//整机报告待审核
import OrderReportAuditingList from './containers/Report/OrderReportAuditingList';

//整机报告审批
import OrderReportApprovalList from './containers/Report/OrderReportApprovalList';



// //引入要用到的跳转页面
const  Navigation = createStackNavigator({

    Lims:{ screen: Lims}, // 主页面
    Login: { screen: Login}, // 登录

    Calendars: { screen: Calendars}, // 日历
    Mag: { screen: Mag}, // 提示

    OrderFlowRecord: { screen: OrderFlowRecord }, //订单流转记录

    OrderReceiveList: { screen: OrderReceiveList}, // 订单接收
    OrderDetail: { screen: OrderDetail}, // 订单详情
    OrderReceive: { screen: OrderReceive }, // 接收订单
    OrderRequestModification: { screen: OrderRequestModification}, // 要求修改 / 拒绝接收

    OrderAllocationList: { screen: OrderAllocationList }, // 整机订单任务分配

    SampleCodeReceive: { screen: SampleCodeReceive }, // 接收样品
    SampleReceiveCodeForm: { screen: SampleReceiveCodeForm }, // 接收样品填写表单

    SampleReceiveList: { screen: SampleReceiveList }, // 样品收样

    SampleTransferList: { screen: SampleTransferList }, // 样品转交
    SampleCodeTransferDetail: { screen: SampleCodeTransferDetail }, // 样品转交详情

    SampleUsesList: { screen: SampleUsesList },  //样品领用
    SampleCodeUsesDetail: { screen: SampleCodeUsesDetail }, //样品领用详情

    SampleBackList: { screen: SampleBackList }, // 样品归还
    SampleCodeBackDetail: { screen: SampleCodeBackDetail }, // 样品归还详情

    SampleReturnList: { screen: SampleReturnList }, // 样品退回
    SampleCodeReturnDetail: { screen: SampleCodeReturnDetail }, // 样品退回详情

    OrderModuleReceiveList: { screen: OrderModuleReceiveList }, //模块订单接收
    OrderModuleTaskGrabList: { screen: OrderModuleTaskGrabList }, // 模块任务抢单

    OrderModuleDetail: { screen: OrderModuleDetail }, // 模块订单详情

    OrderModuleRequestModification: { screen: OrderModuleRequestModification }, // 模块订单接收要求修改

    OrderInspectList: { screen: OrderInspectList }, // 整机订单检测
    OrderInspectProcessItems: { screen: OrderInspectProcessItems }, // 整机检测过程
    InspectSampleCode: { screen: InspectSampleCode }, // 整机检测条码
    InspectSampleCodeDetail: { screen: InspectSampleCodeDetail }, // 整机检测条码详情

    InspectDevice: { screen: InspectDevice },


    ImageUpload: { screen: ImageUpload},

    Scan: { screen: Scan }, // 扫描页面
    RNCamera: { screen: RNCamera },
    ScannerScreen: { screen: ScannerScreen },
    ScanSuccess: { screen: ScanSuccess }, // 扫描成功页面
    ScanConnectCode: { screen: ScanConnectCode },  // 关联生产码
    SearchList: { screen: SearchList }, // 搜索条码
    OrderReportAuditingList: { screen: OrderReportAuditingList }, // 整机报告待审核
    OrderReportApprovalList: { screen: OrderReportApprovalList }, // 整机报告审批

  },{
    initialRouteName: 'Login', //初始页面
    mode: "card", // 页面切换模式: card: 普通app常用的左右切换, modal: 上下切换
    headerMode: 'screen', // 导航栏的显示模式: float: 无透明效果, 默认 ,screen: 有渐变透明效果, 如微信QQ的一样,none: 隐藏导航栏

    navigationOptions: {
      headerBackTitle: null, // 设置跳转页面左侧返回箭头后面的文字，默认是上一个页面的标题。可以自定义，也可以设置为null
      headerTitleStyle:{ //设置标题样式
        flex:1,
        textAlign: 'center'
      },
      headerStyle: { // 设置头部样式
        backgroundColor: '#0e60d2'
      },
      headerTintColor: '#fafafa' //设置导航栏文字颜色。
    },



  });


// 通过TabNavigator做路由映射
// const MainScreentNavigator=createBottomTabNavigator({
//
//    MainScreenT: { screen: MainScreenT,
//      navigationOptions: ({ navigation }) => ({
//                 headerTitle:'消息',//页面标题
//                 tabBarLabel: '消息',//导航栏该项标题
//                 tabBarVisible: true,
//                 tabBarIcon: ({ tintColor, focused }) => (  //tintColor -- 这个是  状态切换的时候给图标不同的颜色
//                       <Icon name="user" style={{color:tintColor,fontSize:16}}/>
//                 )
//             }),
//    },
//    Home: { screen: MainScreen,
//      navigationOptions: ({ navigation }) => ({
//        headerTitle: '发现',
//        tabBarLabel:'福利',
//        tabBarIcon:({focused}) => (
//          <Icon
//            name="rocket"
//            size={30}
//            color="red"
//            />
//            ),
//        }),
//      },
//     },{
//       animationEnabled: false, // 切换页面时不显示动画
//       tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
//       swipeEnabled: false, // 禁止左右滑动
//       backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
//       lazy: true,//是否根据需要懒惰呈现标签，而不是提前制作，意思是在app打开的时候将底部标签栏全部加载，默认false,推荐改成true哦
//       tabBarOptions: {
//         activeTintColor: 'red', // 文字和图片选中颜色
//         inactiveTintColor: '#979797', // 文字和图片默认颜色
//         showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
//         indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了
//         style: {
//           backgroundColor: '#fff', // TabBar 背景色
//         },
//         labelStyle: {
//           fontSize: 12, // 文字大小
//         },
//       }
//     });
//





export default Navigation;
