/**
 * 样品收样表单
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux'
import  { httpFetch }  from '../components/Fetch';

import {ListRow,Label,Select,Button} from 'teaset'


class SampleReceiveCodeForm extends Component {

  static navigationOptions =({navigation, screenProps}) => ({

    title: navigation.state.params.sample.sampleCode //'接收样品',
     //header: ,
    // gesturesEnabled: false
  });
  constructor(props) {
    super(props);
    this.items = [];
    this.customItems = [
      {
        text: '否',
        value: '0',
      },
      {
        text: '是',
        value: '1',
      }
    ];
    this.itemsYJ = [
      {
        text: '破损',
        value: '0',
      },
      {
        text: '良好',
        value: '1',
      }
    ];
    this.itemsBZYJ = [
      {
        text: '不符',
        value: '0',
      },
      {
        text: '相符',
        value: '1',
      }
    ];
    this.itemsBZFS = [
      {
        text: '手工',
        value: '0',
      },
      {
        text: '工艺',
        value: '1',
      }
    ];
    // const  { sample } = this.props.navigation.state.params;
    //     console.log("======================================",sample);
    this.state = {
      sampleInfo: {},
      valueSM: ''
    }
  }

  componentDidMount(){
      const { labId, sample } = this.props.navigation.state.params;

      this.getLocation(labId,sample);
  }
  //获取库位 根据实验室ID
  getLocation=(labId,sample)=>{
    const options = {
      url: "limsrest/sample/warehouse/listByLabId",
      method: "POST",
      parames:{
        labId: labId,
      }
    }
    httpFetch(options,(res)=>{

      const Location = res.data;

      //console.log("数据======：",Location,sample);
      for (let l of Location) {
        const lab = {
          text: l.warehouseName,
          value: l.warehouseId
        }
        this.items.push(lab);
      }

        // 赋默认值
       sample.sampleOperateNum = sample.sampleCount; // 操作数量
       sample.sampleLocation = sample.sampleLocation ? sample.sampleLocation : Location[0].warehouseId; //库位
       sample.sampleLocationName = sample.sampleLocationName ? sample.sampleLocationName : Location[0].warehouseName; //库位名称
       sample.inputInfoPackage = sample.inputInfoPackage ? sample.inputInfoPackage : '1'; // 包装完整
       sample.inputInfoActuality = sample.inputInfoActuality ? sample.inputInfoActuality : '1'; // 样机状况
       sample.inputInfoInstruction = sample.inputInfoInstruction ? sample.inputInfoInstruction : '1'; // 说明书齐全
       sample.inputInfoAttach = sample.inputInfoAttach ? sample.inputInfoAttach : '1'; // 附件齐全
       sample.inputInfoMetal = sample.inputInfoMetal ? sample.inputInfoMetal : '1'; // 钣金齐全
       sample.inputInfoPackageRight = sample.inputInfoPackageRight ? sample.inputInfoPackageRight : '1'; // 包装标示与样机符合
       sample.inputInfoLabel = sample.inputInfoLabel ? sample.inputInfoLabel : '1'; // 名牌齐全
       sample.inputInfoPackageStyle = sample.inputInfoPackageStyle ? sample.inputInfoPackageStyle : '1'; // 包装方式

       this.setState({sampleInfo: sample});
    },(error)=>{
      console.error("错误信息==",error)
    })
  }



  render() {
    const { sampleInfo } = this.state;
    //console.log("==========数据======：",sampleInfo);
    return (
      <View style={{flex: 1}}>
       <ScrollView style={styles.centent}>
         <ListRow
           title='操作数量'
           detail={sampleInfo.sampleOperateNum}
           topSeparator='full'
           bottomSeparator='full'
          />
       <ListRow
         title='库存位置'
         detail={
           <Select
             style={{width: 200}}
             size='sm'
             value={sampleInfo.sampleLocation}
             items={this.items}
             getItemValue={(item, index) => item.value}
             getItemText={(item, index) => item.text}
             pickerTitle='选择库位'
             onSelected={(item, index) => {this.onSelect(item, index,'sampleLocation','sampleLocationName')}}
          />
         }
         bottomSeparator='full'
        />
        <ListRow
          title='包装完整'
          detail={
            <Select
              style={{width: 200}}
              size='sm'
              value={sampleInfo.inputInfoPackage}
              items={this.customItems}
              getItemValue={(item, index) => item.value}
              getItemText={(item, index) => item.text}
              pickerTitle='选择包装完整'
              onSelected={(item, index) => {this.onSelect(item, index,'inputInfoPackage')}}
              />
          }
          bottomSeparator='full'
         />
       <ListRow
         title='样机状况'
         detail={
           <Select
             style={{width: 200}}
             size='sm'
             value={sampleInfo.inputInfoActuality}
             items={this.itemsYJ}
             getItemValue={(item, index) => item.value}
             getItemText={(item, index) => item.text}
             pickerTitle='选择样机状况'
             onSelected={(item, index) => {this.onSelect(item, index,'inputInfoActuality')}}
             />
         }
         bottomSeparator='full'
        />
        <ListRow
          title='说明书齐全'
          detail={
            <Select
              style={{width: 200}}
              size='sm'
              value={sampleInfo.inputInfoInstruction}
              items={this.customItems}
              getItemValue={(item, index) => item.value}
              getItemText={(item, index) => item.text}
              pickerTitle='选择说明书齐全'
              onSelected={(item, index) => {this.onSelect(item, index,'inputInfoInstruction')}}
              />
          }
          bottomSeparator='full'
         />
         <ListRow
           title='附件齐全'
           detail={
             <Select
               style={{width: 200}}
               size='sm'
               value={sampleInfo.inputInfoAttach}
               items={this.customItems}
               getItemValue={(item, index) => item.value}
               getItemText={(item, index) => item.text}
               pickerTitle='选择附件齐全'
               onSelected={(item, index) => {this.onSelect(item, index,'inputInfoAttach')}}
               />
           }
           bottomSeparator='full'
          />
          <ListRow
            title='钣金齐全'
            detail={
              <Select
                style={{width: 200}}
                size='sm'
                value={sampleInfo.inputInfoMetal}
                items={this.customItems}
                getItemValue={(item, index) => item.value}
                getItemText={(item, index) => item.text}
                pickerTitle='选择钣金齐全'
                onSelected={(item, index) => {this.onSelect(item, index,'inputInfoMetal')}}
                />
            }
            bottomSeparator='full'
           />
           <ListRow
             title='包装标识与样机'
             detail={
               <Select
                 style={{width: 200}}
                 size='sm'
                 value={sampleInfo.inputInfoPackageRight}
                 items={this.itemsBZYJ}
                 getItemValue={(item, index) => item.value}
                 getItemText={(item, index) => item.text}
                 pickerTitle='选择钣金齐全'
                 onSelected={(item, index) => {this.onSelect(item, index,'inputInfoPackageRight')}}
                 />
             }
             bottomSeparator='full'
            />
          <ListRow
            title='铭牌齐全'
            detail={
              <Select
                style={{width: 200}}
                size='sm'
                value={sampleInfo.inputInfoLabel}
                items={this.customItems}
                getItemValue={(item, index) => item.value}
                getItemText={(item, index) => item.text}
                pickerTitle='选择铭牌齐全'
                onSelected={(item, index) => {this.onSelect(item, index,'inputInfoLabel')}}
                />
            }
            bottomSeparator='full'
           />
         <ListRow
           title='包装方式'
           detail={
             <Select
               style={{width: 200}}
               size='sm'
               value={sampleInfo.inputInfoPackageStyle}
               items={this.itemsBZFS}
               getItemValue={(item, index) => item.value}
               getItemText={(item, index) => item.text}
               pickerTitle='选择包装方式'
               onSelected={(item, index) => {this.onSelect(item, index,'inputInfoPackageStyle')}}
               />
           }
           bottomSeparator='full'
          />
        <View style={{flex: 1, marginTop: px2dp(60), flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
          <Button title='确定' type='primary' onPress={() => this.test()} style={{width: '90%'}} />
        </View>
       </ScrollView>

      </View>
    );
  }

  /**
   * 下拉框选择
   * @param  {[type]} item   选择的对象
   * @param  {[type]} index  选择的主键
   * @param  {[type]} column 列表名
   */
  onSelect(item, index,column,name){
    //console.log(item, index,column,name);
    const { sampleInfo } = this.state;
    sampleInfo[column] = item.value;
    if(name){
      sampleInfo[name] = item.text;
    }
    this.setState({ sampleInfo })
  }


  test(){
    const  { block } = this.props.navigation.state.params;
        const { sampleInfo } = this.state;
        //console.log("======================================",sampleInfo);
        //const newSample

        block(sampleInfo);
      //   setTimeout(() => {
          const {goBack} = this.props.navigation;
          goBack();
      // }, 200);
  }
}


const styles = StyleSheet.create({
  centent: {
    flex: 1,
    backgroundColor: '#fff',
  },
})


export default SampleReceiveCodeForm
