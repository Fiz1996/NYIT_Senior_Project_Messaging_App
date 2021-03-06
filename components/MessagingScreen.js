import React, { Component } from 'react';
import { View, StyleSheet,SafeAreaView} from 'react-native';
import MessageEditor from './MessageEditor'
import Message from './Message'
import { FlatList } from 'react-native-gesture-handler';
import{getGroupMessages} from "../api/MessagingAppAPI"
import{sendMessage,getUserInfo,getCurrentUserID} from "../api/MessagingAppAPI"

export default class MessagingScreen extends Component {

  constructor(props){
    super(props)
    this.state = { 
      text: "",
      messageList: [],
      userName: ""
    }
    this.gid = this.props.route.params.id
    this.uid = getCurrentUserID()
  }

  componentDidMount(){
    getGroupMessages(this.gid,this.retrieveMessages).then( (unsub) => this.unsubscribe = unsub )
    getUserInfo(this.uid,this.updateUserInfo)
  }

  componentWillUnmount(){
    this.unsubscribe()
  }

  retrieveMessages = (messages) =>{this.setState({messageList: messages})}

  updateUserInfo = (input) =>{this.setState({userName: input.UserName})}

  updateText = (input) => {this.setState({text: input})}
  
  sendMessage = () => {
    if(this.state.text !== ''){
      sendMessage(this.gid,this.state.text,this.state.userName,this.uid)
      //updating state and clearing input text
      this.setState({
        text: ""
      })
    }
  }

  render() {

    return (
      <SafeAreaView style={{flex:1}}>
      <View style={styles.content_container}>
        <FlatList
          style={styles.message_area_container} 
          data = {this.state.messageList}
          renderItem = {({item}) => (
            <Message
              sender_name = {item.SenderName}
              message_text = {item.MessageText}
              sent = {this.uid === item.SenderID}
            />
          )}
          keyExtractor = {item => item.GroupID}
        />
        <MessageEditor button_handler={this.sendMessage} update_text ={this.updateText}/>
      </View>
      </SafeAreaView>
    );
  }
} 

const styles = StyleSheet.create({
  content_container:{
    flex:1,
    flexDirection: 'column',
    backgroundColor: '#5F6362',
  },
  message_area_container:{
    flex: 1,
    flexDirection: "column",
    backgroundColor: 'lightgrey',
    marginBottom: 15
  }
})