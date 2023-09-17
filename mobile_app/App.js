import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Button, Text } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import CameraComponent from './components/CameraComponent'

const OnboardingScreens = ({ onDone }) => {
  return (
    <>
      <Onboarding
        onDone={onDone}
        pages={[
          {
            backgroundColor: '#fff',
            image: <Image source={require('./assets/report_it_splash.png')} />, // Update the path
            title: 'Welcome to our app',
            subtitle: 'This is the first slide.',
          },
          {
            backgroundColor: '#fff',
            image: <Image source={require('./assets/report_it_splash.png')} />, // Update the path
            title: 'Enjoy the Experience',
            subtitle: 'This is the second slide.',
          },
        ]}
      />
    </>
  )
}

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(null)

  const checkIfOnboardingShown = async () => {
    try {
      const hasShownOnboarding = await AsyncStorage.getItem(
        'hasShownOnboarding',
      )
      return hasShownOnboarding !== null
    } catch (error) {
      console.error('Failed to check if onboarding was shown:', error)
      return false
    }
  }

  const setOnboardingShown = async () => {
    try {
      await AsyncStorage.setItem('hasShownOnboarding', 'true')
      setShowOnboarding(false)
    } catch (error) {
      console.error('Failed to set onboarding as shown:', error)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const wasOnboardingShown = await checkIfOnboardingShown()
      setShowOnboarding(!wasOnboardingShown)
    }
    initialize()
  }, [])

  if (showOnboarding === null) {
    return null // Or a loading indicator
  }

  if (showOnboarding) {
    return <OnboardingScreens onDone={setOnboardingShown} />
  }

  return (
    <View style={styles.container}>
      <CameraComponent />
      <Button
        title="Reset Onboarding"
        onPress={() => setShowOnboarding(true)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'around',
    alignItems: 'center',
    marginTop: '15%',
  },
})

export default App
