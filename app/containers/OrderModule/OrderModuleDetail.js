
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { ListRow, Label, ModalIndicator, ActionSheet,Button, Overlay, SegmentedView, Toast } from 'teaset';
import moment from 'moment';
import  { httpFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

let that;

class OrderModuleDetail extends Component  {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "订单详情",
    showBackButton: true,
    headerRight: <Button
          titleStyle={{color:'#f6cc17'}}
          onPress={()=>navigation.state.params.navigatePress()}
          title='操作'
          type='link'
        />,
    //gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  });

  constructor(props) {
    super(props);
    that = this;
    this.state = {
      order: {}, // 订单
      orderClient: {}, //委托人
      omsdList: [], //测试项目
      ompList: [], // 技术参数
      omsList: [], // 主要部件
      loaded: false,
    }
    this.customKey = null;
  }


  navigationRight () {
    const order = that.state.order;

    let items = [];
    if(order.orderStatus === "order_module_status_2"){
      if(order.sampleCode === ""){
        items = [
         {title: '生成条码', onPress: () =>  Alert.alert(
           '提示',
           '请选择生成条码方式',
           [
             {text: '按订单', onPress: () => that.generateBarcode('0')},
             {text: '按样品', onPress: () => that.generateBarcode('1')},
             {text: '取消', style: 'cancel'},
           ],
           { cancelable: false }
         )
         },
       ];
     }else{
       items = [
        {title: '接收样品', onPress: () => that.props.navigation.navigate('SampleCodeReceive',{
          order: order, type: 'module'
        })},
      ];
     }
     items.push(
       {title: '要求修改', onPress: () => that.props.navigation.navigate('OrderModuleRequestModification',{
         order: order,
         url: 'limsrest/order/orderMachine/receive',
         page: 'receive'
       })},
     )
    }else if(order.orderStatus === "order_module_status_4"){
      items = [
       {title: '审核通过', onPress: () => Alert.alert(
         '提示',
         '您确定要 审核通过吗？',
         [
           {text: '确定', onPress: () => that.orderTaskGrabReview(true,order)},
           {text: '取消',  style: 'cancel'},
         ],
         { cancelable: false }
       )},
       {title: '要求修改', onPress: () => Alert.alert(
         '提示',
         '您确定要 要求修改吗？',
         [
           {text: '确定', onPress: () => that.orderTaskGrabReview(false,order)},
           {text: '取消',  style: 'cancel'},
         ],
         { cancelable: false }
       )},
     ];
    }

    if(order.orderStatus){
      items.push(
        {title: '流转记录', onPress: () => that.props.navigation.navigate('OrderFlowRecord',{
          order: order
        })}
      );
    }

    let cancelItem = {title: '关闭'};
    ActionSheet.show(items, cancelItem);
  }


  /**
   * 生成条码
   */
  generateBarcode (value) {
    const order = that.state.order;
    this.showOverlay();
    // setTimeout(()=>{
    //
    //   console.log("customKey==>",this.customKey);
    //
    // },3000)
    const options = {
      url: "limsrest/order/info/cmSampleCode",
      type: "json",
      method: "POST",
      parames:{
        sampleCodeType: value,
        orderId : order.orderId,
        orderCode : order.orderCode,
        sampleNewCount : order.sampleNewCount
      }
    }
    httpFetch(options,(res)=>{
      Overlay.hide(this.customKey); //关闭遮罩
      order.sampleCode = res.data.newSampleCodes;
      console.log("数据======：",res);
      this.setState({
        order
      })
      Toast.message("条码生成成功");

    },(error)=>{
      Toast.message(error);
    })
  }



  showOverlay() {
    let overlayView = (
      <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        modal={true}
        overlayOpacity= {null}
        >
        <View style={{backgroundColor: '#666', padding: px2dp(20), borderRadius: px2dp(10), alignItems: 'center'}}>
          <ActivityIndicator size='small' color='#fbfbfd' />
          <Label style={{color: '#fbfbfd'}} size='sm' text="操作中" />
        </View>
      </Overlay.View>
    );
    this.customKey = Overlay.show(overlayView);

  }

  // 任务抢单 审核 和要求修改
  orderTaskGrabReview (flag,order) {

    this.showOverlay();
    //this.getOrderDetail();
    const options = {
      url: "limsrest/order/info/lab/receive",
      method: "POST",
      parames:{
        orderId: order.orderId,
        taskId: order.taskId,
        partApproved: flag
      }
    }
    //Toast.message(flag ? "审核通过" : "打回成功");
    console.log(options);

    httpFetch(options,(res)=>{

      console.log("数据======：",res);
      this.getOrderDetail();
      Toast.message(flag ? "审核通过" : "打回成功")

    },(error)=>{
      Toast.message(error)
    })
  }


  componentDidMount(){
    this.setState({
      loaded: true
    })
    this.props.navigation.setParams({navigatePress:this.navigationRight})
    this.getOrderDetail();
  }


  getOrderDetail () {

    const { order } = this.props.navigation.state.params;

    const orderId = order.orderId
    const options = {
      url: "limsrest/order/info/f",
      method: "POST",
      parames:{
        orderId: orderId
      }
    }
    httpFetch(options,(res)=>{

      const order = res.data;
      console.log("数据======：",order);
      this.setState({
        order: order,
        orderClient: order.orderClient,
        omsdList: order.omsdList,
        ompList: order.ompList,
        omsList: order.omsList,
        loaded: false
      });
      Overlay.hide(this.customKey); //关闭遮罩
    },(error)=>{
      Toast.message(error)
    })
  }


  render() {
    const { params } = this.props.navigation.state;
    const { order, orderClient, omsdList, ompList, omsList, loaded } = this.state;
    //const orderClient = order.orderClient.clientName;
    let statuColor = '#666';
    if(order.orderStatusName){
      if(order.orderStatusName.includes("审核完成")){
        statuColor = '#2caf6f';
      }
      if(order.orderStatusName.includes("待审核")){
        statuColor = '#f7ca0b';
      }
    }

    if(loaded){
      return(
        <Loading loading={loaded} text='加载中' />
      )
    }else{
      return (
        <View style={{flex: 1}}>
          <SegmentedView style={{flex: 1}} type='projector'>
            <SegmentedView.Sheet title='基本信息'>
              <ScrollView style={{flex: 1}}>
                 <View style={{flex: 1,marginTop: 5}}>
                    <ListRow  title={order.orderCode} detail={order.orderStatusName} detailStyle={{color: statuColor}} />
                    <ListRow title={'要求实验室单位：'+ order.orderExperimentName} detail={moment(order.gmtCreate).format('YYYY-MM-DD')} />
                    <ListRow title='试验性质' detail={order.orderPropertyName} />
                    <ListRow title='物料专用号' detail={order.materialCode} />
                    <ListRow title='物料名称' detail={order.materialName} />
                    <ListRow title='物料类别' detail={order.materialCategoryId} />
                    <ListRow title={ order.supplierCode } detail={order.supplierName} />
                    <ListRow title='委托单位' detail={orderClient.orderClientCompanyName} />
                    <ListRow title={'委托人：'+ orderClient.clientName} detail={orderClient.clientPhone} />
                    <ListRow title={'送样人：'+ order.orderSendPerson} detail={order.orderSendTelephone} />
                    <ListRow title='样品编码' detail={order.sampleCode} detailStyle={{color: "#106f8e"}}/>
                  </View>
                  <View >
                    <Label text='测试项目' style={styles.testTitle} />
                    {
                      omsdList.map((item,index) => {
                        return(
                          <ListRow key={index} title={item.moduleDetailName} detail={item.standardCode} />
                        )
                      })
                    }

                  </View>
              </ScrollView>
            </SegmentedView.Sheet>
            <SegmentedView.Sheet title='技术参数'>
              <ScrollView style={{flex: 1}}>
                 <View style={{flex: 1,marginTop: 5}}>
                   <ListRow title={
                     <View style={styles.flexContainer}>
                       <View style={styles.cell}>
                         <Label text='参数名称' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='参数值' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='参数单位' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='备注' />
                       </View>
                     </View>
                   } titlePlace='top'   bottomSeparator='full'/>

                   {
                     ompList.map((item,index)=> {
                       return(
                         <ListRow key={index} title={
                           <View style={styles.flexContainer}>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.parameterName} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.parameterValue} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.parameterUnitName} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.remark} />
                             </View>
                           </View>
                         } titlePlace='top' bottomSeparator='full' />
                       )
                     })
                   }
                 </View>
             </ScrollView>
            </SegmentedView.Sheet>

            <SegmentedView.Sheet title='主要部件'>
              <ScrollView style={{flex: 1}}>
                 <View style={{flex: 1,marginTop: 5}}>
                   <ListRow title={
                     <View style={styles.flexContainer}>
                       <View style={styles.cell}>
                         <Label text='名称' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='专用号' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='物料名称' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='供应商' />
                       </View>
                     </View>
                   } titlePlace='top'   bottomSeparator='full'/>

                   {
                     omsList.map((item,index)=> {
                       return(
                         <ListRow key={index} title={
                           <View style={styles.flexContainer}>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.mainPartValue} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.materialCode} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.materialName} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.supplierName} />
                             </View>
                           </View>
                         } titlePlace='top' bottomSeparator='full' />
                       )
                     })
                   }
                 </View>
             </ScrollView>
            </SegmentedView.Sheet>
          </SegmentedView>

        </View>

      );
    }
  }

}
const styles = StyleSheet.create({
  testTitle: {
    margin: px2dp(20),
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  headerRightButton: {
    margin: px2dp(20),
    borderRadius: px2dp(4),
    height: px2dp(60),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  flexContainer: {
      flex: 1,
      // 容器需要添加direction才能变成让子元素flex
      flexDirection: 'row',
  },
  cell: {
      flex: 1,
      height: 30,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
  },
  welcome: {
      fontSize: 14,
      textAlign: 'center',
      margin: 10,
  },
});

export default OrderModuleDetail
