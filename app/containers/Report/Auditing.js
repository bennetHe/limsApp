
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { ListRow, Label, SegmentedView, ActionSheet, Button, Overlay } from 'teaset';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import Input  from '../../components/Input'
import  { httpFetch }  from '../../components/Fetch';

let customKey =  null;

//报告审核通过
export const orderReportAuditing  = (order,getOrder,showOverlay) => {
    let auditingText = '';
    let overlayView = (
      <Overlay.PullView side='top' modal={true} style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={{backgroundColor: '#fff', minWidth: '95%',padding: px2dp(20)}}>
          <ListRow
            title='后续质量控制说明'
            titleStyle={{color: '#999', marginBottom: 10}}
            detail={
              <Input
                value={auditingText}
                onChangeText={text => auditingText = text}
                multiline={true}
                style={{width: '100%',height: px2dp(200),textAlignVertical: 'top'}}
              />
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />
          <View style={styles.but}>
            <Button type='primary' title='确认' onPress={() => auditPass(order, auditingText, getOrder,showOverlay)} />
            <Button title='取消' onPress={() => close()} />
          </View>
        </View>
      </Overlay.PullView>
    );
    customKey = Overlay.show(overlayView);
}
  //整机报告审核通过
  auditPass =(order,text, getOrder,showOverlay)=> {
      showOverlay();
      close();

      getOrder();
      const options = {
        url: "limsrest/order/orderMachine/completeThirdPart",
        method: "POST",
        parames:{
          orderInspectInfoId: order.orderInspectInfoId,
          followQualityControlRemark: text,
          result: 'thirdTrue',
          reason: ''
        }
      }
      httpFetch(options,(res)=>{
        Toast.message("审核通过");
        getOrder();
      },(error)=>{
        Overlay.hide(this.customKey);
        Toast.message(error);
      })

  }
  // 隐藏键盘和弹出层
  close = () =>{
    Keyboard.dismiss();
    Overlay.hide(customKey);
  }

//报告审核要求修改
export const orderReportEdit  = (order,getOrder,showOverlay) => {
    let reasonText = '';
    let overlayView = (
      <Overlay.PullView side='top' modal={true} style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={{backgroundColor: '#fff', minWidth: '95%',padding: px2dp(20)}}>
          <ListRow
            title='修改理由'
            titleStyle={{color: '#999', marginBottom: 10}}
            detail={
              <Input
                value={reasonText}
                onChangeText={text => reasonText = text}
                multiline={true}
                style={{width: '100%',height: px2dp(200),textAlignVertical: 'top'}}
              />
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />
          <View style={styles.but}>
            <Button type='primary' title='确认' onPress={() => editPass(order, reasonText, getOrder,showOverlay)} />
            <Button title='取消' onPress={() => close()} />
          </View>
        </View>
      </Overlay.PullView>
    );
    customKey = Overlay.show(overlayView);
}
//整机报告要求修改
editPass =(order,text, getOrder,showOverlay)=> {
    showOverlay();
    close();
    const options = {
      url: "limsrest/order/orderMachine/completeThirdPart",
      method: "POST",
      parames:{
        orderInspectInfoId: order.orderInspectInfoId,
        followQualityControlRemark: '',
        result: 'thirdFalse',
        reason: text
      }
    }
    httpFetch(options,(res)=>{
      Toast.message("打回成功");
      getOrder();

    },(error)=>{
      Overlay.hide(this.customKey);
      Toast.message(error);
    })

}




//报告审批通过
export const orderReportApproval  = (order,getOrder,showOverlay) => {
  Alert.alert(
    '您确定要审批通过吗？',
    `后续质量控制说明：${order.orderMachineInspectInfo ? order.orderMachineInspectInfo.followQualityControlRemark ? order.orderMachineInspectInfo.followQualityControlRemark : '无' : '无'}`,
    [
      {text: '取消'},
      {text: '确定', onPress: () => reportApproval(order,getOrder)},
    ],
    { cancelable: false }
  )
}

//报告审批通过
reportApproval=(order,getOrder)=>{
  const options = {
    url: "limsrest/order/orderMachine/completeSecondPart",
    method: "POST",
    parames:{
      orderInspectInfoId: order.orderInspectInfoId,
      result: 'secondTrue',
      reason: ""
    }
  }
  httpFetch(options,(res)=>{
    Toast.message("审批通过");
    getOrder();

  },(error)=>{
    Toast.message(error);
  })
}



//报告审批要求修改
export const orderReportApprovalEdit  = (order,getOrder,showOverlay) => {
    let reasonText = '';
    let overlayView = (
      <Overlay.PullView side='top' modal={true} style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={{backgroundColor: '#fff', minWidth: '95%',padding: px2dp(20)}}>
          <ListRow title='后续质量控制说明'
             titleStyle={{color: '#999'}}
             detailStyle={{color: '#333'}}
             detail={order.orderMachineInspectInfo ? order.orderMachineInspectInfo.followQualityControlRemark ? order.orderMachineInspectInfo.followQualityControlRemark : '无' : '无'} />
          <ListRow
            title='修改理由'
            titleStyle={{color: '#999', marginBottom: 10}}
            detail={
              <Input
                value={reasonText}
                onChangeText={text => reasonText = text}
                multiline={true}
                style={{width: '100%',height: px2dp(200),textAlignVertical: 'top'}}
              />
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />
          <View style={styles.but}>
            <Button type='primary' title='确认' onPress={() => reportApprovalEdit(order, reasonText, getOrder,showOverlay)} />
            <Button title='取消' onPress={() => close()} />
          </View>
        </View>
      </Overlay.PullView>
    );
    customKey = Overlay.show(overlayView);
}

//报告审批要求修改
reportApprovalEdit =(order, reasonText, getOrder,showOverlay)=>{
  showOverlay();
  close();
  const options = {
    url: "limsrest/order/orderMachine/completeSecondPart",
    method: "POST",
    parames:{
      orderInspectInfoId: order.orderInspectInfoId,
      result: 'secondFalse',
      reason: reasonText
    }
  }
  httpFetch(options,(res)=>{
    Toast.message("打回成功");
    getOrder();

  },(error)=>{
    Overlay.hide(this.customKey);
    Toast.message(error);
  })
}


const styles = StyleSheet.create({
    but: {
      flexDirection:'row',
      justifyContent: 'space-around',
      marginTop: px2dp(10)
    }


})
