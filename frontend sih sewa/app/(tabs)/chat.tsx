import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Mic, Bot, User, Volume2 } from 'lucide-react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'नमस्ते! मैं SEWA AI असिस्टेंट हूँ। मैं आपकी खेती संबंधी समस्याओं में मदद कर सकता हूँ।\n\nHello! I\'m SEWA AI Assistant. I can help you with your farming queries.',
      isBot: true,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollViewRef = useRef(null);

  const quickQuestions = [
    {
      hindi: 'गेहूं की खेती कब करें?',
      english: 'When to cultivate wheat?'
    },
    {
      hindi: 'कीटनाशक कैसे छिड़कें?',
      english: 'How to spray pesticides?'
    },
    {
      hindi: 'बारिश में क्या सावधानी बरतें?',
      english: 'Precautions during rain?'
    },
    {
      hindi: 'मिट्टी की जाँच कहाँ कराएं?',
      english: 'Where to test soil?'
    }
  ];

  const botResponses = {
    'गेहूं': 'गेहूं की बुआई अक्टूबर-नवंबर में करना सबसे अच्छा होता है। तापमान 15-20°C होना चाहिए। बीज दर 100-120 किग्रा प्रति हेक्टेयर रखें।\n\nWheat should be sown in October-November when temperature is 15-20°C. Use seed rate of 100-120 kg per hectare.',
    'कीट': 'कीटनाशक का छिड़काव शाम के समय करें जब हवा शांत हो। सुरक्षा उपकरण जैसे मास्क और दस्ताने पहनें। बारिश से पहले छिड़काव न करें।\n\nSpray pesticides in the evening when wind is calm. Wear protective equipment like mask and gloves. Don\'t spray before rain.',
    'बारिश': 'बारिश के दौरान फसल में जल निकासी की व्यवस्था करें। कवक रोगों से बचाव के लिए उचित दवा का छिड़काव करें। बीज भंडारण सूखी जगह पर करें।\n\nEnsure proper drainage during rains. Spray fungicide to prevent diseases. Store seeds in dry place.',
    'मिट्टी': 'मिट्टी की जाँच नजदीकी कृषि विज्ञान केंद्र में कराएं। सॉइल हेल्थ कार्ड के लिए आवेदन दें। जाँच की रिपोर्ट के आधार पर खाद डालें।\n\nGet soil tested at nearest Krishi Vigyan Kendra. Apply for Soil Health Card. Apply fertilizer based on test report.'
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let response = 'मुझे आपकी समस्या समझ में नहीं आई। कृपया अधिक विस्तार से बताएं या हमारे एक्सपर्ट से बात करें।\n\nI didn\'t understand your problem. Please provide more details or talk to our expert.';

      // Find matching response
      for (const [key, value] of Object.entries(botResponses)) {
        if (lowerText.includes(key.toLowerCase()) || lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const startVoiceRecording = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setInputText('गेहूं की खेती कब करनी चाहिए?');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Bot size={24} color="#22C55E" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>SEWA AI सहायक / AI Assistant</Text>
            <Text style={styles.headerSubtitle}>
              {isTyping ? 'टाइप कर रहा है... / Typing...' : 'ऑनलाइन / Online'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isBot ? styles.botMessageContainer : styles.userMessageContainer
            ]}
          >
            <View style={styles.messageAvatar}>
              {message.isBot ? (
                <Bot size={16} color="#FFFFFF" />
              ) : (
                <User size={16} color="#FFFFFF" />
              )}
            </View>
            <View
              style={[
                styles.messageBubble,
                message.isBot ? styles.botMessageBubble : styles.userMessageBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isBot ? styles.botMessageText : styles.userMessageText
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.isBot ? styles.botMessageTime : styles.userMessageTime
                ]}
              >
                {message.timestamp}
              </Text>
            </View>
            {message.isBot && (
              <TouchableOpacity style={styles.speakButton}>
                <Volume2 size={16} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {isTyping && (
          <View style={[styles.messageContainer, styles.botMessageContainer]}>
            <View style={styles.messageAvatar}>
              <Bot size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.messageBubble, styles.botMessageBubble]}>
              <Text style={styles.typingIndicator}>• • •</Text>
            </View>
          </View>
        )}

        {/* Quick Questions */}
        <View style={styles.quickQuestionsContainer}>
          <Text style={styles.quickQuestionsTitle}>
            त्वरित प्रश्न / Quick Questions
          </Text>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => sendMessage(question.hindi)}
            >
              <Text style={styles.quickQuestionText}>
                {question.hindi}
              </Text>
              <Text style={styles.quickQuestionTextEnglish}>
                {question.english}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="अपना प्रश्न लिखें... / Type your question..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={startVoiceRecording}
          >
            <Mic size={20} color={isListening ? "#FFFFFF" : "#6B7280"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  botMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: '#22C55E',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botMessageText: {
    color: '#1F2937',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  botMessageTime: {
    color: '#9CA3AF',
  },
  userMessageTime: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  speakButton: {
    padding: 8,
    marginLeft: 4,
  },
  typingIndicator: {
    fontSize: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  quickQuestionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  quickQuestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  quickQuestionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickQuestionText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  quickQuestionTextEnglish: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    color: '#1F2937',
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#22C55E',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});