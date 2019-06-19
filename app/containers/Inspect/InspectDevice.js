/**
 * 测试设备
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
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ListRow, Label, Toast, Button, PullPicker } from 'teaset';
import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

export default class InspectDevice extends Component {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "检测条码",
    header: null,
    //gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  });
  constructor(props) {
      super(props);
      this.state = {
        data: [],//数据源
        selectItem: [],

      }
  }

  componentDidMount(){
    // const {selectItem,data} = this.state;
    // const defaultItem = [];
    // for (let item of data) {
    //   if(item.select){
    //     this.state.selectItem.push(item)
    //   }
    // }
    this.getTestDevice();
  }

  getTestDevice = () => {
    const {deviceInfo,defaultValue} = this.props;
    const options = {
      url: "limsrest/device/listByOnlyTableId",
      method: "POST",
      parames: deviceInfo
    }
    httpFetch(options,(res)=>{

      const device = res.data;
      const defaultList = defaultValue ? defaultValue.split(",") : [];
      const defaultItem = [];

      for (let id of defaultList) {

        for (let d of device) {
          if(id === d.deviceId){

            d.select = true;
            defaultItem.push(d);
          }

        }
      }

      this.setState({
        data: device,
        selectItem: defaultItem
      })
    },(error)=>{
      Toast.message(error);
    })
  }

    _selectItemPress = (device) => {
       const { selectItem, data } = this.state;

       const index = data.findIndex(item => item.deviceId === device.deviceId);
       console.log(index,device);
       if(index > -1){
         if (device.select) {
           selectItem.splice(selectItem.findIndex(function (x) {
                 return x.deviceId === device.deviceId;
             }))
         }else {
             selectItem.push(device)
         }
          data[index].select = !device.select
         // this.state.data=arr.pop()
         this.setState({data, selectItem})
       }
    }


  render() {
    if(this.state.data.length > 0){
      return (
        <FlatList
            keyExtractor={item => item.deviceId}
            data={this.state.data}
            extraData={this.state} //这里是关键，如果不设置点击就不会马上改变状态，而需要拖动列表才会改变

            renderItem={({item}) => {

                return (
                    <ListRow
                      key= {item.deviceId}
                      title= { `${item.deviceName}-(${item.deviceMakeNum})` }
                      detail= {item.select ? <Ionicons style={styles.checkIcon}  name="md-checkmark" /> : ("未选中")}
                      onPress={() => this._selectItemPress(item)}
                      bottomSeparator="full"
                      accessory='none'
                    />

                )
            }}
        />

      );
    }else {
      return(
        <Loading loading={true} text='加载中' />
      )
    }


  }
}
const styles = StyleSheet.create({

    checkIcon: {
      fontSize: FONT_SIZE(14),
      color: '#337ab7'
    }
});
