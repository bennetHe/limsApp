/**
 * 样品收样 整机和模块公用
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
import {Toast, Button, PullPicker} from 'teaset';

let _this;

class SampleCodeReceive extends Component {
  static navigationOptions = {
    title: '样品接收',
    headerRight: <Button
          titleStyle={{color:'#fff'}}
          onPress={()=>_this.commit()}
          title='接收'
          type='link'
        />,
    // header: null,
    // gesturesEnabled: false
  };
  constructor(props) {
    super(props);
    _this = this;
    this.state = {
      orderSample: {}, // 订单
      date: null, //时间
      selectedIndex: null,
      loading: false
    }

    this.items = [
      '送样',
      '收样',
    ];

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
    //console.log("======",options);
    httpFetch(options,(res)=>{

      const orderSample = res.data;

      this.setState({
        orderSample: orderSample,
        loading: false
      });
    },(error)=>{
      Toast.message(error);
    })
  }

  selectCalendars(){
    const {navigate} = this.props.navigation;

    navigate('Calendars', {
      block: (date) => {
           //Alert.alert(date);
           this.setState({
             date
           })
      }
    });
  }

  show() {
    PullPicker.show(
      '收样方式',
      this.items,
      this.state.selectedIndex,
      (item, index) => this.setState({selectedIndex: index})
    );
  }

  render() {
    let userInfo = this.props.userInfo;

    const { orderSample, date, selectedIndex, loading } = this.state;
    const osList = orderSample.osList ? orderSample.osList  : [];
    const { type } = this.props.navigation.state.params;

    let selected = (selectedIndex || selectedIndex === 0) ? this.items[selectedIndex] : null;

    if(this.state.loading){
      return (
        <Loading loading={this.state.loading} text='加载中' />
      )
    }else{
      return (

        <View style={{flex: 1, marginTop: 5}}>
         <ScrollView style={styles.centent}>
           {
             type === 'module'
             ? <View style={{flex: 1}}>
                  <ListRow
                   title='承诺完成时间'
                   titleStyle={{fontSize: FONT_SIZE(12), color: '#666'}}
                   detail= {date}
                   detailStyle={{fontSize: FONT_SIZE(12), color: 'green'}}
                   onPress={() => this.selectCalendars()}
                   bottomSeparator='full'
                   />
                 <ListRow title='收样方式'
                   titleStyle={{fontSize: FONT_SIZE(12), color: '#666'}}
                   detail={selected}
                   onPress={() => this.show()}
                   detailStyle={{fontSize: FONT_SIZE(12), color: 'green'}}
                   bottomSeparator='full'
                  />
               </View>
             : null

           }

            {
              osList.length > 0
              ? osList.map((item,index)=>{
                  return(
                    <ListRow
                      key={index}
                      title={item.sampleCode}
                      detail= {item.sampleLocationName ? item.sampleLocationName : '请填写信息'}
                      detailStyle = {{color: item.sampleLocationName ? 'green' : 'red'}}
                      bottomSeparator='full'
                      onPress={() => this.editSampleInfo(item)}
                    />
                  )
                })
              : <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                  <Text>无收样条码</Text>
                </View>

            }
            {
              /*
              <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                <Button title='接收样品3333ee' type='primary' onPress={()=>this.commit()} style={{width: '90%'}} />
              </View>
               */
            }

         </ScrollView>

        </View>
      );
    }

  }

  commit(){
    const { state, navigate } = this.props.navigation;
    let userInfo = this.props.userInfo;
    const { orderSample, date, selectedIndex } = this.state;
    const { type } = state.params;
    let falg = false, selected = null;
    const osListNew = orderSample.osList;


    if(type === 'module'){ //模块效验
      if(date === null){
        Toast.stop('请填写承诺完成时间');
        falg = true;
        return
      }

      if(selectedIndex === null){
        Toast.stop('请填写收样方式');
        falg = true;
        return
      }
      selected = (selectedIndex || selectedIndex === 0) ? this.items[selectedIndex] : null;
    }
    if(osListNew){
      for (let o of osListNew) {
        if(!o.sampleLocationName){
          Toast.stop('请填写收样信息');
          falg = true;
          break;
        }
      }
    }else{
      Toast.stop('请填写收样信息');
      falg = true;
    }



    if(!falg){
      const _sampleInfo = {
        orderId: orderSample.orderId,
        operateStatus: 0,
        departmentFirstCode: orderSample.departmentFirstCode,
        orderModuleBpm: orderSample.taskId ? {taskId: orderSample.taskId} : null,
        orderStatus: orderSample.orderStatus,
        orderType: orderSample.orderType,
        sampleOperatePerson: userInfo.userName,
        osList: orderSample.osList,
        //模块
        orderPromiseDate: date,
        sampleReceiveStyle: selected
      }
      console.log(_sampleInfo);
      const options = {
        url: "limsrest/sample/manage/cs",
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
        Toast.message(error);
      })

    }



  }

  editSampleInfo (item){
    const {navigate} = this.props.navigation;
    const { orderSample } = this.state;
    navigate('SampleReceiveCodeForm', {labId: orderSample.orderExperimentId, sample: item,
      block: (date) => {
          const osList = orderSample.osList;

          const index = osList.findIndex(item => date.sampleCode === item.sampleCode);
          if(index > -1){
            const item = osList[index];
            osList.splice(index,1,{...item});
            orderSample.osList = osList;
            this.setState({
              orderSample
            })
          }

      }
    });
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
)(SampleCodeReceive)
