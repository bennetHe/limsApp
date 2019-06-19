/**
 * 整机订单接收
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
import { SegmentedView, ActionSheet, Overlay } from 'teaset';
import { connect } from 'react-redux';
import  OrderList from './OrderList';

class OrderReceiveList extends Component {
  static navigationOptions = {
    title: '订单接收',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
        orderStatus: { button: "A"}
      }
  }

  render() {
    let userInfo = this.props.userInfo;
    return (
      <View style={{flex: 1}}>
        <SegmentedView style={{flex: 1}} type='projector'>
          <SegmentedView.Sheet title='新订单'>
            <OrderList
              url = "limsrest/order/orderMachine/list"
              orderStatus = { this.state.orderStatus }
              navigation = {this.props.navigation}
              routeName = "OrderDetail"
            />
          </SegmentedView.Sheet>
          <SegmentedView.Sheet title='修改完成'>
            <OrderList
              url = "limsrest/order/orderMachine/list"
              orderStatus = { {button: "B"} }
              navigation = {this.props.navigation}
              routeName = "OrderDetail"
            />
          </SegmentedView.Sheet>

        </SegmentedView>



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
)(OrderReceiveList)
