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

import { ListRow, Label, Toast, Button, PullPicker } from 'teaset';
import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

export default class InspectDevice extends Component {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "检测条码",
    //gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  });
  constructor(props) {
      super(props);
      this.state = {
        data: [{
              "id": "0",
              select: false
          },
              {
                  "id": "1",
                  select: false
              },
              {
                  "id": "2",
                  select: false
              },
              {
                  "id": "3",
                  select: true
              },
              {
                  "id": "4",
                  select: true
              },
              {
                  "id": "5",
                  select: true
              }
            ],//数据源
          selectItem: [],

      }
  }

  componentDidMount(){

  }
  _itemPress = (item) => {
        console.log(item);
    }
    _selectItemPress = (item) => {
        if (item.select) {
         this.state.selectItem.splice(this.state.selectItem.findIndex(function (x) {
                return x === item.name;
            }))
        } else {
            this.state.selectItem.push(item)
        }
        this.state.data[item.id].select = !item.select
        // this.state.data=arr.pop()
        this.setState({data: this.state.data})
    }

    _submitPress() {
        alert(`选中了${JSON.stringify(this.state.selectItem)}`)
    }


  render() {
    return (
      <FlatList
                keyExtractor={item => item.id}
                data={this.state.data}
                extraData={this.state} //这里是关键，如果不设置点击就不会马上改变状态，而需要拖动列表才会改变
                ListHeaderComponent={({item}) => {
                    return (<Button title={"确定"} onPress={_ = () => this._submitPress()}/>)
                }}
                renderItem={({item}) => {
                    return (
                        <TouchableHighlight onPress={ _ => this._itemPress(item)}>
                            <View style={styles.standaloneRowFront}>

                                <TouchableHighlight
                                    onPress={_ => this._selectItemPress(item)}>
                                    <View style={{
                                        width: 70,
                                        height: 70,
                                        backgroundColor: item.select ? ("#ff081f") : ("#39a7fc")
                                    }}/>
                                </TouchableHighlight>

                                <View
                                    style={{marginLeft: 20}}>
                                    <Text>{item.select ? ("选中") : ("未选中")}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>)
                }}
            />

    );

  }
}
const styles = StyleSheet.create({
    standaloneRowFront: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: 70,
        marginBottom: 5
    },
});
