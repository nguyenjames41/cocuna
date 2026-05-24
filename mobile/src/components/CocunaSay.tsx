import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Cocuna, FontStack } from '@/constants/theme';

export function CocunaSay({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.glyphWrap}>
        <LinearGradient
          colors={[Cocuna.lavender, Cocuna.mint]}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.85, y: 0.9 }}
          style={styles.glyph}
        />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingRight: 48,
  },
  glyphWrap: { paddingTop: 6 },
  glyph: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  text: {
    flex: 1,
    fontFamily: FontStack.body,
    fontSize: 16,
    lineHeight: 24,
    color: Cocuna.text,
  },
});
