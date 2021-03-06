import React, {Component} from 'react';
import {Text,TouchableHighlight,Image, StyleSheet,View,ScrollView, TextInput,KeyboardAvoidingView, Modal} from 'react-native';
import {connect} from 'react-redux';
import {Link} from  'react-router-native';
import axios from "axios"
import moment from "moment";
import Nav from './Nav'
import PostCardSection from './Home-view/subcomponents/PostCardSection'
import {passHistory} from '../reducers/followingReducer';
import { Ionicons } from '@expo/vector-icons'

class Comment extends Component {
    constructor(){
        super();
        this.state ={
            post: null,
            comments:[],
            text: '',
            behavior: 'padding',
            modal:true
        }
    };
    postComment(){
        axios.post('http://52.10.128.151:3005/api/postComment', {
            userid: this.props.mainProfile.profile.id,
            comment: this.state.text,
            photoid: this.state.post.photo_id,
            timestamp: moment().format()
        }).then(response => {
            this.setState({comments: response.data})
        })
    };
    componentDidMount() {
        axios.get('http://52.10.128.151:3005/api/getSinglePost/' + this.props.match.params.id).then(response =>{
            this.setState({post:response.data[0]})
        });
        axios.get(`http://52.10.128.151:3005/api/getComments/${this.props.match.params.id}`).then((res)=>{
            this.setState({comments: res.data})
        });
        this.props.passHistory(this.props.history, this.props.match.params.id)
    };
    backArrow(){
        this.setState({
            modal:false
        })
        this.props.history.push(`/Home`)
    }
    render() {
        return (
            <Nav>
                {this.state.post &&
                    <Modal
                        visible={this.state.modal}
                        animationType="slide"
                        onRequestClose={this.backArrow.bind(this)}
                    >
                        <View style={styles.backNav}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.backArrow.bind(this)}>
                                <Ionicons name='ios-arrow-back' style={styles.icon} />
                            </TouchableHighlight>
                            <Text style={styles.text}>
                                {this.state.post.username}
                            </Text>
                        </View>
                        <ScrollView>
                            <PostCardSection>
                                <View style={styles.thumbnail_container}>
                                    <View>
                                        <Link underlayColor="transparent" to={"/Profile/" + this.state.post.user_id}>
                                            <Image style={styles.thumbnail_style} source={{uri: this.state.post.user_image}}/>
                                        </Link>
                                    </View>
                                    <View style={styles.postView}>
                                        <Link underlayColor="transparent" to={"/Profile/" + this.state.post.user_id}>
                                            <Text style={styles.postStyle}>
                                                {this.state.post.username}
                                            </Text>
                                        </Link>
                                        <Text style={styles.commentText}>
                                            {this.state.post.post_text}
                                        </Text>
                                        <Text style={styles.timeStampStyle}>
                                            {moment(this.state.post.timestamp).fromNow()}
                                        </Text>
                                    </View>
                                </View>
                            </PostCardSection>
                            <PostCardSection>
                                {this.state.comments.map((val, i) => {
                                    return (
                                        <View key={i}>
                                            <View style={styles.thumbnail_container}>
                                                <View>
                                                    <Link underlayColor="transparent" to={"/Profile/" + val.userid}>
                                                        <Image style={styles.thumbnail_style} source={{uri: val.imageurl}}/>
                                                    </Link>
                                                </View>
                                                <View style={styles.postView}>
                                                    <Link underlayColor="transparent" to={"/Profile/" + val.userid}>
                                                        <Text style={styles.postStyle}>
                                                            {val.username}
                                                        </Text>
                                                    </Link>
                                                    <Text style={styles.commentText}>
                                                        {val.comment}
                                                    </Text>
                                                    <Text style={styles.timeStampStyle}>
                                                        {moment(val.timestamp).fromNow()}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                                }
                            </PostCardSection>
                        </ScrollView>

                <View>
                    <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>

                        <TextInput
                            placeholder='Leave a comment'
                            style={styles.input}
                            onChangeText={(text) => this.setState({text})}
                            value={this.state.text}
                        />
                        <TouchableHighlight style={styles.commentButton}
                                            onPress={this.postComment.bind(this)}><Text style={styles.commentButtonText}>Comment</Text></TouchableHighlight>
                    </KeyboardAvoidingView>
                </View>
                    </Modal>
                }
            </Nav>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 10,

    },
    commentText:{
        textAlign:"justify",
    },
    commentButtonText:{
      textAlign: 'center',
        color: 'black'
    },
    commentButton:{
        backgroundColor:"#ffffff",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:17,
        paddingRight:17,
        borderRadius: 5,
        borderWidth:2,
        borderColor:"black",
    },
    input:{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft:5,
        paddingRight:5,
    },
    postView:{
        marginLeft: 10
    },
    postImage:{
        height: 300,
        flex: 1,
        width: null
    },
    timeStampStyle:{
        fontSize: 12,
        marginTop: 10
    },
    postStyle:{
        fontWeight: 'bold'
    },
    thumbnail_style:{
        height: 50,
        width: 50,
        borderRadius: 35,
        marginRight: 10
    },
    thumbnail_container:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,
        marginBottom: 10
    },
    image_style:{
        height: 300,
    },
    backNav: {
        alignItems: 'center',
        elevation: 2,
        backgroundColor: '#f2f2f2',
        flexDirection: 'row'
    },
    icon: {
        color: '#262626',
        fontSize: 32,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 25,
        paddingLeft: 15
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#262626'
    }
});
export default connect( state=>({
    mainProfile: state.profileReducer.profile,
    follow: state.followingReducer
}), {
    passHistory
})(Comment);