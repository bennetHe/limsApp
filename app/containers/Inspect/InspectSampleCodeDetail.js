/**
 * 整机订单检测过程
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
  Image,
  SectionList
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment'
import { ListRow, Label, Toast, Button, PullPicker,Overlay } from 'teaset';
import  { httpFetch, uploadPhoto, imageFetch }  from '../../components/Fetch';
import Loading from '../../components/Loading';

import UploadImage from '../../components/ImageUpload';
import InspectDevice from './InspectDevice';
import Ionicons from "react-native-vector-icons/Ionicons"

let _this;

class InspectSampleCodeDetail extends Component {
  static navigationOptions = ({navigation, screenProps})=> ({
    title: "检测信息",
    showBackButton: true,
    headerRight: <Button
          titleStyle={{color:'#fff'}}
          onPress={()=>_this.saveInspece()}
          title='保存'
          type='link'
        />,
    //gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  });
  constructor(props) {
      super(props);
      _this = this;
      this.state = {
        tableIndex: null,
        tableId: null, //台位Id
        deviceIds: null,
        deviceNames: null,
        beginTime: null,
        endTime: null
      }
      this.fileUrl = [];
      this.fileName = [];
      this.tableItems = [];
      this.positionData = [];
      this.customKey = null;
  }

  componentDidMount(){
    const { codeInspect } = this.props.navigation.state.params;

    this.getTestPosition(codeInspect); // 获取测试台位

  }



  /**
   * 选择台位
   */
  selectTestTable =()=>{
    PullPicker.show(
      '请选择 台位',
      this.tableItems,
      this.state.tableIndex,
      (item, index) => {

        const newTable = this.positionData.filter((p) => p.tableName === item)[0];

        this.setState({
          tableIndex: index ,
          tableId: newTable.tableId,
          deviceIds: null,
          deviceNames: null
        })
      }
    );
  }

  /**
   * 获取台位信息
   * @param  {[type]} codeInspect 样品信息
   */
  getTestPosition = (codeInspect) => {
    const options = {
      url: "limsrest/position/table/listByStructureId",
      method: "POST",
      parames:{
        structureId: codeInspect.orderExperimentId
      }
    }
    httpFetch(options,(res)=>{
      //this.tableItems = []
      const position = res.data;
      for (let p of position) {
        this.tableItems.push(p.tableName);
      }
      this.positionData = position;

      //给已选择的台位赋值
      if(codeInspect.omippList){ // 如果已经开测检测了
        const omipp = codeInspect.omippList[0];
        const tableId = omipp.tableId; // 已经选中的台位id
        if(tableId){ //如果选择了台位
          const newObj = position.filter((item) => item.tableId === tableId)[0]; // 已经选中的台位对象

          const positionName = newObj.tableName; //
          const index = this.tableItems.findIndex(item => item === positionName);

          const deviceIds = omipp.deviceIds;
          this.setState({
            tableIndex: index,
            tableId: tableId,
            deviceIds: deviceIds,
            beginTime: omipp.inspectBeginTime,
            endTime: omipp.inspectEndTime
          });
          this.getTestDevice(codeInspect.orderExperimentId,tableId,deviceIds)
        }
      }
    },(error)=>{
      Toast.message(error);
    })
  }

  /**
   * 获取设备
   * @param  {[type]} labId   设备ID
   * @param  {[type]} tableId 台位ID
   * @param  {[type]} value   初始化值
   */
  getTestDevice = (labId,tableId,value) => {

    const deviceInfo = {
      labId: labId,
      tableId: tableId
    };
    const defaultList = value ? value.split(",") : [];
    const options = {
      url: "limsrest/device/listByOnlyTableId",
      method: "POST",
      parames: deviceInfo
    }
    httpFetch(options,(res)=>{

      const device = res.data;

      const defaultItem = [];
      for (let id of defaultList) {

        for (let d of device) {
          if(id === d.deviceId){

            d.select = true;
            defaultItem.push(`${d.deviceName}-(${d.deviceMakeNum})`);
          }

        }
      }
      this.setState({
        deviceNames: defaultItem.join(",")
        // data: device,
        // selectItem: defaultItem
      })
    },(error)=>{
      Toast.message(error);
    })
  }


  /**
   * 选中设备
   */
  checkDevice () {
    //console.log(this.device.state.selectItem);
    const deviceList = this.device.state.selectItem;
    let id = [], name = []; //{ deviceIds } = this.state;

    for (let d of deviceList) {
      id.push(d.deviceId);
      name.push(`${d.deviceName}-(${d.deviceMakeNum})`);
    }
    this.setState({
      deviceIds: id.join(","),
      deviceNames: name.join(","),
    })

    this.overlayPullView && this.overlayPullView.close()
  }


  /**
   * 弹出选择设备
   */
  selectTestDevice(side, modal, rootTransform){
    const { codeInspect } = this.props.navigation.state.params;
    const {tableId,deviceIds} = this.state;
    let overlayView = (
      <Overlay.PullView side={side} modal={modal} rootTransform={rootTransform} ref={v => this.overlayPullView = v}>
        <View style={{ minWidth: 300, minHeight: 300, maxHeight: (SCREEN_HEIGHT - 100),backgroundColor: '#f5f5f5'}}>
          <View style={styles.deviceContainer}>
              <Button title='取消' type='link' onPress={() => this.overlayPullView && this.overlayPullView.close()} />
              <Label text='设备选择'/>
              <Button title='确定'  type='link' onPress={() => this.checkDevice()} />
          </View>

          <InspectDevice ref={device => this.device = device}
            deviceInfo = {{
              labId: codeInspect.orderExperimentId,
              tableId: tableId
            }}
            defaultValue = { deviceIds }
          />

        </View>
      </Overlay.PullView>
    );
    Overlay.show(overlayView);
  }




  render() {
    let userInfo = this.props.userInfo;
    let { tableIndex, deviceNames, beginTime, endTime } = this.state;
    const { codeInspect } = this.props.navigation.state.params;

    const samplePictureUrl = codeInspect.samplePictureUrl ? codeInspect.samplePictureUrl.split(',') : [],
          samplePictureUrlName = codeInspect.samplePictureUrlName ? codeInspect.samplePictureUrlName.split(',') : [];


    let selected = (tableIndex || tableIndex === 0) ? this.tableItems[tableIndex] : null;
    return (
      <View style={styles.container}>
        <ScrollView style={{flex: 1,marginTop: 5}}>

        <ListRow title='测试项目'
          titleStyle={{fontSize: 14, color: '#333'}}
          detail= {codeInspect.standardDetailName}
          bottomSeparator="full"
        />
      <ListRow title='测试编码'
          titleStyle={{fontSize: 14, color: '#333'}}
          detail= {codeInspect.sampleCode}
          bottomSeparator="full"
        />
      <ListRow title='测试台位'
          titleStyle={{fontSize: 14, color: '#333'}}
          detail= { selected }
          onPress={() => {beginTime ? null : this.selectTestTable()}}
          bottomSeparator="full"
        />
      <ListRow title='测试设备'
            titleStyle={{fontSize: 14, color: '#333'}}
            detail= { deviceNames }
            onPress={() => beginTime ? null : (selected ? this.selectTestDevice('bottom', false) : Toast.message("请选择台位"))}
            bottomSeparator="full"
            titlePlace='top'
            detailStyle={{color: '#999'}}
        />

        <UploadImage
          photoList = {samplePictureUrl}
          photoNames = {samplePictureUrlName}
          ref={(img)=>this.img=img}
        />

        <View style={styles.inspectButton}>
          {
            beginTime
            ? <View style={[styles.circle,{backgroundColor:'#d9d9d9',width: px2dp(300),}]}>

                <Ionicons style={styles.icon} name="md-play" />
                <Label text={beginTime} style={{position: 'absolute'}}/>
              </View>
            : <TouchableOpacity
               style={[styles.circle,{backgroundColor:'#31CF0A'}]}
               onPress={this.beginInspece}
               >
               <Ionicons style={styles.icon} name="md-play" />

              </TouchableOpacity>
          }
          {
            beginTime
            ? (
                endTime
                ? <View style={[styles.circle,{backgroundColor:'#d9d9d9',width: px2dp(300),}]}>
                    <Ionicons style={styles.icon} name="md-power" />
                    <Label text={endTime} style={{position: 'absolute'}}/>
                  </View>
                :  <TouchableOpacity
                   style={[styles.circle,{backgroundColor: '#f76260'}]}
                   onPress={this.endInspece}
                   >
                    <Ionicons style={styles.icon} name="md-power" />
                   </TouchableOpacity>
              )
            : <View style={[styles.circle,{backgroundColor:'#d9d9d9'}]}>
                <Ionicons style={styles.icon} name="md-power" />
                <Label text={endTime} style={{position: 'absolute'}}/>
              </View>

          }


          {/*<TouchableOpacity
             style={[styles.circle,{backgroundColor:'#31CF0A'}]}
           >
            <Ionicons style={styles.icon} name="md-play" />

           </TouchableOpacity>

          <TouchableOpacity
             style={[styles.circle,{backgroundColor:'#f76260'}]}
           >
            <Ionicons style={styles.icon} name="md-power" />
           </TouchableOpacity>*/}
        </View>

      </ScrollView>

    </View>
    );
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
          <Label style={{color: '#fbfbfd'}} size='sm' text="保存中..." />
        </View>
      </Overlay.View>
    );
    this.customKey = Overlay.show(overlayView);

  }



  beginInspece =()=> {

    const { orderSampleInfo, codeInspect } = this.props.navigation.state.params;
    const { tableId, deviceIds, deviceNames } = this.state;
    if(tableId === null){
      Toast.message("请选择测试台位！")
      return
    }
    if(deviceIds === null){
      Toast.message("请选择测试设备！")
      return
    }
    this.showOverlay();

    codeInspect.omippList[0].inspectBeginTime = moment().format("YYYY-MM-DD HH:mm:ss");
    const uploadState = this.img.state,
          fileName = uploadState.photoNames,
          fileUrl =  uploadState.photoList,
          uploadfile = uploadState.photos;
    const promises = uploadfile.map ((f)=> {
     return  imageFetch(f);
    });
   //
    Promise.all(promises).then((posts)=> {
      for (let p of posts) {
        fileUrl.push(p.msg);
        fileName.push('手机照片.jpg');
      }
      const file = {fileUrl: fileUrl.join(","),fileName: fileName.join(",")};
      this.inspectSubmit(file, "beginInspece")
    })
  }




  saveInspece =()=> {
    if(!this.img.state){
      return
    }
    this.showOverlay();
    const uploadState = this.img.state,
          fileName = uploadState.photoNames,
          fileUrl =  uploadState.photoList,
          uploadfile = uploadState.photos;
    //console.log("uploadState===",uploadState);
    const promises = uploadfile.map ((f)=> {
     return  imageFetch(f);
    });
   //
    Promise.all(promises).then((posts)=> {
      for (let [index, p] of posts.entries()) {
        fileUrl.push(p.msg);
        fileName.push(`手机照片${index}.jpg`);
      }
      const file = {fileUrl: fileUrl.join(","),fileName: fileName.join(",")};
      this.inspectSubmit(file)
    })
  }


  /**
   * 保存测试过程
   * @param  file 上传的文件
   * @param button 点击的那个按钮
   */
  inspectSubmit = (file, button) => {

    const { orderSampleInfo, codeInspect } = this.props.navigation.state.params;
    const { tableId, deviceIds, deviceNames } = this.state;
    const omisrList = orderSampleInfo.omisrList;

    codeInspect.omippList[0].tableId = tableId;
    codeInspect.omippList[0].deviceIds = deviceIds;
    codeInspect.omippList[0].deviceNames = deviceNames;
    codeInspect.samplePictureUrl = file.fileUrl;
    codeInspect.samplePictureUrlName = file.fileName;
    //codeInspect.samplePictureUrl =
    const index = omisrList.findIndex(item => codeInspect.key === item.key);
    if (index > -1) {
        orderSampleInfo.omisrList.splice(index, 1, codeInspect);
      }

    //console.log(tableId,orderSampleInfo,codeInspect);
    const options = {
      url: "limsrest/inspect/machine/result/createResult",
      method: "POST",
      type: "json",
      parames: orderSampleInfo //JSON.stringify(),
    }
    httpFetch(options,(res)=>{

      if(button === "beginInspece"){
          this.setState({
            beginTime: moment().format("YYYY-MM-DD HH:mm:ss")
          })
          Toast.message("开始测试")
      }else{
        Toast.message("保存成功")
      }
      Overlay.hide(this.customKey); //关闭遮罩
      // const mag = {
      //   icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
      //   title: '操作成功',
      //   magText: orderSample.orderCode+'领用成功！'
      // }
      // navigate('Mag', {
      //   mag: mag
      // });

    },(error)=>{
      if(this.customKey){
        Overlay.hide(this.customKey); //关闭遮罩
      }
      //Toast.message(error)
    })
  }

  endInspece =()=> {
    //this.showOverlay();
    const uploadState = this.img.state,
          fileName = uploadState.photoNames,
          fileUrl =  uploadState.photoList,
          uploadfile = uploadState.photos;

    const promises = uploadfile.map ((f)=> {
     return  imageFetch(f);
    });
   //
    Promise.all(promises).then((posts)=> {
      for (let p of posts) {
        fileUrl.push(p.msg);
        fileName.push('手机照片.jpg');
      }
      const file = {fileUrl: fileUrl.join(","),fileName: fileName.join(",")};
      this.endInspectSubmit(file)
    })
  }

  endInspectSubmit = (file) => {

    const { orderSampleInfo, codeInspect } = this.props.navigation.state.params;
    const { tableId, deviceIds, deviceNames } = this.state;
    const omisrList = orderSampleInfo.omisrList;

    codeInspect.omippList[0].tableId = tableId;
    codeInspect.omippList[0].deviceIds = deviceIds;
    codeInspect.omippList[0].deviceNames = deviceNames;
    codeInspect.omippList[0].inspectEndTime = moment().format("YYYY-MM-DD HH:mm:ss");
    codeInspect.samplePictureUrl = file.fileUrl;
    codeInspect.samplePictureUrlName = file.fileName;
    orderSampleInfo.omisrList = [codeInspect];
    // const index = omisrList.findIndex(item => codeInspect.key === item.key);
    // if (index > -1) {
    //     orderSampleInfo.omisrList.splice(index, 1, codeInspect);
    //   }

    //console.log(tableId,orderSampleInfo);
    const options = {
      url: "limsrest/inspect/machine/result/createResultEndButton",
      method: "POST",
      type: "json",
      parames: orderSampleInfo //JSON.stringify(),
    }
    httpFetch(options,(res)=>{
      this.setState({
        endTime: moment().format("YYYY-MM-DD HH:mm:ss")
      })
      Toast.message("已经结束测试")
      Overlay.hide(this.customKey); //关闭遮罩
      // const mag = {
      //   icon: <Icon name={'check-circle'} size={FONT_SIZE(100)} color={'#09BB07'}/>,
      //   title: '操作成功',
      //   magText: orderSample.orderCode+'领用成功！'
      // }
      // navigate('Mag', {
      //   mag: mag
      // });

    },(error)=>{
      //console.log("-------",this.customKey);
      if(this.customKey){
        Overlay.hide(this.customKey); //关闭遮罩
      }
      //Toast.message(error)
    })
  }
}


const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    avatar: {
        width: px2dp(150),
        height: px2dp(150),
        margin: px2dp(2),
    },

    deviceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center',
      padding: px2dp(12),
      marginBottom: px2dp(20),
      backgroundColor: '#fff'
    },
    inspectButton: {
      flex: 1,
      flexDirection:'row',
      justifyContent:'space-around',
      marginTop: px2dp(20),
    },

    circle: {
      marginRight:10,
      alignItems:'center',
      justifyContent:'center',
      width: px2dp(120),
      height: px2dp(120),
      borderRadius: px2dp(60),
    },
    icon: {
      fontSize: FONT_SIZE(20),
      color: '#fff',
    }

})

function mapStateToProps(state) {
    //console.log(state.userInfo);
    return {
        userInfo: state.userInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InspectSampleCodeDetail)
