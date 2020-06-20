
import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Login from '../Components/Login'


const SwitchNavigator = createSwitchNavigator(
    {

        Login: {
            screen: Login
        }
    },
    {
        initialRouteName: 'Login'
    }
)

export default createAppContainer(SwitchNavigator)
