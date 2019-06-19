/**
 * 整机订单任务分配
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
import { connect } from 'react-redux';
import  OrderList from './OrderList';

class OrderAllocationList extends Component {
  static navigationOptions = {
    title: '任务分配',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
        orderStatus: { button: "C"}
      }
  }

  render() {
    let userInfo = this.props.userInfo;
    return (
      <View style={{flex: 1}}>
        <OrderList
          url = "limsrest/order/orderMachine/list"
          orderStatus = { this.state.orderStatus }
          navigation = {this.props.navigation}
          routeName = "OrderDetail"
        />
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
)(OrderAllocationList)
