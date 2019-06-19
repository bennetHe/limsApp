/**
 * 整机订单检测项目
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';
import { ListRow, Label, Toast, Overlay } from 'teaset';

class OrderInspectProcessItems extends Component {
  static navigationOptions = {
    title: '检测项目',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
        orderInspect: {},
        omasdList: []
      }
  }

  componentDidMount(){
    this.getOrderInspectDetail();
  }

  getOrderInspectDetail () {

    const { order } = this.props.navigation.state.params;

    const orderId = order.orderId
    const options = {
      url: "limsrest/inspect/machine/info/getOrderBaseInfo",
      method: "POST",
      parames:{
        orderId: orderId
      }
    }
    httpFetch(options,(res)=>{

      const order = res.data;
      const omasdList = order.orderInfo.omasdList;
      for (let o of omasdList) {
        o.orderExperimentId = order.orderInfo.orderExperimentId;
      }
      this.setState({
        orderInspect: order,
        omasdList
      });
    },(error)=>{
      Toast.message(error);
    })
  }

  /**
   * 扫码过来的点击直接进检测过程
   * @param  {[type]} item           检测项目
   * @param  {[type]} scanSampleCode 扫一扫得到的条码
   */
  scanSampleInspectProcessItem = (item, scanSampleCode) => {
    this.showOverlay();
    const orderMachineInspectResult ={
      orderId:item.orderId,
      standardDetailId:item.standardDetailId,
      orderExperimentId:item.orderExperimentId
    };
    const options = {
      url: "limsrest/inspect/machine/result/queryResult/",
      method: "POST",
      parames:orderMachineInspectResult
    }

    httpFetch(options,(res)=>{

      let orderSampleInspect = res.data;

      //新生产一个条码测试项目对象
      const newCode = {
        key: 0,
        orderId: orderSampleInspect.orderId,
        sampleCode: scanSampleCode,
        orderSampleResultId: null,
        standardDetailId: orderSampleInspect.standardDetailId,
        standardDetailName: orderSampleInspect.standardDetailName,
        orderExperimentId :item.orderExperimentId,
        omippList: [
          {
            tableId: null,
            inspectBeginTime: null
          }
        ]
      }

      if(orderSampleInspect.omisrList){ //是否已经在检测了

        orderSampleInspect.omisrList.map((s,index)=>{
            s.key = index;
            s.orderExperimentId = item.orderExperimentId;
            s.standardDetailName = orderSampleInspect.standardDetailName;
        })

        const omisrObj = orderSampleInspect.omisrList.filter(item => scanSampleCode === item.sampleCode)[0];
        if(!omisrObj){ // 如果正在检测的没有此条码项目 就在创建一个
          orderSampleInspect.omisrList.push(newCode)
        }
      }else{
        orderSampleInspect.omisrList = [newCode];
      }
      //console.log(orderSampleInspect);
      const omisr = orderSampleInspect.omisrList.filter(item => scanSampleCode === item.sampleCode)[0];

      if(omisr){
        this.props.navigation.navigate('InspectSampleCodeDetail', {
          codeInspect: omisr,
          orderSampleInfo: orderSampleInspect
        })
      }
      Overlay.hide(this.customKey); //关闭遮罩

    },(error)=>{
      Overlay.hide(this.customKey); //关闭遮罩
      Toast.message(error);
    })
  }

  showOverlay() {
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity= {null}
        >
        <View style={{backgroundColor: '#666', padding: px2dp(20), borderRadius: px2dp(10), alignItems: 'center'}}>
          <ActivityIndicator size='small' color='#fbfbfd' />
          <Label style={{color: '#fbfbfd', marginTop: px2dp(10)}} size='sm' text="扫描成功。。。" />
        </View>
      </Overlay.View>
    );
    this.customKey = Overlay.show(overlayView);

  }

  render() {
    let userInfo = this.props.userInfo;
    const { orderInspect, omasdList } = this.state;
    const { scanSampleCode } = this.props.navigation.state.params;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1,marginTop: 5}}>
          {
            omasdList.map((o,index)=>{
              let bgColor = '#666';
              if(o.testResult === '检测中'){
                bgColor = '#f5ce1a';
              }else if(o.testResult === '检测完成'){
                bgColor = '#31c27c';
              }
              if(scanSampleCode){
                return(
                  <ListRow key = {index}
                    title={o.machineDetailName}
                    detail={o.testResult ? scanSampleCode+"-"+o.testResult : scanSampleCode}
                    detailStyle = {{color: bgColor}}
                    onPress={() => {this.scanSampleInspectProcessItem(o,scanSampleCode)}}
                  />
                )
              }else{
                return(
                  <ListRow key = {index}
                    title={o.machineDetailName}
                    detail={o.testResult}
                    detailStyle = {{color: bgColor}}
                    onPress={() => {this.props.navigation.navigate('InspectSampleCode', { item: o})}}
                  />
                )
              }

            })
          }

       </ScrollView>
    </View>
    );

  }
}


function mapStateToProps(state) {
    //console.log(state.userInfo);
    return {
        userInfo: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderInspectProcessItems)
