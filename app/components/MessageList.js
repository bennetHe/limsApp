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
import Icon from 'react-native-vector-icons/FontAwesome';
import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';

export default class MessageList extends Component {
  // static navigationOptions = {
  //   title: '订单接收',
  //   // header: null,
  //   // gesturesEnabled: false //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  // };
  constructor(props) {
      super(props);
      this.state = {
        messageList: [],
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
      url: "limsrest/message/list",

      method: "POST",
      parames:{
        page: size,
        rows: 20,
      }
    }
    httpFetch(options,(res)=>{

      const message = res.data;
      console.log(message);
      //const newList = [...this.state.messageList];
      this.setState({
        messageList: message.records,
        totalPage: message.totalPage,
        loading: false,
        loadingMore: false
      });
    },(error)=>{
      this.setState({loading: false });
      console.error("错误信息==",error)
    })
  }





  render() {
    let userInfo = this.props.userInfo;
    const { loading, messageList, totalPage, size, loadingMore } = this.state;

    if(loading){
      return (
        <Loading loading={loading} text='加载中' />
      )
    }else{
      return (
        <View style={{flex: 1,}}>
         <ScrollView style={styles.centent}>
          {
            messageList.length <= 0
            ? <View style={{flex: 1, alignItems: 'center', marginTop:20}}><Label text='无数据' /></View>
            : messageList.map((m,index)=>{

              return(
                <ListRow key = {index}
                  title={m.title}
                  detail={m.content}
                  titleStyle={{marginLeft: 10}}
                  icon={<Icon style={{color: 'red'}} name="bell-o" />}
                  bottomSeparator='full'
                  onPress={() => alert('Press!')}
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

})
