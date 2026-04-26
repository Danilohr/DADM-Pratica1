import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type RecoverPasswordScreenProps = {
  loading: boolean;
  onSendRecover: (email: string) => Promise<void>;
  onBackToLogin: () => void;
};

export default function RecoverPasswordScreen({
  loading,
  onSendRecover,
  onBackToLogin,
}: RecoverPasswordScreenProps) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.subtitle}>Digite seu e-mail para receber o link de recuperação</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <Pressable style={styles.primaryButton} onPress={() => onSendRecover(email)} disabled={loading}>
        <Text style={styles.primaryButtonText}>{loading ? 'Enviando...' : 'Enviar recuperação'}</Text>
      </Pressable>

      <Pressable onPress={onBackToLogin}>
        <Text style={styles.link}>Voltar para login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#2563eb',
    fontSize: 14,
  },
});
