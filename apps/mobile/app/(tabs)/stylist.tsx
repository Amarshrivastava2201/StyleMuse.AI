import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useMobileWardrobe, getFirstName } from '../../context/WardrobeContext';

const QUICK_QUERIES = [
  'What goes with my white sneakers?',
  'Style me for a cool 15°C autumn day',
  'Suggest a minimal smart-casual look',
];

export default function StylistScreen() {
  const { chatHistory, addChatMessage, wardrobe, profile } = useMobileWardrobe();
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    addChatMessage('user', text);
    setInput('');

    setTimeout(() => {
      let reply = '';
      const firstName = getFirstName(profile.full_name, profile.email);
      const lower = text.toLowerCase();
      if (lower.includes('sneaker') || lower.includes('shoes')) {
        reply =
          `Pair your minimalist low-tops with your relaxed pleated chinos and a tucked-in oxford shirt for an effortlessly elevated Scandinavian aesthetic, ${firstName}.`;
      } else if (lower.includes('15') || lower.includes('autumn') || lower.includes('cool')) {
        reply =
          `At 15°C, ${firstName}, your tailored charcoal wool overcoat over a crisp button-down provides the perfect balance of warmth and sharp silhouette.`;
      } else {
        reply = `Looking across your ${wardrobe.length} wardrobe pieces, ${firstName}, neutral tonal layering (navy, charcoal, cream) always creates a timeless result tailored to your minimalist profile.`;
      }
      addChatMessage('stylist', reply);
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      {/* Quick Prompts */}
      <View style={styles.quickBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={QUICK_QUERIES}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSend(item)} style={styles.promptChip}>
              <Text style={styles.promptText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>

      {/* Messages */}
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.bubbleWrapper, isUser ? styles.bubbleUser : styles.bubbleStylist]}>
              {!isUser && <Text style={styles.stylistAvatar}>✨</Text>}
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.stylistBubble]}>
                <Text style={[styles.messageText, isUser ? styles.userText : styles.stylistText]}>
                  {item.content}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask Muse for styling advice..."
          placeholderTextColor="#a8a29e"
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={() => handleSend()}
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfc' },
  quickBar: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f5f5f4' },
  promptChip: {
    backgroundColor: '#f5f5f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e7e5e4',
  },
  promptText: { fontSize: 11, color: '#57534e', fontWeight: '500' },
  messagesList: { padding: 16, paddingBottom: 20 },
  bubbleWrapper: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  bubbleUser: { justifyContent: 'flex-end' },
  bubbleStylist: { justifyContent: 'flex-start' },
  stylistAvatar: { fontSize: 16, marginRight: 8, marginTop: 4 },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  userBubble: { backgroundColor: '#1c1917', borderBottomRightRadius: 4 },
  stylistBubble: { backgroundColor: '#f5f5f4', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 13, lineHeight: 18 },
  userText: { color: '#ffffff' },
  stylistText: { color: '#1c1917' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f5f5f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1c1917',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
});
