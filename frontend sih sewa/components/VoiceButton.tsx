import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';

interface VoiceButtonProps {
  isListening: boolean;
  onPress: () => void;
  promptText: string;
}

export default function VoiceButton({ isListening, onPress, promptText }: VoiceButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
        onPress={onPress}
      >
        {isListening ? (
          <MicOff size={32} color="#FFFFFF" />
        ) : (
          <Mic size={32} color="#FFFFFF" />
        )}
      </TouchableOpacity>
      <Text style={styles.promptText}>
        {isListening ? 'सुन रहा है... / Listening...' : promptText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#EF4444',
    transform: [{ scale: 1.1 }],
  },
  promptText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
});