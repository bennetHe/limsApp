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
  TouchableHighlight,
  Button,
  Image,
  Vibration,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');


class CodeReading extends Component {
  static navigationOptions = {
    title: '扫描',
     //header: null,
     gesturesEnabled: false
  };
  constructor(props) {
      super(props);
      this.state = {
            cameraType: Camera.constants.Type.back,
            torchModeType: Camera.constants.TorchMode.off, // 打开闪光灯
            transCode:'',//条码
            openFlash: false,
            active: true,
            flag:true,
            isEndAnimation:false, //结束动画标记
            fadeInOpacity: new Animated.Value(0), // 初始值
      };
      this._startAnimation = this._startAnimation.bind(this);
  }


  render() {
    const {
        openFlash,
        active,
    } = this.state;
    return (
      <View style={styles.allContainer}>
        <Camera
         ref={(cam) => {
           this.camera = cam;
         }}
         onBarCodeRead={this.onBarCodeRead.bind(this)}
         barCodeTypes={[Camera.constants.BarCodeType.qr]}
         style={styles.cameraStyle}
         barcodeScannerEnabled={true}
         type={this.state.cameraType}
         torchMode = {this.state.torchModeType}
         aspect={Camera.constants.Aspect.fill}>
         <Text style={styles.button} onPress={this.switchCamera.bind(this)}>[切换摄像头]</Text>
         <Text style={styles.button} onPress={this.flashModeCamera.bind(this)}>[打开]</Text>
         <Text style={styles.button} onPress={this.takePicture.bind(this)}>[拍照00]</Text>

           <View style={styles.centerContainer}/>

             <View style={{flexDirection:'row'}}>
                 <View style={styles.fillView}/>
                   <View style={styles.scan}>
                     <View style={{ position: 'absolute', left: 0, top: 0 }}>
                       <View style={{ height: 2, width: px2dp(60), backgroundColor: '#37b44a' }} />
                       <View style={{ height: px2dp(60), width: 2, backgroundColor: '#37b44a' }} />
                     </View>
                     <View style={{ position: 'absolute', right: 1, top: -1, transform: [{rotate: '90deg'}] }}>
                        <View style={{ height: 2, width: px2dp(60), backgroundColor: '#37b44a' }} />
                        <View style={{ height: px2dp(60), width: 2, backgroundColor: '#37b44a' }} />
                      </View>
                      <View style={{ position: 'absolute', left: 1, bottom: -1, transform: [{rotateZ: '-90deg'}] }}>
                        <View style={{ height: 2, width: px2dp(60), backgroundColor: '#37b44a' }} />
                        <View style={{ height: px2dp(60), width: 2, backgroundColor: '#37b44a' }} />
                      </View>
                      <View style={{ position: 'absolute', right: 0, bottom: 0, transform: [{rotateZ: '180deg'}] }}>
                        <View style={{ height: 2, width: px2dp(60), backgroundColor: '#37b44a' }} />
                        <View style={{ height: px2dp(60), width: 2, backgroundColor: '#37b44a' }} />
                      </View>

                     <Animated.View style={[styles.scanLine, {
                        height: px2dp(2),
                        backgroundColor: '#37b44a',
                        transform: [{
                          translateY: this.state.fadeInOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 220]
                          })
                        }]
                      }]} />
                 </View>
                 <View style={styles.fillView}/>
             </View>

             <View style={styles.bottomContainer}>
                 <Text
                     style={[
                         styles.text,
                         {
                             textAlign: 'center',
                             width: 220,
                             marginTop: active ? 25 : 245,
                         },
                     ]}
                     numberOfLines={2}
                 >
                     将二维码放入框内，即可自动扫描
                 </Text>
                 <TouchableOpacity onPress={this.flashModeCamera.bind(this)}>
                     <View style={styles.flash}>
                         <Icon style={styles.icon}  name="bolt" />
                         <Text style={styles.text}>
                             开灯/关灯
                         </Text>
                     </View>
                 </TouchableOpacity>
             </View>

       </Camera>


      </View>
    );
  }
  componentDidMount() {
      this._startAnimation(false);
  }
  //开始动画，循环播放
  _startAnimation(isEnd) {
      Animated.timing(this.state.fadeInOpacity, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear
      }).start(
          () => {
              if (isEnd){
                  this.setState({
                      isEndAnimation:true
                  });
                  return;
              }
              if (!this.state.isEndAnimation){
                  this.state.fadeInOpacity.setValue(0);
                  this._startAnimation(false)
              }
          }
      );
      console.log("开始动画");
  }


  //返回按钮点击事件
  _goBack() {
      this.setState({
          isEndAnimation:true,
      });
      // this.props.navigator.pop();
  }

  flashModeCamera(){

    var state = this.state;
    if(state.torchModeType === Camera.constants.TorchMode.on) {
      console.log("======================================",state);
      state.torchModeType = Camera.constants.TorchMode.off;
    }else{
      console.log("--------------------------------------",state);
      state.torchModeType = Camera.constants.TorchMode.on;
    }

    this.setState(state);
  }


  onBarCodeRead(e) {
    if (e.data !== this.transCode) {
        //Vibration.vibrate([0, 500, 200, 500]);
        this.transCode = e.data; // 放在this上，防止触发多次，setstate有延时
        if(this.state.flag){
            this.changeState(false);
            //通过条码编号获取数据
        }
        alert("Type: " + e.type + "\nData: " + e.data);
        console.log("transCode="+this.transCode);
    }

  }

  //改变请求状态
  changeState(status){
      this.setState({
          flag:status
      });
      console.log('status='+status);
  }

  //切换前后摄像头
  switchCamera() {
    var state = this.state;
    if(state.cameraType === Camera.constants.Type.back) {
      state.cameraType = Camera.constants.Type.front;
    }else{
      state.cameraType = Camera.constants.Type.back;
    }
    console.log("+++++++++++++++++++++++++++++++++",state);
    this.setState(state);
  }

  //拍摄照片
  takePicture() {
     if (this.camera) {
       const options = {};
       //alert(JSON.stringify(this.camera));
       //options.location = ...
       this.camera.capture({metadata: options})
       .then((data) => {
         console.log("----------------------------------path",data.path)
         alert("拍照成功！图片保存地址：\n"+data.path)
       })
       .catch(err => {
         console.log("----------------------------------err",err)
         alert(err)
       });
     }


    // this.camera.capture()
    //   .then(function(data){
    //     alert("拍照成功！图片保存地址：\n"+data.path)
    //   })
    //   .catch(err => console.error(err));
  }

}
const styles =StyleSheet.create({
    allContainer:{
        flex:1,
    },
    container: {
        ...Platform.select({
            ios: {
                height: 64,
            },
            android: {
                height: 50
            }
        }),
        backgroundColor:'#000',
        opacity:0.5
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            }
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex:0,
        justifyContent: 'center',
    },
    backImg: {
        marginLeft: 10,
    },
    cameraStyle: {
        alignSelf: 'center',
        width: width,
        height: height,
    },
    flash: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
    flashIcon: {
        fontSize: 1,
        color: '#fff',
    },
    text: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5
    },
    icon:{
        color: '#fff',
        fontSize: 20,
    },
    scanLine:{
        alignSelf:'center',
        width: px2dp(500),
    },
    centerContainer:{
        ...Platform.select({
            ios: {
                height: 80,
            },
            android: {
                height: 60,
            }
        }),
        width: width,
        backgroundColor: '#000',
        opacity: 0.5
    },
    bottomContainer:{
        alignItems: 'center',
        backgroundColor: '#000',
        alignSelf: 'center',
        opacity: 0.5,
        flex: 1,
        width:width
    },
    fillView:{
        width: (width-220)/2,
        height: 220,
        backgroundColor: '#000',
        opacity: 0.5
    },
    scan:{
        width:  px2dp(500),
        height: 220,
        alignSelf: 'center'
    }

});


export default CodeReading
