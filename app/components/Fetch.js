
'use strict';

import { NetInfo } from 'react-native';
import NavigationService from '../NavigationService';
import { Overlay } from 'teaset';
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = [], idx = 0) {
  // for (let item in obj) {
//     arr[idx++] = [item, obj[item]]
//   }
//   return new URLSearchParams(arr).toString()
	for (let key in obj) {
            if (obj[key] != null) {
                arr.push(key + '=' + obj[key])
            }
        }

    return arr.join('&')

}

/**
 * fetch 封装的 POST、GET请求
 * @param   options 请求参数
 * @param   callBackSuccess 请求成功返回函数
 * @param   callBackError   请求失败返回函数
 */
 export function httpFetch (options, callBackSuccess, callBackError){

	// 是否连接网络
	NetInfo.isConnected.fetch().then(isConnected => {

		 if(isConnected){
			    // 地址
			    let baseUrl = 'http://cosmolimsapp.haier.net/';

			   // if(options.url.startsWith('base')){
					//  //baseUrl = 'http://10.10.7.92:8090/'
			   //   //baseUrl = 'http://cosmo.haier.net/'  //正式
			   //   baseUrl = 'http://cosmolimsapp.haier.net/'
			   // }else if(options.url.startsWith('limsrest')){
					//  //baseUrl = 'http://10.10.7.92:9098/'
			   //   baseUrl = 'http://cosmolimsapp.haier.net/'  //正式
			   //   //baseUrl = 'http://cosmo.haier.net/'
			   // }
			   //console.log("-------------",baseUrl+options.url);

			    let url = options.url,
			        method = options.method || "POST",
			        parames = options.parames || {},
			        type = options.type || null; //标志是否使用JOSN字符串传参
			          // header = options.header || {'Content-Type': 'application/json','Accept': 'application/json'};

			     if(typeof(url) == "undefined" || url == null || url.length==0){
			       //console.log("-------请求地址不能为空--------");
			       return
			     }

			     const searchStr = obj2String(parames);
			     //console.log("searchStr=========",baseUrl+options.url,searchStr);
			     let _options = {};
			     if (method === 'GET') { // 如果是GET请求，拼接url
			         searchStr ? (url += '?' + searchStr) : url;
			         _options = {
			           method: method, //如果为GET方式，则不要添加body，否则会出错    GET/POST
			           credentials : 'same-origin',
			         }
			     }else if(method === 'POST'){
			       if(type === 'json'){
			         _options = {
			               method: method, //如果为GET方式，则不要添加body，否则会出错    GET/POST

			               headers: options.header || new Headers({   //请求头
			                 'Accept': 'application/json',
			                 "Content-Type": "application/json; charset=UTF-8"
			               }),
			               credentials : 'same-origin',
			               body: JSON.stringify(parames) //请求参数
			             }
			       }else{
			         _options = {
			               method: method, //如果为GET方式，则不要添加body，否则会出错    GET/POST

			               headers: options.header || new Headers({   //请求头
			                 'Accept': 'application/json',
			                 'Content-Type': 'application/x-www-form-urlencoded',
			               }),
			               credentials : 'same-origin',
			               body: searchStr //请求参数
			             }
			       }

			     }

			     fetch(baseUrl+url,_options)
			      .then((response) => {
			        //Alert("内部服务器错误，请联系管理员！");
			       //console.log("===============",response);
			        if(response.status === 200){
			          return response.json()
			        }else if(response.status === 500){

			          Alert.alert("错误","内部服务器错误，请联系管理员！");
			        }

			      }) //将数据转成json,也可以转成 response.text、response.html
			      .then((responseJson) => { //获取转化后的数据responseJson、responseText、responseHtml
			         const code = responseJson.code;
			         if(code === "-1"){
								 Overlay.hide(1);
			           //Alert.alert("警告","登录超时"+responseJson.mag);
								 Alert.alert(
					         '提示',
					         '由于长时间没有操作，登录超时，请重新登录',
					         [
					           {text: '去登录', onPress: () => NavigationService.navigate('Login')},
					         ]
					       )
			         } else if (code !== "1"){

			           //console.log(responseJson.msg);
			           Alert.alert("警告",responseJson.msg)
			           //失败回调
			           callBackError(responseJson);
			         }else{
			           //成功回调
			           callBackSuccess(responseJson); //JSON.stringify()避免出现烦人的[object object]
			         }

			      }).catch((error) => {
							callBackError(error);
			         console.log("错误信息=",error);
			          //console.error("错误信息",error)
			     });

		 }else{
			 Toast.message('请检查您的网络连接');
		 }

	});

 }


export function uploadPhoto (file, success, error){
	for (let f of file) {
	  imageFetch(f, success, error);
	}
}
/**
 * 上传图片
 * @param   imgFile 请求参数
 * @param   callBackSuccess 请求成功返回函数
 * @param   callBackError   请求失败返回函数
 */
 export function imageFetch (imgFile){
	//  NetInfo.isConnected.fetch().then(isConnected => {
 //
	//  	if(isConnected){
	// 	}else{
	// 		Toast.message('请检查您的网络连接');
	// 	}
 //
 // });
	 		let formData = new FormData();
	 			 const fileUlI = imgFile.uri,
	 						 index = fileUlI.search(/\/[^\/]*$/g),
	 						 name = fileUlI.substring(index + 1, fileUlI.length);
	 			 const file = {
	 					 uri: imgFile.uri,
	 					 type: 'image/jpeg',
	 					 name: name
	 				 }
	 			 formData.append("file",file);

	 			 // 地址
	 			 const baseUrl = 'http://cosmolimsapp.haier.net/limsrest/file/file',
	 						 options ={
	 							 method: 'POST',
	 							 headers: {
	 								 "Content-Type": "multipart/form-data"
	 							 },
	 							 body: formData,
	 							 credentials: 'same-origin'
	 						 };
	return fetch(baseUrl,options)
						.then((response) => {
							//Alert("内部服务器错误，请联系管理员！");
							//console.log("===============",response);
							if(response.status === 200 ){
								return response.json()
							}else if(response.status === 500){
								Alert.alert("错误","内部服务器错误，请联系管理员！");
							}

						})

 // 是否连接网络
 // NetInfo.isConnected.fetch().then(isConnected => {
 //
	// 	if(isConnected){
 //
	// 		let formData = new FormData();
	// 			 const fileUlI = imgFile.uri,
	// 						 index = fileUlI.search(/\/[^\/]*$/g),
	// 						 name = fileUlI.substring(index + 1, fileUlI.length);
	// 			 const file = {
	// 					 uri: imgFile.uri,
	// 					 type: 'image/jpeg',
	// 					 name: name
	// 				 }
	// 			 formData.append("file",file);
 //
	// 			 // 地址
	// 			 const baseUrl = 'http://10.138.111.96/limsrest/file/file',
	// 						 options ={
	// 							 method: 'POST',
	// 							 headers: {
	// 								 "Content-Type": "multipart/form-data"
	// 							 },
	// 							 body: formData,
	// 							 credentials: 'same-origin'
	// 						 };
	// 			 fetch(baseUrl,options)
	// 				.then((response) => {
	// 					//Alert("内部服务器错误，请联系管理员！");
	// 					//console.log("===============",response);
	// 					if(response.status === 200){
	// 						return response.json()
	// 					}else if(response.status === 500){
	// 						Alert.alert("错误","内部服务器错误，请联系管理员！");
	// 					}
 //
	// 				}) //将数据转成json,也可以转成 response.text、response.html
	// 				.then((responseJson) => { //获取转化后的数据responseJson、responseText、responseHtml
 //
	// 					 callBackSuccess(responseJson);
 //
	// 				}).catch((error) => {
	// 					callBackError(error)
	// 					 //console.log("错误信息=",error);
	// 			 });
 //
	// 	}else{
	// 		Toast.message('请检查您的网络连接');
	// 	}
 //
 // });

 }

 /**
  * 上传图片
  * @param   imgFile 请求参数
  * @param   callBackSuccess 请求成功返回函数
  * @param   callBackError   请求失败返回函数
  */
  // export function imageFetch (imgFile, callBackSuccess, callBackError){
	//
 	// // 是否连接网络
 	// NetInfo.isConnected.fetch().then(isConnected => {
	//
 	// 	 if(isConnected){
	//
	// 		 let formData = new FormData();
	// 				const fileUlI = imgFile.uri,
	//               index = fileUlI.search(/\/[^\/]*$/g),
	//               name = fileUlI.substring(index + 1, fileUlI.length);
	// 				const file = {
	// 						uri: imgFile.uri,
	// 						type: 'image/jpeg',
	// 						name: name
	// 					}
	// 				formData.append("file",file);
	//
 	// 		    // 地址
 	// 		    const baseUrl = 'http://10.138.111.96/limsrest/file/file',
	// 				 			options ={
	// 								method: 'POST',
	// 								headers: {
	// 									"Content-Type": "multipart/form-data"
	// 								},
	// 								body: formData,
	// 								credentials: 'same-origin'
	// 							};
	// 				fetch(baseUrl,options)
	// 				 .then((response) => {
	// 					 //Alert("内部服务器错误，请联系管理员！");
	// 					 //console.log("===============",response);
	// 					 if(response.status === 200){
	// 						 return response.json()
	// 					 }else if(response.status === 500){
	// 						 Alert.alert("错误","内部服务器错误，请联系管理员！");
	// 					 }
	//
	// 				 }) //将数据转成json,也可以转成 response.text、response.html
	// 				 .then((responseJson) => { //获取转化后的数据responseJson、responseText、responseHtml
	//
	// 						callBackSuccess(responseJson);
	//
	// 				 }).catch((error) => {
	// 					 callBackError(error)
	// 						//console.log("错误信息=",error);
	// 				});
	//
 	// 	 }else{
 	// 		 Toast.message('请检查您的网络连接');
 	// 	 }
	//
 	// });
	//
  // }
