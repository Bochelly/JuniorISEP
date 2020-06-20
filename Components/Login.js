
import React from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Button,
    ActivityIndicator,
    Image,
    Alert,
    KeyboardAvoidingView, underlineColorAndroid,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.password = "";
        this.email = "";
        this.state = {isLoading:false}
    }

    _login(email,password){
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then(() => this._didLogedIn())
            .catch(e => this._handleLoginError(e)) //TODO: Gérer l'erreur proprement avec des affichages
    }


    _getToSignUp(){
        this.props.navigation.navigate("Signup") //Il est possible d'animer le switch https://github.com/react-navigation/animated-switch
    }

    _emailChanged(text){
        this.email = text

    }

    _passwordChanged(text){
        this.password = text
    }

    _didPressLoginButton(){
        if(this.email !== undefined && this.email!== ''){
            this.setState({isLoading:true})
            console.log("Logging : " + this.email + this.password);
            this._login(this.email, this.password)
        }
    }

    _displayLoading(){
        if(this.state.isLoading){
            return(
                <View style={styles.activity_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    _displaySignInButton(){
        if(!this.state.isLoading){
            return(
                <View>
                    <TouchableOpacity style={styles.button} onPress={() => this._didPressLoginButton()}wws>
                        <Text style={styles.buttonText}>CONNEXION</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonSignup} onPress={() => this._getToSignUp()}>
                        <Text style={styles.signup_text}>Vous n'avez pas de compte ? </Text>
                        <Text style={styles.signup_button}>Inscrivez-vous</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _didLogedIn(){
        console.log("Loged in !");
        //this.setState({isLoading:false})
        this.props.navigation.navigate('Home')
    }

    _handleLoginError(error){
        console.log(error);
        console.log('Error with email : ',this.email);
        this.setState({isLoading:false})
        if(error.code === 'auth/wrong-password'){
            Alert.alert(
                'Mot de passe incorrect',
                'Verifiez votre saisie ou réinitialisez votre mot de passe.', //Error message ? English only
                [
                    {text: 'Mot de passe oublié', onPress: () => this._resetPassword()},
                    {text: 'OK', onPress: () => console.log('OK Pressed')}
                ],
                { cancelable: false }
            )
        } else {
            Alert.alert(
                'Erreur lors de la connexion',
                error.message.toString(), //Error message ? English only
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                {cancelable: false}
            )
        }
    }

    async _resetPassword(){
        console.log('Resetting password for : ',this.email);
        await firebase.auth().sendPasswordResetEmail(this.email).then(function() {
            console.log('Email sent !');
            // Email sent.
            Alert.alert(
                'Réinitialisation du mot de passe',
                'Consultez le mail qui vient de vous être envoyé.', //Error message ? English only
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')}
                ],
                { cancelable: false }
            )
        }).catch(function(error) {
            console.log('Email sending failure w error : ',error.message);
            Alert.alert(
                'Erreur',
                error.message,
                [
                    {text: 'OK', onPress: () => console.log('OK Pressed')}
                ],
                { cancelable: false }
            )
        });

    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="height">
                <View style={styles.logo_container}>
                    <Image style={styles.logo_image} source={require('../Images/logo_jisep_login.png')} resizeMode="contain"/>
                </View>
                <View style={styles.fields_container}>
                    <TextInput
                        underlineColorAndroid="transparent"
                        style={styles.inputBox}
                        onChangeText={email => this._emailChanged(email)}
                        placeholderTextColor='black'
                        placeholder='Email'
                        autoCapitalize='none'
                        textContentType="username"
                        //Android : Allow to have the icon on the field inlineImageLeft
                    />
                    <TextInput
                        underlineColorAndroid="transparent"
                        style={styles.inputBox}
                        onChangeText={password => this._passwordChanged(password)}
                        placeholderTextColor='black'
                        placeholder='Mot de passe'
                        secureTextEntry={true}
                        textContentType="password"
                    />

                    <View style={styles.separator}>

                    </View>

                    <View style={styles.button_container}>
                        {this._displaySignInButton()}

                    </View>


                </View>

                {this._displayLoading()}
                <View style={styles.footer}>
                    {/**/}
                </View>

            </KeyboardAvoidingView>
            //TODO ; Ajouter le mot de passe oublié, juste un appel à l'envoie d'un mail de recup firebase sans changer de vue, huste notif

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    logo_image:{
        width:250,
        paddingBottom: 0
    },

    fields_container:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
    },
    thumb:{
        height:20
    },

    button_container:{
        flex:6,
        alignItems: 'center',
        justifyContent: 'center'
    },

    separator:{
        flex:1
    },


    inputBox: {
        fontFamily:'futura',
        fontWeight: "100",
        height:45,
        width: 300,
        //paddingBottom:17,
        color:'black',
        borderBottomColor: '#272727',
        //marginTop:18,
        borderWidth: 2,
        borderTopWidth:0,
        borderLeftWidth:0,
        borderRightWidth:0,
        paddingVertical: 10,
        alignItems:'center',
    },
    passwordContainer: {
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
        backgroundColor:'green',
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
    inputStyle: {
        flex: 1,
    },



    button: {

        alignItems: 'center',
        justifyContent:'center',
        backgroundColor:'#936ab5',
        borderRadius: 25,
        width: 300,
        height:52
    },
    buttonText: {
        fontSize: 13,
        textAlign:'center',
        alignSelf:'stretch',
        fontFamily:'futura',
        fontWeight: 'bold',
        color: 'white'
    },
    buttonSignup: {
        flex:4,
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    signup_text:{
        fontFamily:'futura',
        color:'#272727',
        fontSize: 13
    },
    signup_button:{
        color:'#936ab5',
        fontSize: 13
    },
    activity_container:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        marginTop: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },

    logo_container:{
        alignItems:'flex-end',
        justifyContent:'center',
        flex:1
    },
    footer:{
        flex:0.2
    }
})

export default Login
