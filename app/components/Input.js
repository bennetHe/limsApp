import React, { Component } from 'react';
import { TextInput, View, Text, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';

class Input extends Component {



	render() {
		const { label, value, onChangeText, placeholder, secureTextEntry, editable, maxLength, titleColor, themeColor, styleInput } = this.props;
		const { inputStyle, labelStyle, containerStyle } = styles;
		if (label) {
			return (
				<View style={ containerStyle }>

					<Text style={ labelStyle }>{ label }</Text>

					<TextInput
						secureTextEntry={ secureTextEntry }
						autoCapitalize="none"
						placeholder={ placeholder }
						autoCorrect={ false }
						style={ [ inputStyle, { color: titleColor }, styleInput ] }
						value={ value }
						onChangeText={ onChangeText }
						editable = { editable }
						maxLength = { maxLength }
						selectionColor = { themeColor }
						clearButtonMode = "while-editing"
						textAlignVertical = "center"
						underlineColorAndroid = "transparent"
						placeholderTextColor="#c7c7c7"
					/>
				</View>
			);
		}
		else {
			return(
				<TextInput {...this.props}
					placeholderTextColor="#c7c7c7"
					underlineColorAndroid='transparent'
				/>
			)
		}
	}
};

const styles = StyleSheet.create({
	inputStyle:{
		paddingRight: 5,
		paddingLeft: 5,
		fontSize: 14,
		flex: 8,
		alignSelf:'center',
		width: '100%',
		height: '100%',
	},
	labelStyle: {
		fontSize: 18,
		paddingLeft: 10,
		flex: 1,
		alignSelf: 'center'
	},
	containerStyle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		minHeight: 42,
	}
});

// const mapStateToProps = state => {
// 	return {
// 		titleColor: state.themes.titleColor,
// 		themeColor: state.themes.themeColor,
// 	};
// };
//
// Input = connect(mapStateToProps)(Input);

export default Input;
