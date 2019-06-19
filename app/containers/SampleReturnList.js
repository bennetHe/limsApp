/**
 * 样品退回
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

class SampleReturnList extends Component {
  static navigationOptions = {
    title: '样品退回',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
          orderStatus: { orderButtonStatus: "1"}
      }
  }



  render() {
    let userInfo = this.props.userInfo;
    return (
      <View style={{flex: 1}}>
        <OrderList
          url = "limsrest/order/info/listForOrder"
          orderStatus = { this.state.orderStatus }
          navigation = {this.props.navigation}
          routeName = "SampleCodeReturnDetail"
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
)(SampleReturnList)
