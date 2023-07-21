import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import HistoricoScreen from './HistoricoScreen';
import { useNavigation } from '@react-navigation/native';

const JogoScreen = () => {
  const [board, setBoard] = useState(createEmptyBoard()); // Estado do tabuleiro
  const [currentPlayer, setCurrentPlayer] = useState('Vermelho'); // Jogador atual
  const [winner, setWinner] = useState(null); // Vencedor do jogo
  const [history, setHistory] = useState([]); // Histórico de jogos
  const navigation = useNavigation();

  // Função para criar um tabuleiro vazio
  function createEmptyBoard() {
    const board = Array(5).fill(null).map(() => Array(5).fill(null));
    return board;
  }
  

  // Função para realizar uma jogada em uma coluna
  function makeMove(column) {
    if (winner || isColumnFull(column)) return;

    const updatedBoard = [...board];
    for (let row = 4; row >= 0; row--) {
      if (updatedBoard[row][column] === null) {
        updatedBoard[row][column] = currentPlayer;
        setBoard(updatedBoard); // Atualizar o tabuleiro com a jogada

        if (checkWinner(updatedBoard, currentPlayer)) {
          // Esperar 500ms para exibir o vencedor
          setTimeout(() => {
            setWinner(currentPlayer); // Definir o vencedor do jogo
            updateHistory(currentPlayer); // Atualizar o histórico com o vencedor
          }, 500);
        } else if (checkTie(updatedBoard)) {
          // Esperar 500ms para exibir o empate
          setTimeout(() => {
            setWinner('Empate');
            updateHistory('Empate'); // Atualizar o histórico com empate
          }, 500);
        } else {
          setCurrentPlayer(currentPlayer === 'Vermelho' ? 'Azul' : 'Vermelho');
        }
        break;
      }
    }
  }

  // Função para verificar se uma coluna está cheia
  function isColumnFull(column) {
    return board[0][column] !== null;
  }

  // Função para verificar se há um vencedor
  function checkWinner(board, player) {
    const checkSequence = (cells) => {
      let count = 0;
      for (let i = 0; i < cells.length; i++) {
        if (cells[i] === player) {
          count++;
          if (count === 4) {
            return true;
          }
        } else {
          count = 0;
        }
      }
      return false;
    };
  
    // Verificação das linhas
    for (let row = 0; row < 5; row++) {
      if (checkSequence(board[row])) {
        return true;
      }
    }
  
    // Verificação das colunas
    for (let col = 0; col < 5; col++) {
      const columnCells = [];
      for (let row = 0; row < 5; row++) {
        columnCells.push(board[row][col]);
      }
      if (checkSequence(columnCells)) {
        return true;
      }
    }
  
    // Verificação das diagonais descendentes
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const diagonalCells = [];
        for (let i = 0; i < 4; i++) {
          diagonalCells.push(board[row + i][col + i]);
        }
        if (checkSequence(diagonalCells)) {
          return true;
        }
      }
    }
  
    // Verificação das diagonais ascendentes
    for (let row = 4; row >= 3; row--) {
      for (let col = 0; col < 2; col++) {
        const diagonalCells = [];
        for (let i = 0; i < 4; i++) {
          diagonalCells.push(board[row - i][col + i]);
        }
        if (checkSequence(diagonalCells)) {
          return true;
        }
      }
    }
  
    return false;
  }

  // Função para verificar se há um empate
  function checkTie(board) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }

  // Função para atualizar o histórico de jogos
  function updateHistory(result) {
    const newHistory = [...history, result];
    setHistory(newHistory);
  }

  // Função para reiniciar o jogo
  function resetGame() {
    setBoard(createEmptyBoard());
    setCurrentPlayer('Vermelho');
    setWinner(null);
  }

  function goToHistoricoScreen() {
    navigation.navigate('Historico', { history });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo 4 em Linha</Text>
      {winner ? (
        <Text style={styles.result}>{winner === 'Empate' ? 'Empate!' : `Vencedor: ${winner}`}</Text>
      ) : (
        <Text style={styles.player}>Jogador Atual: {currentPlayer}</Text>
      )}
      <View style={styles.boardContainer}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell === 'Vermelho' ? 'red' : cell === 'Azul' ? 'blue' : 'white',
                  },
                ]}
                onPress={() => makeMove(colIndex)}
                disabled={isColumnFull(colIndex) || winner}
              />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.buttonsContainer}>
        <Button title="Reiniciar Jogo" onPress={resetGame} style={styles.button} />
        <View style={{ width: 20 }} />
        <Button title="Ver Histórico" onPress={goToHistoricoScreen} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1c40f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    marginBottom: 10,
  },
  player: {
    fontSize: 20,
    marginBottom: 20,
  },
  boardContainer: {
    borderWidth: 2,
    borderColor: 'black',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
  },
  buttonsContainer: {
    flexDirection: 'row', // Dispor os botões em linha
    justifyContent: 'center', // Alinhar os botões ao centro horizontalmente
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10, // Espaçamento horizontal entre os botões
  },
});

export default JogoScreen;