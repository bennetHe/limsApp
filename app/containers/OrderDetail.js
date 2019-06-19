
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
import { ListRow, Label, SegmentedView, ActionSheet, Button, Overlay } from 'teaset';
import moment from 'moment';
import  { httpFetch }  from '../components/Fetch';
import Loading from '../components/Loading';
import { orderReportAuditing, orderReportEdit, orderReportApproval, orderReportApprovalEdit } from './Report/Auditing';

let that;

class OrderDetail extends Component  {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "订单详情",
    showBackButton: true,
    headerRight: <Button
          titleStyle={{color:'#06E0E8',fontSize: FONT_SIZE(14), fontWeight: 'bold'}}
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
      omasdList: [], //测试项目
      loaded: false,
    }
    this.customKey = null;
    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.showOverlay = this.showOverlay.bind(this);
  }


  /**
   * 右上角按按 弹出选择菜单
   * @return {[type]} [description]
   */
  navigationRight () {
    const order = that.state.order;
    const { scan } = that.props.navigation.state.params;
    let items = [];
    if(!scan){ //如果不是从扫描条码页面进来的
      if(order.orderStatus === "order_machine_status_3"){
        items = [
         {title: '接收', onPress: () => that.props.navigation.navigate('OrderReceive',{
           order: order
         })},
         {title: '要求修改', onPress: () => that.props.navigation.navigate('OrderRequestModification',{
           order: order,
           url: 'limsrest/order/orderMachine/receive',
           page: 'receive'
         })},
       ];
      }else if(order.orderStatus === "order_machine_status_2"){
        items = [
         {title: '接收样品', onPress: () => that.props.navigation.navigate('SampleCodeReceive',{
           order: order
         })},
         {title: '要求修改', onPress: () => that.props.navigation.navigate('OrderRequestModification',{
           order: order,
           url: 'limsrest/order/orderMachine/receive',
           page: 'receive'
         })},
       ];
      }else if(order.orderStatus === "order_machine_status_4"){
        items = [
         {title: '审核通过', onPress: () => Alert.alert(
           '提示',
           '您确定要审核通过吗？',
           [
             {text: '确定', onPress: () => that.orderAllocationReview(order)},
             {text: '取消',  style: 'cancel'},
           ],
           { cancelable: false }
         )},
         {title: '要求修改', onPress: () => that.props.navigation.navigate('OrderRequestModification',{
           order: order,
           url: 'limsrest/order/orderMachine/audit',
           page: 'allocated'
         })},
       ];
     }else if(order.orderStatus === "order_machine_status_5" || order.inspectStatus === "inspect_status_0"){
        items = [
         {title: '检测过程', onPress: () => that.props.navigation.navigate('OrderInspectProcessItems',{
           order: order,
         })},
       ];
     }else if(order.orderStatus === "inspect_status_1" || order.inspectStatus === "inspect_status_1"){
         items = [
            {title: '报告审核通过', onPress: () => orderReportAuditing(order,that.getOrderDetail,that.showOverlay)},
            {title: '审核要求修改', onPress: () => orderReportEdit(order,that.getOrderDetail,that.showOverlay)},
          ];
       }else if(order.orderStatus === "inspect_status_2" || order.inspectStatus === "inspect_status_2"){
           items = [
              {title: '审批通过', onPress: () => orderReportApproval(order,that.getOrderDetail,that.showOverlay)},
              {title: '审批要求修改', onPress: () => orderReportApprovalEdit(order,that.getOrderDetail,that.showOverlay)},
            ];
         }
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

  // showOverlay() {
  //   let overlayView = (
  //     <Overlay.View
  //       style={{alignItems: 'center', justifyContent: 'center'}}
  //       modal={true}
  //       overlayOpacity= {null}
  //       >
  //       <View style={{backgroundColor: '#666', padding: px2dp(20), borderRadius: px2dp(10), alignItems: 'center'}}>
  //         <ActivityIndicator size='small' color='#fbfbfd' />
  //         <Label style={{color: '#fbfbfd'}} size='sm' text="操作中" />
  //       </View>
  //     </Overlay.View>
  //   );
  //   this.customKey = Overlay.show(overlayView);
  //
  // }



  orderAllocationReview (order) {

    this.showOverlay();
    const options = {
      url: "limsrest/order/orderMachine/audit",
      method: "POST",
      parames:{
        orderId: order.orderId,
        taskId: order.taskId,
        partApproved: 'labTrue'
      }
    }
    httpFetch(options,(res)=>{

      //console.log("数据======：",res);
      this.getOrderDetail();

    },(error)=>{
      Overlay.hide(this.customKey);
      Toast.message(error);
    })
  }




  componentDidMount(){
    this.setState({
      loaded: true
    })
    this.props.navigation.setParams({navigatePress:this.navigationRight});
    this.getOrderDetail();

  }


  getOrderDetail () {
    const { order } = this.props.navigation.state.params;

    const orderId = order.orderId,
          orderInspectInfoId = order.orderInspectInfoId;

    const options = {
      url: "limsrest/order/orderMachine/f",
      method: "POST",
      parames:{
        orderId: orderId
      }
    }
    httpFetch(options,(res)=>{
      let order = res.data;
      order.orderInspectInfoId = orderInspectInfoId;
      this.setState({
        order: order,
        orderClient: order.orderClient,
        omasdList: order.omasdList,
      });
      this.getOrderInspectItem(orderId);
      Overlay.hide(this.customKey); //关闭遮罩
    },(error)=>{
      this.setState({loaded: false})
      Overlay.hide(this.customKey);
      //Toast.message(error);
    })
  }

  /**
   * 请求测试项目
   * 因为订单详情没有测试项目状态，所以单独请求
   */
  getOrderInspectItem =(orderId)=> {

    const options = {
      url: "limsrest/inspect/machine/info/getOrderBaseInfo",
      method: "POST",
      parames:{
        orderId: orderId
      }
    }
    httpFetch(options,(res)=>{

      const orderInspect = res.data;
      this.setState({
        omasdList: orderInspect.orderInfo.omasdList,
        loaded: false
      });
      Overlay.hide(this.customKey); //关闭遮罩
    },(error)=>{
      this.setState({loaded: false})
      Overlay.hide(this.customKey); //关闭遮罩
      //Toast.message(error);
    })
  }


  render() {
    const { params } = this.props.navigation.state;
    const { order, orderClient, omasdList, loaded } = this.state;
    //const orderClient = order.orderClient.clientName;
    const oppList = order.oppList ? order.oppList : [];
    const opmpList = order.opmpList ? order.opmpList : [];
    const sampleCode = `${order.newOrderSampleCodelist},${order.reuseOrderSampleCodelist}`;
    let newRelationCode = "";
    if(order.remark){
      const index = order.remark.indexOf(';##');
      newRelationCode = order.remark.substring(0,index);
    }
    // let newRelationCode = "", relationCodeArr = []; // 显示关联的生产码
    // //处理关联的生产码
    // if(order.producturelineName == 'fridge'){  //如果是冰箱
    //   if(order.sprList.length>0){
    //     order.sprList.map((e,index)=>{
    //       if(e.printCode){
    //         relationCodeArr.push(e.sampleCode+'='+e.printCode)
    //       }
    //     })
    //     newRelationCode = relationCodeArr.join("，")
    //   }
    // }else if(order.producturelineName == 'airconditioning'){ //如果是空调
    //   if(order.sprList.length>0){
    //     order.sprList.map((e,index)=>{
    //       if(e.innerMachinePrintCodes || e.outerMachinePrintCodes || e.wholeMachinePrintCodes){
    //         relationCodeArr.push(e.sampleCode+ '已关联')
    //       }
    //     })
    //     newRelationCode = relationCodeArr.join("，")
    //   }
    // }

    let statuColor = '#666';
    if(order.orderStatus === "order_machine_status_3"){
      statuColor = '#2caf6f';
    }
    if(order.orderStatus === "order_machine_status_5"){
      statuColor = '#f7ca0b';
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

                 <View style={{flex: 1, marginTop: 5}}>
                    <ListRow  title={order.orderCode} detail={order.orderStatusName} detailStyle={{color: statuColor}} />
                    <ListRow title={'实验室：'+ order.orderExperimentName} detail={moment(order.gmtCreate).format('YYYY-MM-DD')} />
                    <ListRow title='试验性质' detail={order.orderPropertyName} />
                    <ListRow title='试验目的' detail={order.orderPurposeName} />
                    <ListRow title='产品编码' detail={order.productTypeCode} />
                    <ListRow title='型号名称' detail={order.productTypeName} />
                    <ListRow title='产品名称' detail={order.productName} />
                    <ListRow title='试品编码' detail={sampleCode} />
                    <ListRow title='生产码' detail={newRelationCode} titlePlace={newRelationCode ? 'top' : 'left'}/>
                    <ListRow title='要求试验部门' detail={orderClient.clientDepartmentName} />
                    <ListRow title='要求完成日期' detail={moment(order.orderFinishDate).format('YYYY-MM-DD')} />
                    <ListRow title='委托单位' detail={orderClient.orderClientCompanyName} />
                    <ListRow title={'委托人：'+ orderClient.clientName} detail={orderClient.clientPhone} />
                    <ListRow title={'送样人：'+ order.orderSendPerson} detail={order.orderSendTelephone} />
                  </View>
                  <View style={{flex: 1}}>
                    <View style={styles.testTitle}>
                      <View style={styles.cell}>
                        <Label text="检验标准" />
                      </View>
                      <View style={styles.cell}>
                        <Label text="检验项目" />
                      </View>
                      <View style={styles.itmeStatus}>
                        <Label text="检验状态"/>
                      </View>
                    </View>
                      {
                        omasdList.map((item,index) => {
                          let statusColor = 'red';
                          if(item.testResult == '检测中'){
                            statusColor = '#108ee9'
                          }else if(item.testResult == '检测完成'){
                            statusColor = '#2caf6f'
                          }
                          return(
                            <ListRow key={index} title={
                              <View style={styles.flexContainer}>
                                <View style={styles.cell}>
                                  <Label text={item.standardCode} />
                                </View>
                                <View style={styles.cell}>
                                  <Label text={item.machineDetailName} />
                                </View>
                                <View style={styles.itmeStatus}>
                                  <Label style={{color: statusColor}}
                                    text={
                                      item.testResult
                                      ? (item.testResult == '检测完成' ? item.singleJudge : item.testResult)
                                      : '未检测'
                                    }
                                  />
                                </View>
                              </View>
                            }
                            titlePlace='top'
                            bottomSeparator='full'
                          />
                          )
                        })

                      }
                    {/*
                      omasdList.map((item,index) => {
                        return(
                          <ListRow key={index} title={item.machineDetailName} detail={item.standardCode} />
                        )
                      })
                    */}

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
                     oppList.map((item,index)=> {
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
                         <Label text='规格' />
                       </View>
                       <View style={styles.cell}>
                         <Label text='供应商' />
                       </View>
                     </View>
                   } titlePlace='top'   bottomSeparator='full'/>

                   {
                     opmpList.map((item,index)=> {
                       return(
                         <ListRow key={index} title={
                           <View style={styles.flexContainer}>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.productMainPartName} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.materialCode} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.specification} />
                             </View>
                             <View style={styles.cell}>
                               <Label type='detail' text={item.supplierCode} />
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
    flex: 1,
    flexDirection: "row",
    marginLeft: px2dp(20),
    marginRight: px2dp(20),
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
  itmeStatus: {
    height: 30,
    width: px2dp(120),
    justifyContent: "center",
    alignItems: "center"
  }

});

export default OrderDetail
