import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground } from 'react-native';
import { graphql, commitMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import environment from '@src/Environment';
import styled from 'styled-components';

export default class NewUser extends Component {

    _updateClientStore = (proxyStore) => {
        // Retrieve the new user from server response
        const registerUserField = proxyStore.getRootField('RegisterEmail');
        const newUser = registerUserField.getLinkedRecord('user');

        // Add the user to the store
        const record = proxyStore.getRoot()
        const users = ConnectionHandler.getConnection(record, 'UserList_users');

        if(users) {
            const newEdge = ConnectionHandler.createEdge(proxyStore, users, newUser, 'UserEdge');

            // Insert edge before all other edges, like in server
            ConnectionHandler.insertEdgeBefore(users, newEdge);
        }
    }

    _handleButtonPress = () => {

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
                updater: (proxyStore) => this._updateClientStore(proxyStore),
                onCompleted: () => this.props.navigation.goBack(),
                onError: err => console.error(err)
            },
        );   
    }

    render() {
        return (
            <Wrapper>
                <Title>Create a new user</Title>

                {/* name */}
                <RegularInput autoCorrect={false} onChangeText={text => this._name = text} 
                    placeholder="Name"/>

                {/* email */}
                <RegularInput autoCapitalize={'none'} autocorrect={false}
                    onChangeText={text => this._mail = text} placeholder="E-mail"/>

                {/* description */}
                <RegularInput autoCorrect={false}
                    onChangeText={text => this._description = text} placeholder="Description"/>

                {/* imageUrl */}
                <RegularInput autoCapitalize={'none'} autoCorrect={false}
                    onChangeText={text => this._imageUrl = text} placeholder="Image URL"/>

                <Button
                    color='#FABA30'
                    icon={{name: 'check'}}
                    title='SUBMIT'
                    onPress={() => this._handleButtonPress()} />
                
            </Wrapper>
        );
    }
}

const mutation = graphql`
    mutation NewUserMutation($input: RegisterEmailInput!) {
        RegisterEmail(input: $input) {
            user {
                id
                name
                email
                description
                imageUrl
            }
            token
        }
    }
`;

Wrapper = styled.View`
    flex: 1;
    backgroundColor: #508FF2;
`
Title = styled.Text`
    fontWeight: 800;
    fontSize: 30;
    color: #FFF;
    marginBottom: 20;
    marginTop: 20;
    marginLeft: auto;
    marginRight: auto;
`

RegularInput = styled.TextInput`
    height: 40;
    borderColor: gray;
    borderWidth: 1;
    backgroundColor: #FFF;
    marginVertical: 20;
    marginHorizontal: 20;
    paddingLeft: 10;
`