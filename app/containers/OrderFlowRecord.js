/**
 * 订单流转记录 整机和模块公用
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
  TouchableOpacity
} from 'react-native';
import { ListRow, Label } from 'teaset';
import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';


export default class OrderFlowRecord extends Component {
  static navigationOptions = {
    title: '订单流转记录',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
        flowData: [],
      }
  }


  componentDidMount(){
    const { order } = this.props.navigation.state.params;

    const options = {
      url: order.orderType === '0' ? 'limsrest/order/orderMachine/findFlowHis' : 'limsrest/order/info/findFlowHis',
      method: "POST",
      parames:{
        instanceId: order.instanceId,
      }
    }
    httpFetch(options,(res)=>{
      this.setState({
        flowData: res.data
      })

    },(error)=>{
      Toast.message(error)
    })

  }



  render() {
    const { flowData } = this.state;
    return (
      <View style={{flex: 1,marginTop: 5}}>
        <ListRow title={
          <View style={styles.flexContainer}>
            <View style={styles.cell}>
              <Label text='操作人' />
            </View>
            <View style={styles.cell}>
              <Label text='时间' />
            </View>
            <View style={styles.cell}>
              <Label text='动作' />
            </View>
            <View style={styles.cell}>
              <Label text='备注' />
            </View>
          </View>
        } titlePlace='top'   bottomSeparator='full'/>
        {
          flowData.map((item,index)=>{
            return(
              <ListRow key={index} title={
                <View style={styles.flexContainer}>
                  <View style={styles.cell}>
                    <Label type='detail' text={item.userName} />
                  </View>
                  <View style={styles.cell}>
                    <Label type='detail' text={item.endTime} />
                  </View>
                  <View style={styles.cell}>
                    <Label type='detail' text={item.approveName} />
                  </View>
                  <View style={styles.cell}>
                    <Label type='detail' text={item.reason} />
                  </View>
                </View>
              } titlePlace='top' bottomSeparator='full' />
            )
          })
        }
      </View>
    );

  }
}
const styles = StyleSheet.create({

  flexContainer: {
      flex: 1,
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'row',
  },
  cell: {
      flex: 1,
      height: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
  },
  welcome: {
      fontSize: 14,
      textAlign: 'center',
      margin: 10,
  },
});
