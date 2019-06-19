/**
 * 样品归还
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
import {Toast, Button, Checkbox, Select} from 'teaset';

let _this;

class SampleCodeBackDetail extends Component {
  static navigationOptions = {
    title: '归样条码',
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
    this.items = [];
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
      url: "limsrest/sample/manage/qrs",
      method: "POST",
      parames:{
        orderId: order.orderId,
        orderType: order.orderType
      }
    }

    httpFetch(options,(res)=>{

      const orderSample = res.data;
      console.log(orderSample);
      this.getLocation(orderSample.orderExperimentId)
      this.setState({
        orderSample: orderSample,
        loading: false
      });
    },(error)=>{
      console.error("错误信息==",error)
    })
  }

  //获取库位 根据实验室ID
  getLocation=(labId)=>{
    const options = {
      url: "limsrest/sample/warehouse/listByLabId",
      method: "POST",
      parames:{
        labId: labId,
      }
    }
    httpFetch(options,(res)=>{

      const Location = res.data;

      //console.log("数据======：",Location,sample);
      for (let l of Location) {
        const lab = {
          text: l.warehouseName,
          value: l.warehouseId
        }
        this.items.push(lab);
      }
    },(error)=>{
      console.error("错误信息==",error)
    })
  }



  render() {
    let userInfo = this.props.userInfo;
    //console.log("-------",userInfo);
    const { orderSample, loading } = this.state;
    const srList = orderSample.srList ? orderSample.srList  : [];

    if(this.state.loading){
      return (
        <Loading loading={this.state.loading} text='加载中' />
      )
    }else{
      return (

        <View style={{flex: 1}}>
         <ScrollView style={styles.centent}>
            {
              srList.length > 0
              ? srList.map((s,index)=>{
                  return(
                    <ListRow
                      key={index}
                      title={

                        <Checkbox
                          title={s.sampleCodeId}
                          onChange={checked => this.checkbox(checked, s.sampleCodeId)}
                        />
                      }
                      detail= {
                        <Select
                          style={{width: px2dp(240)}}
                          size='sm'
                          value={s.samplePositionId}
                          items={this.items}
                          getItemValue={(item, index) => item.value}
                          getItemText={(item, index) => item.text}
                          pickerTitle= '选择库位'
                          placeholder= '请选择库位'
                          onSelected={(item, index) => {this.onSelect(item, s.sampleCodeId, 'samplePositionId')}}
                        />
                      }
                      detailStyle = {{color: 'red'}}
                      bottomSeparator='full'
                    />
                  )
                })
            : <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                  <Text>无归还条码</Text>
              </View>
          }

         </ScrollView>

        </View>
      );
    }



  }

  /**
   * 下拉框选择
   * @param  {[type]} item   选择的对象
   * @param  {[type]} sampleCode  选择的主键
   * @param  {[type]} column 列表名
   */
  onSelect(item, sampleCode,column){

    const { orderSample } = this.state;
    const srList = orderSample.srList;

    const target = srList.filter(item => item.sampleCodeId === sampleCode)[0];
    console.log(target);
    if (target) {
      target[column] = item.value;
      this.setState({ parameterDataList: orderSample });
    }
  }


  checkbox (checked,sampleCode) {

    const { orderSample } = this.state;
    const srList = orderSample.srList;
    //console.log(checked,sampleCode,swnList);

    for (let s of srList) {
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
    //console.log(this.list);
    if(this.list.length === 0){
      Toast.stop('请勾选样品');
      falg = false;
    }else{
      for (let s of this.list) {
        if(s.samplePositionId === null){
          Toast.stop('请选择库位');
          falg = false;
          break;
        }
      }
    }

    if(falg){
      const _sampleInfo = {
        orderId: orderSample.orderId,
        operateStatus: "3",
        orderType: orderSample.orderType,
        sampleOperatePerson: orderSample.sampleOperatePerson,
        srList: this.list,
      }

      const options = {
        url: "limsrest/sample/manage/crs",
        method: "POST",
        type: "json",
        parames: _sampleInfo //JSON.stringify(),
      }
      httpFetch(options,(res)=>{
        const mag = {
          icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
          title: '操作成功',
          magText: orderSample.orderCode+'收样成功！'
        }
        navigate('Mag', {
          mag: mag
        });

      },(error)=>{
        console.error("错误信息==",error)
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
)(SampleCodeBackDetail)
