
/*
 * 模块订单接收要求修改
 */
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
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import  { httpFetch }  from '../../components/Fetch';
import Input  from '../../components/Input'




class OrderModuleRequestModification extends Component {
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
      loading: false,
      causeData: [], //  修改原因
      sampleHandle: 1

    }

  }

  componentDidMount(){
    this.getModificationCause();
  }

  getModificationCause= () => {
    const options = {
      url: "limsrest/systemDictionary/s/module_reason",
      method: "GET",
    }
    httpFetch(options,(res)=>{

      //console.log("数据======：",res);
      let  cause = res.data;
      for (let c of cause) {
        c.dicChecked = false
      }
      this.setState({
        causeData: cause
      })

    },(error)=>{
      Toast.message(error);
    })
  }

  onSelect(index, value){
    this.setState({
      sampleHandle: value
    })
  }

  render() {
    //const { navigate } = this.props.navigation;
    const { causeData, text, loading , checkedTestXZ
          } = this.state;
    const { page } = this.props.navigation.state.params;

    return (
      <View style={{flex: 1}}>

        <ScrollView>

          <View style={styles.columnStyle}>
            {
              causeData.map((item, index) => {

                return (
                  <ListRow
                    key = { index }
                    detail={
                      <Checkbox
                        title= { item.dicName }
                        checked={ item.dicChecked }
                        onChange={value => this.handleCheckbox(value,item.dicCode)}
                        style={styles.checkStyle}
                      />
                    }
                    titlePlace = 'none'
                    bottomSeparator = 'full'
                    style={styles.styleListRow}
                  />
                )
              })
            }

          </View>
          <ListRow
            title='附加说明'
            titleStyle={{fontSize: FONT_SIZE(10), color: '#999', marginBottom: 10}}
            detail={
              <Input
                value={text}
                onChangeText={text => this.setState({text})}
                multiline={true}
                style={{width: '100%',height: px2dp(200),textAlignVertical: 'top',}}
              />
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />
          <ListRow
            title='样品处理'
            titleStyle={{fontSize: FONT_SIZE(10), color: '#999', marginBottom: 10}}
            detail={
              <RadioGroup
                selectedIndex = {1}
                size = {16}
                onSelect = {(index, value) => this.onSelect(index, value)}
              >
                <RadioButton value={1} >
                  <Text>进入临时台帐</Text>
                </RadioButton>

                <RadioButton value={2}>
                  <Text>不进入临时台帐</Text>
                </RadioButton>
              </RadioGroup>
            }
            titlePlace = 'top'
            bottomSeparator = 'full'
          />


      </ScrollView>

        <View style={styles.buttonView}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <Button
              size='lg'
              title='要求修改'
              style={styles.bottonStyle}
              onPress={()=>this.receive('modify')}
              disabled= {loading}
            />
          </View>
        </View>



    </View>
    );
  }

  handleCheckbox (value,dicCode) {
    console.log(value,dicCode);
    const { causeData } = this.state;
    let newCause = causeData.filter(item => item.dicCode === dicCode)[0];

    if(newCause){
      newCause.dicChecked = value;
      this.setState({ causeData });
    }
    console.log(causeData);
  }

  receive (but) {
    this.setState({loading:true})
    const { state, navigate } = this.props.navigation;
    const order = state.params.order;
          //url = state.params.url;

    const { causeData, text, sampleHandle, loading } = this.state;

    let newReason = [];
    for (let e of causeData) {
      if(e.dicChecked){
        newReason.push(e.dicCode);
      }
    }

    const parame = {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      taskId: order.taskId,
      reason: newReason.join(','),
      other: text,
      sampleHandle: sampleHandle,
      partApproved: but
    }
    console.log(parame);

    const options = {
      url: "limsrest/order/info/operate/receive",
      method: "POST",
      parames: parame
    }
    httpFetch(options,(res)=>{

      const mag = {
        icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
        title: '操作成功',
        magText: order.orderCode+'打回成功！'
      }
      navigate('Mag', {
        mag: mag
      });
      this.setState({loading:false})

    },(error)=>{
        this.setState({loading:false})
        Toast.message(error);
    })

  }


}
const styles = StyleSheet.create({
  columnStyle: {
    width: SCREEN_WIDTH,
    flexDirection:'row',
    flexWrap: 'wrap',
    display:'flex',
    marginTop: px2dp(15),
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

export default OrderModuleRequestModification
