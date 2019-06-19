
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NetInfo,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as userInfoActionsFromOtherFile from '../../actions/userinfo'

import LoginComponent from '../../components/Login';
import  { httpFetch }  from '../../components/Fetch'
import { StackActions, NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons"
import { ListRow, Label, Toast, Overlay } from 'teaset';


class ScanSuccess extends Component {
  static navigationOptions = ({navigation, screenProps})=>({
    title: '扫描成功',
    headerLeft: <TouchableOpacity style={{width: px2dp(60),justifyContent:'center',alignItems:'center'}}
      onPress={()=>navigation.state.params.navigatePress()}
      >
        <Ionicons style={{fontSize: FONT_SIZE(28), color: "#fff"}}  name="ios-arrow-back" />
    </TouchableOpacity>
    // header: null,
    // gesturesEnabled: false
  });
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      orderInfo: {}, // 订单
      loading: false,
      producturelineName:'fridge', //产线
    }
    this.customKey = null;
  }
  navigationRight =()=>{
    const page = this.props.navigation.state.params.page;
    if(page == "list"){
      this.props.navigation.goBack();
    }else{
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Lims'})],
      });
      this.props.navigation.dispatch(resetAction);
    }
  }
  componentDidMount(){
    this.props.navigation.setParams({navigatePress:this.navigationRight})
    const { state,navigate } = this.props.navigation;
    //const code = ["S201812200188","HR20181210101A03015","a7ef61eebaab41fd8f31d0177aeeb338","0"],
    const code = state.params.code.split(","),
          orderId = code[2];
    if(code[3] === "0"){
      this.getOrderDetail(orderId);
    }

  }

  // 整机订单查询
  getOrderDetail (orderId) {
    this.showOverlay();
    const options = {
      url: "limsrest/order/orderMachine/f",
      method: "POST",
      parames:{
        orderId: orderId
      }
    }
    httpFetch(options,(res)=>{

      const order = res.data;
      this.getQueryClientProducturelineData(order.orderExperimentId);
      this.setState({
        orderInfo: order,
        loading: true
      });

       //Overlay.hide(this.customKey); //关闭遮罩
    },(error)=>{
      // this.setState({
      //   loading: false
      // });
      Overlay.hide(this.customKey);
      //Toast.message(error);
    })
  }

  //---查询委托方委托方对应实验室对应的产品线
  getQueryClientProducturelineData = (structureId) =>{
    let options= {
      url: "limsrest/order/orderMachine/queryClientProductureline",
      method: "POST",
      parames:{
        structureId: structureId
      }
    };
    httpFetch(options,(res)=>{
      this.setState({
        producturelineName:res.data.producturelineName
      })
      Overlay.hide(this.customKey); //关闭遮罩
    },(error)=>{
      // this.setState({
      //   loading: false
      // });
      Overlay.hide(this.customKey);
      //Toast.message(error);
    })
  }

  showOverlay() {
    const page = this.props.navigation.state.params.page;
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity= {null}
        >
        <View style={{backgroundColor: '#666', padding: px2dp(20), borderRadius: px2dp(10), alignItems: 'center'}}>
          <ActivityIndicator size='small' color='#fbfbfd' />
          <Label style={{color: '#fbfbfd', marginTop: px2dp(10)}} size='sm' text={page === "list" ? "加载中。。。" : "扫描成功。。。"} />
        </View>
      </Overlay.View>
    );
    this.customKey = Overlay.show(overlayView);
  }


  render() {
    const { state,navigate } = this.props.navigation;
    let { orderInfo, loading, producturelineName } = this.state;
    //const code = ["S201812200188","HR20181210101A03015","a7ef61eebaab41fd8f31d0177aeeb338","0"]; //params.code.split(",");
    const code = state.params.code.split(",");
    const arr = Object.keys(orderInfo);
    if(arr.length === 0){
       orderInfo = {
        orderCode: code[1],
        orderId: code[2],
        orderType: code[3],
        sampleCode: code[0]
      };
    }

    // let operations = <View>
    //                   <ListRow title='样品收样' detail="收样" onPress={() => {navigate('SampleCodeReceive',{ order: orderInfo})}} />
    //                   <ListRow title='样品领用' detail="领用" onPress={() => {navigate('SampleCodeUsesDetail',{ order: orderInfo})}} />
    //                   <ListRow title='样品转交' detail="转交" onPress={() => {navigate('SampleCodeTransferDetail',{ order: orderInfo})}} />
    //                   <ListRow title='样品归还' detail="归还" onPress={() => {navigate('SampleCodeBackDetail',{ order: orderInfo})}} />
    //                   <ListRow title='样品退回' detail="退回" onPress={() => {navigate('SampleCodeReturnDetail',{ order: orderInfo})}}/>
    //                   <ListRow title='关联生产码' detail="去扫描关联"
    //                     onPress={
    //                       () => {
    //                         producturelineName == 'fridge'
    //                         ? navigate('Scan',{ order: orderInfo, sampleCode: code[0]})
    //                         : Toast.message('目前只有整机能关联生产码');
    //                       }
    //                     }
    //                   />
    //                   <ListRow title='检测管理' detail="检测过程" onPress={() => {
    //                                 navigate('OrderInspectProcessItems',{ order: orderInfo,scanSampleCode: code[0]})}}
    //                             />
    //                 </View>;
    let operations = null;
    if(orderInfo.orderStatus === "order_machine_status_5" || orderInfo.inspectStatus === "inspect_status_0"){
      operations = <View>
                    <ListRow title='检测管理' detail="检测过程" onPress={() => {
                        navigate('OrderInspectProcessItems',{ order: orderInfo,scanSampleCode: code[0]})}}
                    />
                </View>
    }else if(orderInfo.sampleTotalCount !== 0){
      const newSampleCodelist = orderInfo.newOrderSampleCodelist ? orderInfo.newOrderSampleCodelist.split(',') : [];
      const reuseOrderSampleCodelist = orderInfo.reuseOrderSampleCodelist ? orderInfo.reuseOrderSampleCodelist.split(',') : [];

      const sampleCodelist = [...newSampleCodelist,...reuseOrderSampleCodelist];
      // 复用的样品不能关联生产码
      if(sampleCodelist.length > 0){
        //console.log("------",sampleCodelist,reuseOrderSampleCodelist);
        const target = sampleCodelist.filter(item => code[0] === item);
        if (target.length > 0) {
          operations = <View>
            <ListRow title='样品收样' detail="收样" onPress={() => {navigate('SampleCodeReceive',{ order: orderInfo})}} />
            <ListRow title='样品领用' detail="领用" onPress={() => {navigate('SampleCodeUsesDetail',{ order: orderInfo})}} />
            <ListRow title='样品转交' detail="转交" onPress={() => {navigate('SampleCodeTransferDetail',{ order: orderInfo})}} />
            <ListRow title='样品归还' detail="归还" onPress={() => {navigate('SampleCodeBackDetail',{ order: orderInfo})}} />
            <ListRow title='样品退回' detail="退回" onPress={() => {navigate('SampleCodeReturnDetail',{ order: orderInfo})}}/>
            <ListRow title='关联生产码' detail="去扫描关联"
              onPress={
                () => {
                  producturelineName == 'fridge'
                  ? navigate('Scan',{ order: orderInfo, sampleCode: code[0]})
                  : Toast.message('目前只有整机能关联生产码');
                }
              }
            />
            </View>
        }else{
          operations = <View>
              <ListRow title='样品收样' detail="收样" onPress={() => {navigate('SampleCodeReceive',{ order: orderInfo})}} />
              <ListRow title='样品领用' detail="领用" onPress={() => {navigate('SampleCodeUsesDetail',{ order: orderInfo})}} />
              <ListRow title='样品转交' detail="转交" onPress={() => {navigate('SampleCodeTransferDetail',{ order: orderInfo})}} />
              <ListRow title='样品归还' detail="归还" onPress={() => {navigate('SampleCodeBackDetail',{ order: orderInfo})}} />
              <ListRow title='样品退回' detail="退回" onPress={() => {navigate('SampleCodeReturnDetail',{ order: orderInfo})}}/>
            </View>
        }
      }

    }else{
      operations = <View>
          <ListRow title='样品收样' detail="收样" onPress={() => {navigate('SampleCodeReceive',{ order: orderInfo})}} />
          <ListRow title='样品领用' detail="领用" onPress={() => {navigate('SampleCodeUsesDetail',{ order: orderInfo})}} />
          <ListRow title='样品转交' detail="转交" onPress={() => {navigate('SampleCodeTransferDetail',{ order: orderInfo})}} />
          <ListRow title='样品归还' detail="归还" onPress={() => {navigate('SampleCodeBackDetail',{ order: orderInfo})}} />
          <ListRow title='样品退回' detail="退回" onPress={() => {navigate('SampleCodeReturnDetail',{ order: orderInfo})}}/>
        </View>
    }
    return (
      <View style={styles.container}>
        <ListRow title='订单编号' detail={code[1]}
          onPress={
            code[3] === "0" ?
            () => {this.props.navigation.navigate('OrderDetail', { order: orderInfo, scan: true})}
            : null}
        />
      <ListRow title='样品编码' detail={code[0]} />
        <View style={{marginTop: px2dp(20)}}/>
        {
          loading
          ? operations
          : null
        }

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection:'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    //backgroundColor: '#fff',
    marginTop:px2dp(10),
  },
});

  function mapStateToProps(state) {
      return {
          userInfo: state.userInfo
      }
  }

  function mapDispatchToProps(dispatch) {
      return {
          userInfoActions: bindActionCreators(userInfoActionsFromOtherFile, dispatch)
      }
  }
  export default connect(
      mapStateToProps,
      mapDispatchToProps
  )(ScanSuccess)
