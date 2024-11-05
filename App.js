import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('taskList');
        if (savedTasks) setTaskList(JSON.parse(savedTasks));
      } catch (error) {
        console.log('Erro ao carregar as tarefas:', error);
      }
    };
    fetchTasks();
  }, []);

  const storeTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('taskList', JSON.stringify(tasks));
      setTaskList(tasks);
    } catch (error) {
      console.log('Erro ao salvar as tarefas:', error);
    }
  };

  const handleAddTask = () => {
    if (!inputText.trim()) return;
    const newTask = { id: Date.now().toString(), text: inputText };
    const updatedTasks = [...taskList, newTask];
    storeTasks(updatedTasks);
    setInputText('');
  };

  const TaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Nova tarefa"
        value={inputText}
        onChangeText={setInputText}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id}
        renderItem={TaskItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4682B4',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});
