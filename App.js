import React, { useState } from 'react';
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

export default function App() {
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const addTask = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: task,
          deadline: deadline || 'Brak terminu',
          completed: false,
        },
      ]);
      setTask('');
      setDeadline('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === editTaskId
          ? { ...t, text: task, deadline: deadline || t.deadline }
          : t
      )
    );
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
        <Button title="Dodaj" onPress={addTask} />
      </View>
      <Button title="Sortuj po dacie" onPress={sortTasksByDeadline} />
      <FlatList
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
            ]}
          >
            <View>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.deadlineText}>Termin: {item.deadline}</Text>
            </View>
            <View style={styles.taskButtons}>
              <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
                <Text style={styles.completeButton}>
                  {item.completed ? 'Odznacz' : 'Ukończ'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editTask(item.id)}>
                <Text style={styles.editButton}>Edytuj</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteButton}>Usuń</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal do edycji zadania */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
      >
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
              onPress={showDatePicker}
            >
              <Text style={styles.dateButtonText}>
                {deadline ? `Deadline: ${deadline}` : 'Ustaw Deadline'}
              </Text>
            </TouchableOpacity>
            <Button title="Zapisz zmiany" onPress={saveEditedTask} />
            <Button
              title="Anuluj"
              color="red"
              onPress={() => setEditModalVisible(false)}
            />
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
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  completedTaskContainer: {
    backgroundColor: '#d4edda',
  },
  todayTaskContainer: {
    backgroundColor: '#ffebcd',
  },
  pastDeadlineTaskContainer: {
    backgroundColor: '#f8d7da',
  },
  taskText: {
    fontSize: 16,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  deadlineText: {
    fontSize: 14,
    color: '#888',
  },
  taskButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeButton: {
    color: 'green',
    marginRight: 10,
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});
