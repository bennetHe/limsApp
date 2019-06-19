
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Alert,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListRow, Label, Button } from 'teaset';
import Input  from '../components/Input';
import ItemCard from '../components/ItemCard'
import  { httpFetch }  from '../components/Fetch';



class OrderReceive extends Component {
  static navigationOptions = {
    title: "订单接收",
    showBackButton: true,

    //gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      date: ''
    }

  }


  render() {
    //const { navigate } = this.props.navigation;
    const { date } = this.state;
    return (
      <View style={{flex: 1,backgroundColor:'#fff'}}>
        <ScrollView>
          <View style={{height: 10}} />

          <ListRow
            title='请选择日期'
            titleStyle={{fontSize: FONT_SIZE(10), color: '#999', marginLeft: 10}}
            icon={<Icon name={'calendar'} size={FONT_SIZE(20)} color={'#ffcb57'}/> }
            detail= {date}
            detailStyle={{fontSize: FONT_SIZE(14), color: '#31708f'}}
            bottomSeparator = 'full'
            topSeparator = 'full'
            onPress={() => this.selectCalendars()}
          />
      </ScrollView>
      {
        date
        ? <View style={styles.buttonView}>
            <Button
              type='secondary'
              size='lg'
              title='确定'
              style={styles.bottonStyle}
              onPress={this.receive.bind(this) }

            />
          </View>
        : null
      }

    </View>
    );
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

  receive () {
    const { state, navigate } = this.props.navigation;
    const order = state.params.order;
    const parame = {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      taskId: order.taskId,
      finishDate: this.state.date,
      partApproved: 'receive'
    }
    const options = {
      url: "limsrest/order/orderMachine/receive",
      method: "POST",
      parames: parame
    }
    httpFetch(options,(res)=>{
      const mag = {
        icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
        title: '操作成功',
        magText: order.orderCode+'接收订单成功！'
      }
      navigate('Mag', {
        mag: mag
      });

    },(error)=>{
      console.error("错误信息==",error)
    })

  }


}
const styles = StyleSheet.create({
  buttonView: {

    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 45
  },
  bottonStyle: {
    width: SCREEN_WIDTH*0.9
  },
	inputCardStyle: {
    width: SCREEN_WIDTH,
		paddingLeft: 2,
		paddingRight: 2,
		padding: 2,
		marginTop: 4,
    borderRadius:5
	}
});

export default OrderReceive
