
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

import { ListRow, Label, Toast, Overlay, Button } from 'teaset';
import Input  from '../../components/Input'

class ScanConnectCode extends Component {
  static navigationOptions = {
    title: '关联生产码',
    // header: null,
    // gesturesEnabled: false
  };
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      orderInfo: {}, // 订单
      loading: false,
      printCode: '', //生产码
    }
    this.customKey = null;
  }
  componentDidMount(){
    const { produceCode } = this.props.navigation.state.params;
    this.setState({
      printCode: produceCode
    })
  }


  render() {
    const { printCode } = this.state;
    const { order, sampleCode, produceCode } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        {/*<ListRow title='生产编码' detail={produceCode} />*/}
        <ListRow title='生产编码' detail={
          <Input
            style={styles.styleInput}
            value={printCode}
            placeholder='请输入生产编码'
            onChangeText={text => this.setState({printCode: text})}
            />
        } bottomSeparator='full' />
        <ListRow title='样品编码' detail={sampleCode} />
        <View style={{marginTop: px2dp(20)}}/>
        <View style={{margin: px2dp(20)}}>
          <Button
            title='确认关联'
            style= {{ backgroundColor: '#0e60d2'}}
            titleStyle = {{ color: '#fff',paddingTop: px2dp(10),paddingBottom: px2dp(10)}}
            onPress={() => this.connectSave()}
            />
        </View>

      </View>
    );
  }
  connectSave =()=>{
    const { order, sampleCode } = this.props.navigation.state.params;
    const { printCode } = this.state;
    const sprList = [{
      printCode: printCode,
      sampleCode: sampleCode
    }],
    orderInfo = {
      orderId: order.orderId,
      departmentFirstCode: order.departmentFirstCode,
      sprList: sprList
    };

      const options = {
        url: "limsrest/order/orderMachine/saveSampleProductRestFromTel",
        method: "POST",
        type: "json",
        parames: orderInfo //JSON.stringify(),
      }
      httpFetch(options,(res)=>{
        const mag = {
          icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
          title: '操作成功',
          magText: '关联成功成功！'
        }
        this.props.navigation.navigate('Mag', {
          mag: mag
        });

      },(error)=>{
        Toast.message(error);
      })
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
  styleInput: {
    width: "80%",
    //height: 30,
    backgroundColor: '#fff',
    color: '#333',
     // borderColor: '#ccc',
     // borderWidth: 1,
     // borderRadius: 3,
    fontSize: FONT_SIZE(12),
    paddingVertical: 5,
    paddingHorizontal: 10,
    textAlign: 'right'
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
  )(ScanConnectCode)
