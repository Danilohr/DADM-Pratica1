import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import ProductsScreen from './screens/ProductsScreen';
import RecoverPasswordScreen from './screens/RecoverPasswordScreen';
import { auth } from './services/firebase';

type Screen = 'login' | 'recover' | 'products';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setScreen(user ? 'products' : 'login');
    });

    return unsubscribe;
  }, []);

  async function handleLogin(email: string, password: string) {
    if (!email.trim() || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Sucesso', 'Login realizado com sucesso.');
    } catch (error: any) {
      Alert.alert('Erro ao entrar', error?.message ?? 'Não foi possível fazer login.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRecoverPassword(email: string) {
    if (!email.trim()) {
      Alert.alert('Campo obrigatório', 'Informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('E-mail enviado', 'Confira sua caixa de entrada para redefinir a senha.');
      setScreen('login');
    } catch (error: any) {
      Alert.alert('Erro na recuperação', error?.message ?? 'Não foi possível enviar o e-mail.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Erro ao sair', error?.message ?? 'Não foi possível encerrar a sessão.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {screen === 'login' ? (
          <LoginScreen
            loading={loading}
            onLogin={handleLogin}
            onGoToRecover={() => setScreen('recover')}
          />
        ) : null}

        {screen === 'recover' ? (
          <RecoverPasswordScreen
            loading={loading}
            onSendRecover={handleRecoverPassword}
            onBackToLogin={() => setScreen('login')}
          />
        ) : null}

        {screen === 'products' && currentUser ? (
          <ProductsScreen
            uid={currentUser.uid}
            onLogout={handleLogout}
          />
        ) : (
          null
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
};