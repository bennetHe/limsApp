
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  ToastAndroid,
  NetInfo,
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from "react-native-vector-icons/Ionicons"
import Loading from '../components/Loading';
import MessageList from '../components/MessageList';
import  { httpFetch }  from '../components/Fetch';

class Lims extends Component {
  static navigationOptions = {
    title: 'Lims',
    // header: null,
     gesturesEnabled: false  //是否可以使用手势关闭此屏幕。在iOS上默认为true，在Android上为false
  };

  constructor(props) {
      super(props);
      this.state = {
        menuNav: [],
        loaded: false,
      }
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  componentDidMount(){

    this.getNav();

  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  onBackButtonPressAndroid = () => {
        let {navigation} = this.props;
        if (navigation.isFocused()) {

            if (this.lastPressAndroidBack && this.lastPressAndroidBack + 2000 >= Date.now()) {
                return false
            }
            this.lastPressAndroidBack = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true

        }
        return false;
    };


  getNav(){
    this.setState({
      loaded: true,
    })
    const options = {
      url: "base/resource/menu",
      method: "GET",
    }
    httpFetch(options,(res)=>{
      this.setState({
        menuNav: res.data,
        loaded: false,
      })

    },(error)=>{
      this.setState({
        loaded: false,
      })
    })
  }





  render() {

    const { params,navigate } = this.props.navigation;
    let userInfo = this.props.userInfo;
    const {menuNav,loaded} = this.state;
    if(loaded){
      return(
        <Loading loading={loaded} text='加载中' />
      )
    }else{
      return (
        <View style={styles.limsContainer}>
          <StatusBar barStyle="light-content" />
          {/*<StatusBar barStyle="light-content" />//顶部栏文字为白色 dark-content顶部栏文字为黑色*/}
          <ScrollView style={styles.bigBox}>
            <View style={styles.bigBoxView}>

              <View style={styles.networkBox}>
                  {
                    menuNav.map((menu,index)=>{
                      if(menu.resourceName === "整机订单管理"){

                        return(
                          <View style={{flex: 1, borderBottomColor: '#c8c7cc', borderBottomWidth: 1}} key={index}>
                            <View style={ styles.navTitleView}>
                                <Text style={styles.navTitle}>{menu.resourceName}</Text>
                            </View>
                            <View style={styles.columnStyle}>
                            {
                              menu.childResource.map((nav,key)=>{
                                if(nav.resourceName === "订单接收"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{navigate('OrderReceiveList')}}
                                        >
                                          <Ionicons style={{fontSize: FONT_SIZE(28), color: "#f5cc19"}}  name="md-reorder" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }else if(nav.resourceName === "任务分配"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('OrderAllocationList')}}
                                        >
                                          <Icon style={styles.icon}  name="file-text-o" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }

                              })

                            }
                              <TouchableOpacity  style={styles.iconView}
                                onPress={()=>{this.props.navigation.navigate('Scan')}}
                                >
                                  <Ionicons style={{fontSize: FONT_SIZE(28), color: "#1B82D1"}}  name="md-qr-scanner" />
                                  <Text style={styles.iconNavTitle}>扫一扫</Text>
                              </TouchableOpacity>
                              <TouchableOpacity  style={styles.iconView}
                                onPress={()=>{this.props.navigation.navigate('OrderInspectList')}}
                                >
                                  <Ionicons style={{fontSize: FONT_SIZE(28), color: "#ee5e7b"}}  name="ios-cog" />
                                  <Text style={styles.iconNavTitle}>检测-进行中</Text>
                              </TouchableOpacity>
                              <TouchableOpacity  style={styles.iconView}
                                onPress={()=>{this.props.navigation.navigate('SearchList')}}
                                >
                                  <Ionicons style={{fontSize: FONT_SIZE(28), color: "#e63"}}  name="ios-search" />
                                  <Text style={styles.iconNavTitle}>搜索条码</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      }else if (menu.resourceId === "c41c799b0bc741f680b12fc64cb7d3cd") {
                          return(
                            <View style={{flex: 1, borderBottomColor: '#c8c7cc', borderBottomWidth: 1}} key={index}>
                              <View style={ styles.navTitleView}>
                                  <Text style={styles.navTitle}>{menu.resourceName}</Text>
                              </View>
                              <View style={styles.columnStyle}>
                              {
                                menu.childResource.map((nav,key)=>{
                                  if(nav.resourceName === "待审核"){
                                    return(

                                        <TouchableOpacity key={key+index+1} style={styles.iconView}
                                          onPress={()=>{this.props.navigation.navigate('OrderReportAuditingList')}}
                                          >
                                            <Ionicons style={[styles.icon,{color: "#3B8CFF"}]}  name="md-cube" />
                                            <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                        </TouchableOpacity>

                                    )
                                  }else if(nav.resourceName === "待批准"){
                                    return(
                                        <TouchableOpacity key={key+index+1} style={styles.iconView}
                                          onPress={()=>{this.props.navigation.navigate('OrderReportApprovalList')}}
                                          >
                                            <Ionicons style={[styles.icon,{color: "#E89806"}]}  name="md-egg" />
                                            <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                        </TouchableOpacity>
                                    )
                                  }
                                })
                              }
                              </View>
                            </View>
                          )
                      }else if(menu.resourceName === "样品管理"){

                        return(
                          <View style={{flex: 1, borderBottomColor: '#c8c7cc', borderBottomWidth: 1}} key={index}>
                            <View style={ styles.navTitleView}>
                                <Text style={styles.navTitle}>{menu.resourceName}</Text>
                            </View>
                            <View style={styles.columnStyle}>
                            {
                              menu.childResource.map((nav,key)=>{
                                if(nav.resourceName === "样品收样"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('SampleReceiveList')}}
                                        >
                                          <Ionicons style={[styles.icon,{color: "#0EDAFF"}]}  name="md-log-in" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }else if(nav.resourceName === "样品领用"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('SampleUsesList')}}
                                        >
                                          <Ionicons style={[styles.icon,{color: "#E89806"}]}  name="md-paper" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }else if(nav.resourceName === "样品转交"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('SampleTransferList')}}
                                        >
                                          <Ionicons style={[styles.icon,{color: "#1322FF"}]}  name="md-repeat" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }else if(nav.resourceName === "样品归还"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('SampleBackList')}}
                                        >
                                          <Ionicons style={[styles.icon,{color: "#E8DE32"}]}  name="md-refresh" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }else if(nav.resourceName === "样品退回"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('SampleReturnList')}}
                                        >
                                          <Ionicons style={[styles.icon,{color: "#C315FF"}]}  name="md-log-out" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }

                              })
                            }
                            </View>
                          </View>
                        )
                      }else if(menu.resourceName === "模块订单管理"){
                        return(
                          <View style={{flex: 1, borderBottomColor: '#c8c7cc', borderBottomWidth: 1}} key={index}>
                            <View style={ styles.navTitleView}>
                                <Text style={styles.navTitle}>{menu.resourceName}</Text>
                            </View>
                            <View style={styles.columnStyle}>
                            {
                              menu.childResource.map((nav,key)=>{
                                if(nav.resourceName === "订单接收"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('OrderModuleReceiveList')}}
                                        >
                                          <Ionicons style={{fontSize: FONT_SIZE(28), color: "#f5cc19"}}  name="md-reorder" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }
                                if(nav.resourceName === "任务抢单"){
                                  return(

                                      <TouchableOpacity key={key+index+1} style={styles.iconView}
                                        onPress={()=>{this.props.navigation.navigate('OrderModuleTaskGrabList')}}
                                        >
                                          <Icon style={styles.icon}  name="file-text-o" />
                                          <Text style={styles.iconNavTitle}>{nav.resourceName}</Text>
                                      </TouchableOpacity>

                                  )
                                }

                              })
                            }
                            </View>
                          </View>
                        )
                      }

                    })
                  }

              </View>
            </View>



            <View style={{flex: 1,alignItems: 'center',  marginTop: px2dp(50),marginBottom: px2dp(50)}}>
              <Text>嘿，你好：{userInfo.userName}</Text>
            </View>
            {/*
              *  <View style={{flex: 1, marginTop: 10, marginBottom: 20}}>
              *    <MessageList />
              *  </View>

              <TouchableOpacity  style={styles.iconView}
                onPress={()=>{this.props.navigation.navigate('ImageUpload')}}
                >
                  <Icon style={styles.icon}  name="hand-spock-o" />
                  <Text style={styles.iconNavTitle}>照片</Text>
              </TouchableOpacity>

            <TouchableOpacity  style={styles.iconView}
              onPress={()=>{this.props.navigation.navigate('ImageUpload')}}
              >
                <Icon style={styles.icon}  name="hand-spock-o" />
                <Text style={styles.iconNavTitle}>照片</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.iconView}
              onPress={()=>{this.props.navigation.navigate('OrderInspectList')}}
              >
                <Icon style={styles.icon}  name="file-text-o" />
                <Text style={styles.iconNavTitle}>检测管理</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.iconView}
              onPress={()=>{this.props.navigation.navigate('ScannerScreen')}}
              >
                <Icon style={styles.icon}  name="file-text-o" />
                <Text style={styles.iconNavTitle}>拍照</Text>
            </TouchableOpacity>
              */}

          </ScrollView>

        </View>
      );
    }

  }



}
const styles = StyleSheet.create({

  limsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigBox: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bigBoxView:{
    justifyContent:'center',
    alignItems:'center'
  },
  networkBox:{
    flex: 1,
    alignItems: 'center',
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',

  },
  navTitleView: {
    width: SCREEN_WIDTH,
    height: px2dp(60),
    marginTop: px2dp(15),
    paddingLeft: px2dp(15),
  },
  navTitle: {
    fontSize:FONT_SIZE(12),
    marginTop:8,
    color: '#666'
  },
  columnStyle: {
    width: SCREEN_WIDTH,
    flexDirection:'row',
    flexWrap: 'wrap',
    display:'flex',
    marginTop: px2dp(5),
    marginBottom: px2dp(15),
  },
  icon: {
    fontSize: FONT_SIZE(24),
    color: '#20BCA0'
  },
  iconNavTitle: {
    fontSize: FONT_SIZE(10),
    color: '#333',
    marginTop:8,
  },
  heightView:{
      height:150,
      overflow:'hidden',
  },

  iconView:{
      width: (SCREEN_WIDTH) / 5,
      justifyContent:'center',
      alignItems:'center',
  },
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
)(Lims)
