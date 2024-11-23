import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const value = await AsyncStorage.getItem('@tasks');
        if (value !== null) {
          const tasks = JSON.parse(value);
          setTasks(tasks);
        }
      } catch (error) {
        console.error('Błąd podczas wczytywania zadań:', error);
      }
    };
  
    loadTasks();
  }, []);



  const saveTasksToStorage = async (tasks) => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem('@tasks', jsonValue);
      console.log('Zadania zapisane pomyślnie');
    } catch (error) {
      console.error('Błąd podczas zapisywania zadań:', error);
    }
  };

  const addTask = () => {
    if (task.trim()) {
      // Tworzymy nowy obiekt zadania
      const newTask = {
        id: Date.now().toString(),
        text: task,
        deadline: deadline || 'Brak terminu',
        completed: false,
      };

      const updatedTasks = [...tasks, newTask];
      saveTasksToStorage(updatedTasks);
      setTasks(updatedTasks);
      setTask('');
      setDeadline('');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  const toggleCompletion = (id) => {
  setTasks((prevTasks) => {
    const updatedTasks = prevTasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
    saveTasksToStorage(updatedTasks);
    
    return updatedTasks;
  });
};

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setTask(taskToEdit.text);
    setDeadline(taskToEdit.deadline);
    setIsEditing(true);
    setEditTaskId(id);
    setEditModalVisible(true);
  };

  const saveEditedTask = () => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) =>
        t.id === editTaskId
          ? { ...t, text: task, deadline: deadline || t.deadline }
          : t
      );
      saveTasksToStorage(updatedTasks);
        
      return updatedTasks;
    });

    setTask('');
    setDeadline('');
    setEditTaskId(null);
    setIsEditing(false);
    setEditModalVisible(false);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setDeadline(
      `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    );
    hideDatePicker();
  };

  const isToday = (date) => {
    const today = new Date();
    const [day, month, year] = date.split('/').map(Number);
    return (
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear()
    );
  };

  const isPastDeadline = (date) => {
    const [day, month, year] = date.split('/').map(Number);
    const taskDate = new Date(year, month - 1, day);
    return taskDate < new Date();
  };

  const sortTasksByDeadline = () => {
    setTasks((prevTasks) => {
      const tasksWithDeadline = prevTasks.filter(
        (task) => task.deadline !== 'Brak terminu'
      );
      const tasksWithoutDeadline = prevTasks.filter(
        (task) => task.deadline === 'Brak terminu'
      );

      const sortedTasks = tasksWithDeadline.sort((a, b) => {
        const [dayA, monthA, yearA] = a.deadline.split('/').map(Number);
        const [dayB, monthB, yearB] = b.deadline.split('/').map(Number);

        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        return dateA - dateB;
      });

      return [...sortedTasks, ...tasksWithoutDeadline];
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista To-Do</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dodaj zadanie..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
          <Text style={styles.dateButtonText}>
            {deadline ? `Deadline: ${deadline}` : 'Ustaw Deadline'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Dodaj</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sortuj po dacie" onPress={sortTasksByDeadline} />
      <FlatList
        style={styles.listContainer}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.taskContainer,
              isToday(item.deadline) && item.completed
                ? styles.completedTaskContainer
                : isToday(item.deadline)
                ? styles.todayTaskContainer
                : isPastDeadline(item.deadline)
                ? styles.pastDeadlineTaskContainer
                : item.completed
                ? styles.completedTaskContainer
                : null,
            ]}>
            <View>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}>
                {item.text}
              </Text>
              <Text style={styles.deadlineText}>Termin: {item.deadline}</Text>
            </View>
            <View style={styles.taskButtons}>
              <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
                <FontAwesome
                  name={item.completed ? 'check-square-o' : 'square-o'}
                  size={30}
                  color={item.completed ? '#28a745' : '#007bff'}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editTask(item.id)}>
                <FontAwesome
                  name="pencil"
                  size={24}
                  color="#007bff"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <FontAwesome
                  name="trash"
                  size={24}
                  color="#dc3545"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal do edycji zadania */}
      <Modal
        visible={editModalVisible}
        animationType="fade" // Dodano płynne przejście
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edytuj zadanie</Text>
            <TextInput
              style={styles.input}
              placeholder="Zmień treść zadania..."
              value={task}
              onChangeText={setTask}
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePicker}>
              <Text style={styles.dateButtonText}>
                {deadline ? `Deadline: ${deadline}` : 'Ustaw Deadline'}
              </Text>
            </TouchableOpacity>
            <Button title="Zapisz zmiany" onPress={saveEditedTask} />
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setTask(''); // Resetuje tekst zadania
                setDeadline(''); // Resetuje deadline
                setEditModalVisible(false); // Zamknięcie modala
              }}>
              <Text style={styles.modalCancelButtonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f7f9',
    marginTop: 30, // Przesunięcie w dół
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#007bff',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 16,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginHorizontal: 10, // Dodano marginesy po bokach
  },

  listContainer: {
    marginTop: 15, // Dodano odstęp między przyciskiem a listą
  },
  completedTaskContainer: {
    backgroundColor: '#d4edda',
  },
  todayTaskContainer: {
    backgroundColor: '#ffeeba',
  },
  pastDeadlineTaskContainer: {
    backgroundColor: '#f8d7da',
  },
  taskText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  deadlineText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  taskButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Półprzezroczyste czarne tło
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff', // Białe tło modala
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalCancelButton: {
    padding: 12,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#28a745', // Zielony kolor dla wyróżnienia
    borderRadius: 10, // Zaokrąglone rogi
    alignItems: 'center',
    marginTop: 10,
    elevation: 5, // Dodanie cienia dla efektu "przycisku"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginHorizontal: 10, // Dodano odstęp między ikonami
  },
});