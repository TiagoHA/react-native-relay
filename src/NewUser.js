import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { graphql, commitMutation } from 'react-relay';
import environment from './Environment';

export default class NewUser extends Component {
    constructor(props){
        super(props);
        this.state = {name: ''};
    }

    _handleButtonPress = () => {
        console.log('Submit')

        const variables = {
            input: {
                name: this._name,
                email: this._mail,
                password: '123456',
                description: this._description,
                imageUrl: this._imageUrl,
            }
        }

        commitMutation(
            environment,
            {
                mutation,
                variables,
                onCompleted: (response, errors) => {
                    this.props.navigation.goBack();
                },
                onError: err => console.error(err),
            },
        );   
    }

    render() {
        return (
            <View style={styles.container} >
                <Text style={styles.title}>Create a new user</Text>

                {/* name */}
                <TextInput style={styles.regularInput} autoCorrect={false}
                    onChangeText={text => this._name = text} placeholder="Name"></TextInput>

                {/* email */}
                <TextInput style={styles.regularInput} autoCapitalize={'none'} autocorrect={false}
                onChangeText={text => this._mail = text} placeholder="E-mail"></TextInput>

                {/* description */}
                <TextInput style={styles.regularInput} autoCorrect={false}
                    onChangeText={text => this._description = text} placeholder="Description"></TextInput>

                {/* imageUrl */}
                <TextInput style={styles.regularInput} autoCapitalize={'none'} autoCorrect={false}
                    onChangeText={text => this._imageUrl = text} placeholder="Image URL"></TextInput>

                <Button
                    color='#FABA30'
                    icon={{name: 'check'}}
                    title='SUBMIT'
                    onPress={() => this._handleButtonPress()} />
                
            </View>
        );
    }
}

const mutation = graphql`
    mutation NewUserMutation($input: RegisterEmailInput!) {
        RegisterEmail(input: $input) {
            token
            error
        }
    }
`;

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#508FF2',
    },
    title: {
        fontWeight: '800',
        fontSize: 30,
        color: '#FFF',
        marginBottom: 20,
        marginTop: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    regularInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: '#FFF',
        margin: 20,
        paddingLeft: 10,
    },
}
)