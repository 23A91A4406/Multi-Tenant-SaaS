import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function ProjectDetails() {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  async function fetchProject() {
    const res = await api.get("/projects");
    const found = res.data?.data?.projects?.find(
      (p) => p.id === projectId
    );
    setProject(found || null);
  }

  async function fetchTasks() {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data?.data?.tasks || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [projectId]);

  async function addTask() {
    if (!title.trim()) return alert("Task title required");

    await api.post(`/projects/${projectId}/tasks`, {
      title,
      priority,
      dueDate: dueDate || null,
    });

    setTitle("");
    setPriority("Medium");
    setDueDate("");
    fetchTasks();
  }

  async function updateTask(task, updates) {
    await api.put(`/projects/${projectId}/tasks/${task.id}`, {
      title: task.title,
      priority: updates.priority ?? task.priority,
      status: updates.status ?? task.status,
      dueDate: task.dueDate,
    });
    fetchTasks();
  }

  async function deleteTask(taskId) {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div style={{ padding: "30px 40px" }}>
      <h2>{project.name}</h2>

      <p><b>Status:</b> {project.status}</p>
      <p><b>Description:</b> {project.description || "-"}</p>

      <hr style={{ margin: "20px 0" }} />

      {/* ADD TASK */}
      <h3>Add Task</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 25 }}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={addTask}>Add</button>
      </div>

      {/* TASK TABLE */}
      <h3>Tasks</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 12px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Priority</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Due</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} style={rowStyle}>
              <td style={tdLeft}>{t.title}</td>

              <td style={tdCenter}>
                <select
                  value={t.priority}
                  onChange={(e) =>
                    updateTask(t, { priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </td>

              <td style={tdCenter}>
                <select
                  value={t.status}
                  onChange={(e) =>
                    updateTask(t, { status: e.target.value })
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>

              <td style={tdCenter}>
                {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}
              </td>

              <td style={tdCenter}>
                <button
                  style={{ color: "red", padding: "6px 12px" }}
                  onClick={() => deleteTask(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Link to="/projects">← Back to Projects</Link>
    </div>
  );
}

/* ===== STYLES ===== */
const thStyle = {
  textAlign: "center",
  fontWeight: 600,
  paddingBottom: 10,
};

const tdCenter = {
  textAlign: "center",
};

const tdLeft = {
  textAlign: "left",
  paddingLeft: 10,
};

const rowStyle = {
  background: "#f7f1f1ff",
  borderRadius: 8,
};
