
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Calendar from 'react-native-whc-calendar';
import moment from 'moment';

class Calendars extends Component {
  static navigationOptions = {
    title: "订单接收",
    //gesturesEnabled: false
  };

  constructor(props) {
    super(props);


  }
  render() {
    const { navigate } = this.props.navigation;
    let year = moment().format('YYYY'),
        month = moment().format('MM'),
        day = moment().format('DD'),
        date = year+'-'+month+'-'+day;
    //console.log(year+'-'+month+'-'+day)
    const  {
            block,
        } = this.props.navigation.state.params;
    return (
      <View style={{flex: 1}}>
        <Calendar
               months = {12}
               enableSingleChoice={true}
               startDateStr = {date}
               invalidDateNotSelected= {false}
               onSelectedDateBlock={(s,e) => {
                  /// 返回选择的日期
                  block(s);
                  setTimeout(() => {
                    const {goBack} = this.props.navigation;
                    goBack();
                }, 200);
               }
             }
           />
      </View>
    );
  }

}

export default Calendars
