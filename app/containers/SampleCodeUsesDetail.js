/**
 * 领样条码
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome';
import {ListRow,Label} from 'teaset'
import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';
import {Toast, Button, Checkbox} from 'teaset';

let _this;

class SampleCodeUsesDetail extends Component {
  static navigationOptions = {
    title: '领样条码',
    headerRight: <Button
          titleStyle={{color:'#fff'}}
          onPress={()=>_this.commit()}
          title='提交'
          type='link'
        />,
    // header: null,
    // gesturesEnabled: false
  };
  constructor(props) {
    super(props);
    _this = this;
    this.list = [];
    this.state = {
      orderSample: {}, // 订单
      loading: false
    }

  }

  componentDidMount(){
    this.setState({
      loading: true
    })
    this.props.navigation.setParams({navigatePress:this.navigationRight})
    const { params } = this.props.navigation.state;
    const order = params.order;
    const options = {
      url: "limsrest/sample/manage/qts",
      method: "POST",
      parames:{
        orderId: order.orderId,
        orderType: order.orderType
      }
    }

    httpFetch(options,(res)=>{

      const orderSample = res.data;
      console.log(orderSample);
      this.setState({
        orderSample: orderSample,
        loading: false
      });
    },(error)=>{
      Toast.message(error)
    })
  }

  render() {
    let userInfo = this.props.userInfo;
    //console.log("-------",userInfo);
    const { orderSample, loading } = this.state;
    const osList = orderSample.swnList ? orderSample.swnList  : [];

    if(this.state.loading){
      return (
        <Loading loading={this.state.loading} text='加载中' />
      )
    }else{
      return (

        <View style={{flex: 1}}>
         <ScrollView style={styles.centent}>
            {
              osList.length > 0
              ? osList.map((item,index)=>{
                  return(
                    <ListRow
                      key={index}
                      title={

                        <Checkbox
                          title={item.sampleCodeId}
                          onChange={checked => this.checkbox(checked, item.sampleCodeId)}
                        />
                      }
                      detail= {'数量：'+item.sampleCount}
                      detailStyle = {{color: 'red'}}
                      bottomSeparator='full'
                    />
                  )
                })
              : <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                    <Text>无领样条码</Text>
                </View>

            }

         </ScrollView>

        </View>
      );
    }



  }


  checkbox (checked,sampleCode) {

    const { orderSample } = this.state;
    const swnList = orderSample.swnList;
    //console.log(checked,sampleCode,swnList);

    for (let s of swnList) {
      s.sampleOperateNum = 1;
      if(checked && sampleCode == s.sampleCodeId){

        this.list.push(s);
      }else if(!checked && sampleCode == s.sampleCodeId){

        this.list = this.list.filter(item => item.sampleCodeId !== sampleCode);
      }

    }
    //console.log(this.list);
  }

  commit(){
    const { state, navigate } = this.props.navigation;

    const { orderSample } = this.state;
    let falg = true;
    console.log(this.list.length);
    if(this.list.length === 0){
      Toast.stop('请勾选样品');
      falg = false;
    }

    if(falg){
      const _sampleInfo = {
        orderId: orderSample.orderId,
        operateStatus: "1",
        orderType: orderSample.orderType,
        sampleOperatePerson: orderSample.sampleOperatePerson,
        swnList: this.list,
      }

      const options = {
        url: "limsrest/sample/manage/cts",
        method: "POST",
        type: "json",
        parames: _sampleInfo //JSON.stringify(),
      }
      httpFetch(options,(res)=>{
        const mag = {
          icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
          title: '操作成功',
          magText: orderSample.orderCode+'领用成功！'
        }
        navigate('Mag', {
          mag: mag
        });

      },(error)=>{
        Toast.message(error)
      })

    }
  }



}


const styles = StyleSheet.create({
  centent: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

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
)(SampleCodeUsesDetail)
