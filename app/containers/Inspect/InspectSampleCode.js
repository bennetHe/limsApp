/**
 * 整机订单检测条码
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import { ListRow, Label, Toast, Button, PullPicker } from 'teaset';
import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

class InspectSampleCode extends Component {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "检测编码",
    showBackButton: true,
    headerRight: <Button
          titleStyle={{color:'#fff'}}
          onPress={()=>navigation.state.params.navigatePress()}
          title='添加'
          type='link'
        />,
    //gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  });
  constructor(props) {
      super(props);
      this.state = {
        orderSampleInfo: {},
        selectedIndex: null,
        count: 0
      }
      this.codes = [];
  }

  componentDidMount(){
    this.props.navigation.setParams({navigatePress: this.navigationRight.bind(this)})
    this.getOrderInspectDetail(); // 获取测试详情
  }


  navigationRight () {
    PullPicker.show(
      '选择编码',
      this.codes,
      this.state.selectedIndex,
      (item, index) => this.addSampleCode(item, index)
    );
  }

  /**
   * 添加样品条码
   * @param {[type]} code  添加的样品条码
   */
  addSampleCode (code, index) {

    const { item } = this.props.navigation.state.params;
    const { count, orderSampleInfo } = this.state;
    const omisrList = orderSampleInfo.omisrList ? orderSampleInfo.omisrList : [];

    // let newCode = Object.assign({}, omisrList[0]);
    // console.log(newCode,omisrList);
    const newCode = {
      key: count,
      orderId: orderSampleInfo.orderId,
      sampleCode: code,
      orderSampleResultId: null,
      standardDetailId: orderSampleInfo.standardDetailId,
      orderExperimentId :item.orderExperimentId,
      omippList: [
        {
          tableId: null,
          inspectBeginTime: null
        }
      ]
    }
    // newCode.orderId = orderSampleInfo.orderId;
    // newCode.sampleCode = item;
    // newCode.orderSampleResultId = null;
    // newCode.standardDetailId = orderSampleInfo.standardDetailId;

    orderSampleInfo.omisrList = [...omisrList, newCode]
    this.setState({
      orderSampleInfo,
      count: count+1
    })
  }

  /**
   * 删除条码
   * @param  {[type]} key 删除主键
   */
  removeSampleCode = (key) =>{

    const { orderSampleInfo } = this.state,
          omisrList = orderSampleInfo.omisrList;

     orderSampleInfo.omisrList = omisrList.filter(item => item.key !== key)
     this.setState({ orderSampleInfo });
  }

  /**
   * 获取检验过程详细
   */
  getOrderInspectDetail () {

    const { item } = this.props.navigation.state.params;

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

      let order = res.data;
      //console.log(order);
      this.codes = order.sampleCodes ? order.sampleCodes.split(",") : [];


      if(order.omisrList){
        // for (let [index,s] of order.omisrList.entries()) {
        //     s.key = index;
        //     s.orderExperimentId = item.orderExperimentId;
        // }
        order.omisrList.map((s,index)=>{
            s.key = index;
            s.orderExperimentId = item.orderExperimentId;
        })
        this.setState({
          count: order.omisrList.length,
        });
      }
      this.setState({
        orderSampleInfo: order,
      });
    },(error)=>{
      Toast.message(error);
    })
  }

  render() {
    let userInfo = this.props.userInfo;
    const { orderSampleInfo } = this.state;
    const omisrList = orderSampleInfo.omisrList ? orderSampleInfo.omisrList : [];
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1,marginTop: 5}}>
          {
            omisrList.map((o,index)=>{
              o.standardDetailName = orderSampleInfo.standardDetailName;
              return (
                <ListRow key = {index}
                  title={o.sampleCode}
                  detail={'填写结果'}
                  detailStyle = {{color: '#0e60d2'}}
                  swipeActions={[
                    o.omippList[0].inspectBeginTime
                    ? <ListRow.SwipeActionButton title='关闭'/>
                    : <ListRow.SwipeActionButton title='删除' type='danger'
                       onPress={()=>this.removeSampleCode(o.key)}
                      />

                  ]}
                  onPress={() => {
                    this.props.navigation.navigate('InspectSampleCodeDetail', {
                      codeInspect: o,
                      orderSampleInfo: orderSampleInfo
                    })
                  }}
                />
              )
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
)(InspectSampleCode)
