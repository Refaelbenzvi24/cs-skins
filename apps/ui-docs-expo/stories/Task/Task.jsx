import {StyleSheet, TextInput, View} from "react-native";
import {styles} from "./styles";
import {css} from "@emotion/react"
import {css as cssNative} from "@emotion/native"


const someStyle = css`
  flex-direction: row;
  flex-wrap: nowrap;
  height: 48px;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #26c6da;
  align-items: center;
  justify-content: space-around;
`


export const Task = ({
	                     task: {id, title, state},
	                     onArchiveTask,
	                     onPinTask,
                     }) => {

	return (
		<View style={cssNative`
    ${someStyle.styles}
    `}>
			<TextInput value={title} editable={false}/>
		</View>
	);
};
