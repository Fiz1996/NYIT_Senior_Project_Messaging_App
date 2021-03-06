import React, { Component } from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Group,SafeAreaView } from 'react-native';
import GroupBar from './GroupBar'
import { FlatList, TextInput} from 'react-native-gesture-handler';
import {getAllGroups} from '../api/MessagingAppAPI'
//import{withNavigation} from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';

const plus = <Icon name="plus-circle" size={40} color="#00BED6" />;

export default class GroupScreen extends Component{    
    constructor(props){
        super(props)
        this.state = {
            groupList: [],
            text: ''
        }
        this.getGroups = this.props.get_groups_functions
    }

    componentDidMount(){
        this.getGroups(this.retrieveGroups)
        .then((unsub) => {
            this.unsubscribe = unsub
            console.log("subscribe")})
        .catch((error)=> console.log("GroupScreen: ",error))
    }

    componentWillUnmount(){
        if(this.unsubscribe != null){
            console.log("unsubscribe")
            this.unsubscribe()
        }
    }

    retrieveGroups = (groups) => {
        this.setState({
            groupList: groups
        });
    }

    textChanged = (input) =>{
            this.setState({groupList:[]})
            if(input == ""){
                this.unsubscribe()
                this.getGroups(this.retrieveGroups).then((unsub) => this.unsubscribe = unsub )
            }
            else{
                this.unsubscribe()
                this.getGroups(this.retrieveGroups,input).then((unsub) => this.unsubscribe = unsub )
            }
    }

    render(){
    
        return(
            <SafeAreaView style={{flex:1}}>
            <View style ={styles.container}>

                <View style={styles.header_container}>
                    <TextInput 
                    style = {styles.search_bar}
                    onChangeText = {(input)=>{this.textChanged(input)}}
                    placeholder = {"Search"}
                    />

                    <TouchableOpacity 
                    style = {styles.new_group_button} 
                    onPress={() => this.props.navigation.navigate('CreateGroup')}>
                        {plus}
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data = {this.state.groupList}
                    renderItem={({ item }) => (
                        <GroupBar
                            group_name = {item.GroupName} 
                            date = {item.Date}
                            location = {item.Location}
                            interests = {item.Interests}
                            id = {item.id}
                            bar_style = {styles.bar_container}
                            navigation = {this.props.navigation}
                            votes = {item.Votes}
                        />
                        )}
                    keyExtractor = {item => item.id}
                />
                
            </View>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({

    header_container:{
        flexDirection:"row",
        alignItems: "center",
        padding:15
    },

    bar_container:{
        flexDirection:'column',
        backgroundColor: '#00BED6',
        height: 120,
        padding: 10,
        borderColor:"grey",
        borderBottomWidth: 1
    },

    container:{
        flex:1,
        backgroundColor:"grey"
    },

    new_group_button:{
        flex:.15,
        backgroundColor: "grey",
        justifyContent: "center",
        alignItems: "center",
        height:40,
        width: 40,
        borderRadius: 20,
        marginHorizontal:5
    },

    search_bar:{
        flex:.85,
        height:40, 
        backgroundColor: "white",
        borderRadius:30,
        marginHorizontal:5
    }

})

//export default withNavigation(GroupScreen)