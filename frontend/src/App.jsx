import { useEffect, useState } from 'react';
import { getAllTasks, createTask } from './api/taskService';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to connect to Spring Boot server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newTask = await createTask({ title, description });
      setTasks((prev) => [...prev, newTask]);
      setTitle('');
      setDescription('');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.title) {
        setError(serverErrors.title);
      } else {
        setError(err.response?.data?.detail || 'Something went wrong');
      }
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Task title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Add Task</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '8px' }}>
              <strong>{task.title}</strong> — {task.description || 'No description'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}