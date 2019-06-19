
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
import { ListRow, Label, Button, Checkbox } from 'teaset';
import Input  from '../components/Input'

import  { httpFetch }  from '../components/Fetch';



class OrderRequestModification extends Component {
  static navigationOptions = {
    title: "要求修改",
    showBackButton: true,

    //gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedTestXZ: false,
      checkedTestMD: false,
      checkedTestYQ: false,
      checkedTestYJ: false,
      checkedTestBJ: false,
      checkedTestZQ: false,
      checkedTestNL: false,
      checkedTestQT: false,
      text: null,
      loading: false
    }

  }


  render() {
    //const { navigate } = this.props.navigation;
    const { checkedTestXZ, checkedTestMD, checkedTestYQ,
            checkedTestYJ, checkedTestBJ, checkedTestZQ,
            checkedTestNL, checkedTestQT, text, loading
          } = this.state;
    const { page } = this.props.navigation.state.params;

    return (
      <View style={{flex: 1,backgroundColor:'#fff'}}>
        <ScrollView>
          <View style={{height: 10}} />
          <View style={styles.columnStyle}>
            <ListRow
              detail={
                <Checkbox
                  title='测试性质不符'
                  checked={checkedTestXZ}
                  onChange={value => this.setState({checkedTestXZ: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />
            <ListRow
              detail={
                <Checkbox
                  title='测试目的不符'
                  checked={checkedTestMD}
                  onChange={value => this.setState({checkedTestMD: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />

            <ListRow
              detail={
                <Checkbox
                  title='测试要求不明'
                  checked={checkedTestYQ}
                  onChange={value => this.setState({checkedTestYQ: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />
            <ListRow
              detail={
                <Checkbox
                  title='测试样机不符'
                  checked={checkedTestYJ}
                  onChange={value => this.setState({checkedTestYJ: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />

            <ListRow
              detail={
                <Checkbox
                  title='测试标准不符'
                  checked={checkedTestBJ}
                  onChange={value => this.setState({checkedTestBJ: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />
            <ListRow
              detail={
                <Checkbox
                  title='测试周期不符'
                  checked={checkedTestZQ}
                  onChange={value => this.setState({checkedTestZQ: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />

            <ListRow
              detail={
                <Checkbox
                  title='能力不具备'
                  checked={checkedTestNL}
                  onChange={value => this.setState({checkedTestNL: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />

            <ListRow
              detail={
                <Checkbox
                  title='其他'
                  checked={checkedTestQT}
                  onChange={value => this.setState({checkedTestQT: value})}
                  style={styles.checkStyle}
                />
              }
              titlePlace = 'none'
              bottomSeparator = 'full'
              style={styles.styleListRow}
            />

          </View>
          <ListRow
            title='附加说明'
            titleStyle={{fontSize: FONT_SIZE(10), color: '#999', marginBottom: 10}}
            detail={
              <Input
                value={text}
                onChangeText={text => this.setState({text})}
                multiline={true}
                style={{width: '100%',height: px2dp(200),textAlignVertical: 'top'}}
              />
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />
      </ScrollView>
      {
        page === 'receive'
        ? <View style={styles.buttonView}>
            <View style={{width: SCREEN_WIDTH*0.5, alignItems: 'center'}}>
              <Button
                size='lg'
                title='要求修改'
                style={styles.bottonStyle}
                onPress={()=>this.receive('modify')}
                disabled= {loading}
              />
            </View>
            <View style={{width: SCREEN_WIDTH*0.5, alignItems: 'center'}}>
              <Button
                size='lg'
                title='拒绝接收'
                style={styles.bottonStyle}
                onPress={()=>this.receive('refuse')}
                disabled= {loading}
              />
            </View>
          </View>
        : <View style={styles.buttonView}>
            <View style={{width: '100%', alignItems: 'center'}}>
              <Button
                size='lg'
                title='要求修改'
                style={styles.bottonStyle}
                onPress={()=>this.receive('labFalse')}
                disabled= {loading}
              />
            </View>
          </View>
      }


    </View>
    );
}



  receive (but) {
    this.setState({loading:true})
    const { state, navigate } = this.props.navigation;
    const order = state.params.order,
          url = state.params.url;

    const { checkedTestXZ, checkedTestMD, checkedTestYQ,
            checkedTestYJ, checkedTestBJ, checkedTestZQ,
            checkedTestNL, checkedTestQT, text, loading
          } = this.state;
    const XZ = checkedTestXZ ? '测试性质不符' : null,
          MD = checkedTestMD ? '测试目的不符' : null,
          YQ = checkedTestYQ ? '测试要求不明' : null,
          YJ = checkedTestYJ ? '测试样机不符' : null,
          Bj = checkedTestBJ ? '测试标准不符' : null,
          ZQ = checkedTestZQ ? '测试周期不符' : null,
          NL = checkedTestNL ? '能力不具备'   : null,
          QT = checkedTestQT ? '其他' : null;
    const reason = [XZ, MD, YQ, YJ, Bj, ZQ, NL, QT];
    let newReason = [];
    for (let e of reason) {
      if(e){
        newReason.push(e);
      }
    }

    const parame = {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      taskId: order.taskId,
      reason: newReason.join(','),
      other: text,
      partApproved: but
    }

    const options = {
      url: url,
      method: "POST",
      parames: parame
    }
    httpFetch(options,(res)=>{

      const mag = {
        icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
        title: '操作成功',
        magText: order.orderCode+'成功！'
      }
      navigate('Mag', {
        mag: mag
      });
      this.setState({loading:false})

    },(error)=>{
        this.setState({loading:false})
      console.error("错误信息==",error)
    })

  }


}
const styles = StyleSheet.create({
  columnStyle: {
    width: SCREEN_WIDTH,
    flexDirection:'row',
    flexWrap: 'wrap',
    display:'flex',
    marginTop: px2dp(10),
    marginBottom: px2dp(20)
  },
  styleListRow: {
    width: (SCREEN_WIDTH) / 2
  },
  checkStyle: {
    height: px2dp(44),
    width: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: px2dp(100),
    marginBottom: px2dp(20)
  },
  bottonStyle: {
    width: '90%'
  },
});

export default OrderRequestModification
