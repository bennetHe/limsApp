
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
      this.navData = []
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

      const syslist = res.data.filter(item =>item.resourceId == "dcdabda6d746802745e11dab34b9c0f9")[0]; //系统管理菜单
      let appMenu = [];
      if(syslist.childResource){
        appMenu = syslist.childResource.filter(item =>item.resourceId == "b54e601bedc24e889c27c6b38fb06bbd")[0]; //limsApp菜单
      }
      
      //b54e601bedc24e889c27c6b38fb06bbd
      this.setState({
        menuNav: appMenu.childResource,
        loaded: false,
      })
     // console.log(this.setMenu(res.data))
    },(error)=>{
      this.setState({
        loaded: false,
      })
    })
  }


  // setMenu=(data)=>{
  //   //let navList = [];
  //   data.map(item=>{
  //     this.navData.push({
  //       resourceId: item.resourceId,
  //       resourceName: item.resourceName
  //     });
  //     //console.log(item.resourceName,"-",item.resourceId);
  //     if(item.childResource){
  //       this.setMenu(item.childResource)
  //     }
  //   })
  //   return this.navData
  // }

 
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
                    menuNav.map((nav,index)=>{
                      return(
                        <View key={index} style={{flex: 1, borderBottomColor: '#c8c7cc', borderBottomWidth: 1}} >
                          <View style={ styles.navTitleView}>
                            <Text style={styles.navTitle}>{nav.resourceName}</Text>
                          </View>
                          <View style={styles.columnStyle}>
                            {
                              nav.childResource 
                              ? (
                                nav.childResource.map((item,i)=>{
                                  return(
                                    <TouchableOpacity key={i} style={styles.iconView}
                                      onPress={()=>{navigate(item.href)}}
                                      >
                                        <Ionicons style={{fontSize: FONT_SIZE(28), color: "#"+item.remark}}  name={item.iconClass} />
                                  <Text style={styles.iconNavTitle}>{item.resourceName}</Text>
                                    </TouchableOpacity>
                                  )
                                })
                                )
                              : null
                            }
                          </View>
                        </View>
                      )
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
