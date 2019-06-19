/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
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

import moment from 'moment';

import {ListRow,Label,SearchInput,Badge,Toast} from 'teaset';

import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

export default class SearchList extends Component {
  static navigationOptions = {
    title: '搜索样机编码',
    // header: null,
    // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };
  constructor(props) {
      super(props);
      this.state = {
        orderList: [],
        loading: false,
        loadingMore: false, // 加载更多
        searchText: "",
        messageText: "请输入样机编码查询，如：‘S201901020017’"
      }
  }

  componentDidMount(){

    //this.getListDate(this.state.size)
  }

  getListDate(size, parame){
    this.setState({
      loadingMore: true
    })
    const options = {
      url: "limsrest/sample/manage/list",
      method: "POST",
      parames:{
        page: size,
        rows: 20,
        ...parame
      }
    }
    httpFetch(options,(res)=>{

      const order = res.data;

      if(parame){
        if(order.records.length > 0){
          const newOrder =  order.records[0],
                orderCodes = newOrder.orderCode.split(','),
                orderStatus = newOrder.orderStatusName.split(','),
                orderIds = newOrder.orderId.split(',');
          let newOrderList = [];
          orderCodes.map((item, index)=>{
              const sample = {
                sampleCode: newOrder.sampleCode,
                orderCode: item,
                orderId: orderIds[index],
                orderType: newOrder.orderType,
                orderStatusName: orderStatus[index],
                sampleOperateStatusName: newOrder.sampleOperateStatusName,
                sampleOperateStatus: newOrder.sampleOperateStatus
              }
              newOrderList.push(sample);
            })
          // for (let [index,code] of orderCodes.entries()) {
          //   const sample = {
          //     sampleCode: newOrder.sampleCode,
          //     orderCode: code,
          //     orderId: orderIds[index],
          //     orderType: newOrder.orderType,
          //     orderStatusName: orderStatus[index],
          //     sampleOperateStatusName: newOrder.sampleOperateStatusName,
          //     sampleOperateStatus: newOrder.sampleOperateStatus
          //   }
          //   newOrderList.push(sample);
          // }
           //Alert.alert("错误","orderType="+newOrder.orderType);
          this.setState({
            orderList: [...newOrderList],
            totalPage: order.totalPage,
            loading: false,
            loadingMore: false
          });
        }else{
          this.setState({
            orderList: [],
            loading: false,
            loadingMore: false,
            messageText: "无数据"
          });
        }

      }
      // else{
      //   this.setState({
      //     orderList: [...newOrder,...order.records],
      //     totalPage: order.totalPage,
      //     loading: false,
      //     loadingMore: false
      //   });
      // }
    },(error)=>{
      this.setState({loading: false });
    })
  }

  submiteContext(text) {
      text = text.replace(/\s+/g,"");
      text = text.toUpperCase();
      if(text.length == 13 && text.startsWith("S")){
        const parame = {
          sampleCode: text
        }
        this.getListDate(1,parame);
      }else{
        Toast.message('请输入正确的样品编码！');
      }
  }



  render() {
    let userInfo = this.props.userInfo;
    const { loading, orderList, loadingMore, messageText } = this.state;

    if(loading){
      return (
        <Loading loading={loading} text='加载中' />
      )
    }else{
      return (
        <View style={{flex: 1}}>
          <View style={styles.flexContainer}>
            <View style={styles.cell}>
              <SearchInput
                placeholder='样机编号'
                keyboardType={'default'} // 默认键盘类型
                keyboardAppearance={'light'} // 键盘演示
                returnKeyType={'done'}  // 代替 returnKeyType
                secureTextEntry={false} // 输入内容显示黑色圆点
                clearButtonMode={'while-editing'} // 输入框右边 x 按钮
                onChangeText={(text) => this.setState({searchText: text})}
                onSubmitEditing={(event) => this.submiteContext(event.nativeEvent.text)}
                style={{height: px2dp(63)}}
                />
            </View>
            <View style={styles.cellfixed}>
              <Button title='搜索' onPress={() => this.submiteContext(this.state.searchText)} />
            </View>
          </View>

         <ScrollView style={styles.centent}>
          {
            orderList.length <= 0
            ? (
                loadingMore
                ?  <ActivityIndicator
                    animating={loadingMore}
                    style={{marginTop: px2dp(25)}}
                    size="small"
                  />
                : <View style={{flex: 1, alignItems: 'center', marginTop: px2dp(25)}}>
                    <Label text={messageText} type='detail' />
                  </View>
              )
            : orderList.map((order,index)=>{

              let bgColor = '#f5ce1a';
              if(order.orderStatus === 'order_machine_status_3'){
                bgColor = '#31c27c';
              }else if(order.orderStatus === 'order_machine_status_5'){
                bgColor = '#0371df';
              }
              const title = `订单编号：${order.orderCode}`
              return(
                <ListRow
                  key= {index}
                  title={
                    <View style={styles.listView}>
                       <View style={styles.listTopL}>
                         <Label text={title} />
                       </View>
                       <View style={styles.listTopR}>
                         <Badge style={{backgroundColor: bgColor}} type='square' count={order.orderStatusName} />
                       </View>
                     </View>
                 }
                  titleStyle={styles.titleStyle}
                  detail={
                    <View style={styles.listView}>
                       <View style={styles.listBottomL}>
                         <Label text={order.sampleCode} type='detail' />
                       </View>
                       <View style={styles.listBottomR}>
                         <Label text='更多...' size='sm' />
                       </View>
                     </View>
                  }
                  titlePlace='top'
                  detailMultiLine={true}
                  bottomSeparator='full'
                  onPress={() => {
                    const data = `${order.sampleCode},${order.orderCode},${order.orderId},${order.orderType}`
                    this.props.navigation.navigate('ScanSuccess', { code: data ,page: "list"})
                  }}
                  accessory='none'
                />
              )
            })
          }
         </ScrollView>
        </View>
      );
    }

  }
}


const styles = StyleSheet.create({
  centent: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  titleStyle: {
    fontSize: FONT_SIZE(12),
    color: '#333'
  },
  listView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listTopL: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  listTopR: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  listBottomL: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    paddingTop:10,
  },
  listBottomR: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingTop:10,
  },
  loadMoreView: {
    flex: 1,
    justifyContent:'center', // 居中
    alignItems:'center',
    height: px2dp(80),
  },
  flexContainer: {
        // 容器需要添加 direction 才能变成让子元素 flex
        flexDirection: 'row',
        margin: px2dp(8)
    },
    cell: {
        flex: 1,
    },
    cellfixed: {
        width: 80,
    }


})
