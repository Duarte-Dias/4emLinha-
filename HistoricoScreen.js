import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

const HistoricoScreen = ({ navigation, route }) => {
  // Extrair o histórico da rota
  const { history } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Vencedores</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {item === 'Empate' ? 'Empate!' : `Vencedor: ${item}`}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <Text style={styles.empty}>Nenhum jogo registado no histórico.</Text>
      )}
      <Button title="Voltar para o jogo" onPress={() => navigation.navigate('Jogo')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f1c40f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
    textAlign: 'left',
    paddingRight: 10,
  },
  empty: {
    fontSize: 18,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  flatListContent: {
    width: '100%',
  },
});

export default HistoricoScreen;
