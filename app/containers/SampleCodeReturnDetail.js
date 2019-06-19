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
import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';
import { ListRow, Label, Toast, Button, Checkbox, Select } from 'teaset';
import Input  from '../components/Input'

let _this;

class SampleCodeReturnDetail extends Component {
  static navigationOptions = {
    title: '退回条码',
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
      loading: false,
      backReasonName: null, //退样原因名称
      backReason: null, //退样原因值
      childrenSampleCode: [], //退样条码
      backCompany: null, //领样单位
      backUser: null, //领样人
    }
    this.items = [];
  }

  componentDidMount(){
    this.setState({
      loading: true
    })
    this.props.navigation.setParams({navigatePress:this.navigationRight})
    const { params } = this.props.navigation.state;
    const order = params.order;
    const options = {
      url: "limsrest/sample/manage/rs",
      method: "POST",
      parames:{
        orderId: order.orderId,
        orderType: order.orderType
      }
    }

    httpFetch(options,(res)=>{

      const orderSample = res.data;

      this.setState({
        orderSample: orderSample,
        loading: false
      });
    },(error)=>{
      console.error("错误信息==",error)
    })
    this.getBackReasonNameItems()
  }

  //获取库位 根据实验室ID
  getBackReasonNameItems=()=>{
    const options = {
      url: "limsrest/systemDictionary/s/sample_machine_reason",
      method: "GET",
    }
    httpFetch(options,(res)=>{
      const reasonName = res.data;
      for (let l of reasonName) {
        const name = {
          text: l.dicName,
          value: l.dicCode
        }
        this.items.push(name);
      }
    },(error)=>{
      console.error("错误信息==",error)
    })
  }

  render() {
    let userInfo = this.props.userInfo;
    const { orderSample, loading, backReason, backCompany, backUser } = this.state;
    const osList = orderSample.osList ? orderSample.osList  : [];

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
             ? <View style={{flex: 1}}>
                 <ListRow
                   title='退样原因：'
                   detail={
                     <Select
                       size='sm'
                       style={styles.styleSelect}
                       items={this.items}
                       value={backReason}
                       getItemValue={(item, index) => item.value}
                       getItemText={(item, index) => item.text}
                       placeholder='请选择退样原因'
                       pickerTitle='退样原因'
                       onSelected={(item, index) => this.setState({backReason: item.value,backReasonName: item.text})}
                      />

                   } bottomSeparator='full'
                  />
                  <ListRow title='领样单位：' detail={
                    <Input
                      style={styles.styleInput}
                      value={backCompany}
                      placeholder='请填写领样单位'
                      onChangeText={text => this.setState({backCompany: text})}
                      />
                  } bottomSeparator='full' />
                  <ListRow title='领样人：' detail={
                    <Input
                      style={styles.styleInput}
                      value={backUser}
                      placeholder='请填写领样人'
                      onChangeText={text => this.setState({backUser: text})}
                      />
                  } bottomSeparator='full' />
                  {
                    osList.map((item,index)=>{
                      return(
                        <ListRow
                          key={index}
                          title={
                            <Checkbox
                              title={item.sampleCode}
                              onChange={checked => this.checkbox(checked, item.sampleCode)}
                            />
                          }
                          detail= {'数量：'+item.sampleCount}
                          detailStyle = {{color: '#31c27c'}}
                          bottomSeparator='full'
                        />
                      )
                    })
                  }
               </View>
            : <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                  <Text>无退回条码</Text>
              </View>
           }


         </ScrollView>

        </View>
      );
    }



  }


  checkbox (checked,sampleCode) {

    const { orderSample } = this.state;
    const osList = orderSample.osList;

    for (let s of osList) {
      s.sampleOperateNum = 1;
      if(checked && sampleCode == s.sampleCode){

        this.list.push(s.sampleCode);
      }else if(!checked && sampleCode == s.sampleCode){

        this.list = this.list.filter(item => item !== sampleCode);
      }

    }
    //console.log(this.list);
  }

  commit(){
    const { state, navigate } = this.props.navigation;

    const { orderSample, backReason, backReasonName, backCompany, backUser } = this.state;
    let falg = true;
    if(backReason === null){
      Toast.stop('请选择退样原因');
      falg = false;
      return
    }
    if(backCompany === null){
      Toast.stop('请填写领样单位');
      falg = false;
      return
    }
    if(this.list.length === 0){
      Toast.stop('请勾选样品');
      falg = false;
      return
    }

    if(falg){
      const backSample = {
        ...orderSample,
        backCount: this.list.length,
        remainderCount: orderSample.sampleTotalCount - this.list.length,
        orderSampleCodelist: this.list.join(","),
        backReason: backReason,
        backReasonName: backReasonName,
        backCompany: backCompany,
        backUser: backUser,
      }

      const options = {
        url: "limsrest/sample/manage/cBack",
        method: "POST",
        type: "json",
        parames: [backSample] //JSON.stringify(),
      }
      httpFetch(options,(res)=>{
        const mag = {
          icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
          title: '操作成功',
          magText: orderSample.orderCode+'样品退回成功！'
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
    paddingHorizontal: 10
  },
  styleSelect: {
    width: '78%',
    height: 30,
    borderWidth: 0,
  }
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
)(SampleCodeReturnDetail)
