import { StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack, Radius } from '@/constants/theme';

export function ChatBubble({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 48,
  },
  bubble: {
    maxWidth: '100%',
    backgroundColor: Cocuna.surface,
    borderRadius: Radius.lg,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: Cocuna.hairlineSoft,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: FontStack.body,
    fontSize: 15,
    lineHeight: 22,
    color: Cocuna.text,
  },
});
