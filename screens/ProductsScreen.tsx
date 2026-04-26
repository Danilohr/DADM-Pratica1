import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../services/firebase';

type Product = {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
};

type ProductsScreenProps = {
  uid: string;
  onLogout: () => Promise<void>;
};

export default function ProductsScreen({ uid, onLogout }: ProductsScreenProps) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const productsRef = useMemo(() => collection(db, 'users', uid, 'products'), [uid]);

  useEffect(() => {
    const productsQuery = query(productsRef, orderBy('dataAdicao', 'desc'));
    const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
      const list = snapshot.docs.map((item) => {
        const data = item.data() as Omit<Product, 'id'>;
        return {
          id: item.id,
          nomeProduto: data.nomeProduto ?? '',
          quantidade: Number(data.quantidade ?? 0),
          precoUnitario: Number(data.precoUnitario ?? 0),
        };
      });
      setProducts(list);
    });

    return unsubscribe;
  }, [productsRef]);

  const totalGeral = useMemo(
    () => products.reduce((acc, item) => acc + item.quantidade * item.precoUnitario, 0),
    [products]
  );

  function limparFormulario() {
    setNomeProduto('');
    setQuantidade('');
    setPrecoUnitario('');
    setEditingId(null);
  }

  async function salvarProduto() {
    const quantidadeNumero = Number(quantidade);
    const precoNumero = Number(precoUnitario);

    if (!nomeProduto.trim() || !quantidade || !precoUnitario) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, quantidade e preço unitário.');
      return;
    }

    if (Number.isNaN(quantidadeNumero) || Number.isNaN(precoNumero)) {
      Alert.alert('Valores inválidos', 'Quantidade e preço devem ser números válidos.');
      return;
    }

    if (quantidadeNumero <= 0 || precoNumero <= 0) {
      Alert.alert('Valores inválidos', 'Quantidade e preço devem ser maiores que zero.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const targetDoc = doc(db, 'users', uid, 'products', editingId);
        await updateDoc(targetDoc, {
          nomeProduto: nomeProduto.trim(),
          quantidade: quantidadeNumero,
          precoUnitario: precoNumero,
        });
      } else {
        await addDoc(productsRef, {
          nomeProduto: nomeProduto.trim(),
          quantidade: quantidadeNumero,
          precoUnitario: precoNumero,
          dataAdicao: serverTimestamp(),
        });
      }

      limparFormulario();
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error?.message ?? 'Não foi possível salvar o produto.');
    } finally {
      setSaving(false);
    }
  }

  async function excluirProduto(id: string) {
    try {
      await deleteDoc(doc(db, 'users', uid, 'products', id));
    } catch (error: any) {
      Alert.alert('Erro ao excluir', error?.message ?? 'Não foi possível excluir o produto.');
    }
  }

  function editarProduto(item: Product) {
    setEditingId(item.id);
    setNomeProduto(item.nomeProduto);
    setQuantidade(String(item.quantidade));
    setPrecoUnitario(String(item.precoUnitario));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha lista</Text>
        <Pressable onPress={onLogout}>
          <Text style={styles.link}>Sair</Text>
        </Pressable>
      </View>

      <TextInput style={styles.input} placeholder="Nome do produto" value={nomeProduto} onChangeText={setNomeProduto} />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço unitário"
        keyboardType="decimal-pad"
        value={precoUnitario}
        onChangeText={setPrecoUnitario}
      />

      <Pressable style={styles.primaryButton} onPress={salvarProduto} disabled={saving}>
        <Text style={styles.primaryButtonText}>
          {saving ? 'Salvando...' : editingId ? 'Atualizar produto' : 'Adicionar produto'}
        </Text>
      </Pressable>

      {editingId ? (
        <Pressable onPress={limparFormulario}>
          <Text style={styles.link}>Cancelar edição</Text>
        </Pressable>
      ) : null}

      <Text style={styles.total}>Total geral: R$ {totalGeral.toFixed(2)}</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const totalProduto = item.quantidade * item.precoUnitario;
          return (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.nomeProduto}</Text>
              <Text style={styles.productMeta}>Qtd: {item.quantidade}</Text>
              <Text style={styles.productMeta}>Unit.: R$ {item.precoUnitario.toFixed(2)}</Text>
              <Text style={styles.productTotal}>Total: R$ {totalProduto.toFixed(2)}</Text>

              <View style={styles.actions}>
                <Pressable onPress={() => editarProduto(item)}>
                  <Text style={styles.link}>Editar</Text>
                </Pressable>
                <Pressable onPress={() => excluirProduto(item.id)}>
                  <Text style={styles.delete}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
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
    marginTop: 2,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  total: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  productMeta: {
    fontSize: 14,
    color: '#374151',
  },
  productTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
  },
  delete: {
    color: '#dc2626',
    fontSize: 14,
  },
});
