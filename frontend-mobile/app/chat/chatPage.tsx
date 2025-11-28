import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import HeaderChat from '../../components/headerChat';
import { scale, verticalScale } from 'react-native-size-matters';

export default function App() {
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  useEffect(() => {
    // Scroll to the bottom whenever messages update
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderChat />

      <ImageBackground
        source={require('../../assets/images/backgroundChat.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={verticalScale(57)} // adjust for your header height
        >
          <View style={styles.chatContainer}>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.messagesContentContainer}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
              showsVerticalScrollIndicator={false}
            >
              {messages.map(m => (
                <View
                  key={m.id}
                  style={[
                    styles.messageWrapper,
                    m.role === 'user'
                      ? styles.userMessageWrapper
                      : styles.assistantMessageWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      m.role === 'user'
                        ? styles.userMessageBubble
                        : styles.assistantMessageBubble,
                    ]}
                  >
                    {m.parts.map((part, i) => (
                      <Text key={`${m.id}-${i}`} style={styles.messageText}>
                        {part.text || ''}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua mensagem...."
                placeholderTextColor="#999"
                value={input}
                onChange={e => setInput(e.nativeEvent.text)}
                onSubmitEditing={e => {
                  e.preventDefault();
                  sendMessage({ text: input });
                  setInput('');
                }}
                autoFocus={false}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => {
                  sendMessage({ text: input });
                  setInput('');
                }}
              >
                <Image
                  source={require('../../assets/images/sendbtn.png')} // Replace with your image path
                  style={styles.sendButtonImage} // Added a new style for the image
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#13293D',
  },
  background: {
    flex: 1,
    width: '100%',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  // 👇 changed here
  messagesContentContainer: {
    paddingVertical: 12,
    flexGrow: 1, // allows scrollable growth
    justifyContent: 'flex-end', // keeps messages at bottom when few
  },
  messageWrapper: {
    marginVertical: 6,
  },
  assistantMessageWrapper: {
    alignSelf: 'flex-start',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    marginHorizontal: scale(9),
    padding: scale(9),
    borderRadius: 16,
    maxWidth: '80%',
    minWidth: scale(50), // Ensures short messages don't wrap
  },
  assistantMessageBubble: {
    backgroundColor: '#e7e7e7ff',
  },
  userMessageBubble: {
    backgroundColor: '#e7e7e7ff',
  },
  messageText: {
    color: '#191919ff',
    fontSize: verticalScale(12),
    paddingBottom: verticalScale(4),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: verticalScale(6),
    borderRadius: 20,
    height: verticalScale(30),
    fontSize: verticalScale(12),
    marginBottom: verticalScale(20),
    color: '#000',
  },
  sendButton: {
    marginBottom: verticalScale(18),
    marginLeft: 8,
    backgroundColor: '#006494',
    borderRadius: 25,
    padding: 12,
  },
  sendButtonImage: {
    marginLeft: scale(1),
    marginRight: scale(-1),
    width: 24, // Adjusted dimensions for the image
    height: 24,
    color: '#fff',
  },
});
