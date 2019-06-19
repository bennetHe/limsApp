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

import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';

export default class OrderList extends Component {
  // static navigationOptions = {
  //   title: '订单接收',
  //   // header: null,
  //   // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  // };
  constructor(props) {
      super(props);
      this.state = {
        orderList: [],
        loading: true,
        loadingMore: false, // 加载更多
        size: 1, //第几页
        totalPage: 0, // 总页数
      }
  }

  componentDidMount(){

    this.getListDate(this.state.size)
  }

  getListDate(size, parame){

    const options = {
      //url: "limsrest/order/orderMachine/list",
      url: this.props.url,
      method: "POST",
      parames:{
        page: size,
        rows: 20,
        ...this.props.orderStatus,

        ...parame
      }
    }
    httpFetch(options,(res)=>{

      const order = res.data;
      const newList = [...this.state.orderList];
      if(parame){

        this.setState({
          orderList: [...order.records],
          totalPage: order.totalPage,
          loading: false,
          loadingMore: false
        });
      }else{

        this.setState({
          orderList: [...newList,...order.records],
          totalPage: order.totalPage,
          loading: false,
          loadingMore: false
        });
      }
    },(error)=>{
      this.setState({loading: false });
      console.error("错误信息==",error)
    })
  }

  onSearch(text){

    text = text.replace(/\s+/g,"");
    if(text){
      clearTimeout(this.settimeId);       //如搜索的内容变化在1秒之中，可以清除变化前的fetch请求，继而减少fetch请求。但不能中断fetch请求
      this.settimeId = setTimeout(() => {
        //this.setState({loading: true });
        const parame = {
          orderCode: text
        }
        this.getListDate(1,parame)
      },1000)


    }else{
      //this.getListDate(this.state.size)
    }
  }

  loadMore(){
    if(this.state.totalPage === this.state.size){
      Toast.message('没有更多了');
    }else{
      this.setState({
        size: this.state.size +1
      },()=>{

        this.setState({
          loadingMore: true
        })
        this.getListDate(this.state.size)
      })
    }

  }


  render() {
    let userInfo = this.props.userInfo;
    const { loading, orderList, totalPage, size, loadingMore } = this.state;

    if(loading){
      return (
        <Loading loading={loading} text='加载中' />
      )
    }else{
      return (
        <View style={{flex: 1}}>
          <View style={{margin:8}}>
            <SearchInput
              placeholder='订单编号'
              blurOnSubmit={true}
              returnKeyType ='search'
              onChangeText={text => this.onSearch(text)}/>
          </View>
         <ScrollView style={styles.centent}>
          {
            orderList.length <= 0
            ? <View style={{flex: 1, alignItems: 'center', marginTop:20}}>
                <Label text='无数据' type='detail' />
              </View>
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
                         <Label text={moment(this.props.page === "inspect" ? order.orderInfoDate : order.gmtCreate).format('YYYY-MM-DD')} type='detail' />
                       </View>
                       <View style={styles.listBottomR}>
                         <Label text='更多...' size='sm' />
                       </View>
                     </View>
                  }
                  titlePlace='top'
                  detailMultiLine={true}
                  bottomSeparator='full'
                  onPress={() => {this.props.navigation.navigate(this.props.routeName, { order: order})}}
                  accessory='none'
                />
              )
            })
          }
          {
            totalPage > 1
            ? <View style={styles.loadMoreView}>
                {
                  totalPage === size
                  ? <Label text='没有更多了...' />
                  : (
                    loadingMore
                    ?  <ActivityIndicator
                        animating={loadingMore}
                        size="small"
                      />
                    : <TouchableOpacity onPress={this.loadMore.bind(this)} >
                        <Label style={{color: '#1890ff'}}  text='更多...' />
                      </TouchableOpacity>
                  )
                }
              </View>
            : null
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

})
