import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface EmptyScreenProps {
  message?: string
}

const EmptyScreen: React.FC<EmptyScreenProps> = ({ message = "No data available" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#888",
  },
})

export default EmptyScreen

