import { useEffect, useState } from "react";
import api from "../api/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    loadAllTasks();
  }, []);

  // ================= LOAD ALL TASKS =================
  async function loadAllTasks() {
    try {
      const projectRes = await api.get("/projects");
      const projects = projectRes.data?.data?.projects || [];

      let allTasks = [];

      for (const project of projects) {
        const taskRes = await api.get(`/projects/${project.id}/tasks`);
        const projectTasks = taskRes.data?.data?.tasks || [];

        allTasks.push(
          ...projectTasks.map((task) => ({
            ...task,
            projectId: project.id,
            projectName: project.name,
          }))
        );
      }

      setTasks(allTasks);
    } catch (err) {
      console.error(err);
      alert("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  // ================= UPDATE STATUS =================
  async function updateTaskStatus(task, newStatus) {
    try {
      await api.patch(
        `/projects/${task.projectId}/tasks/${task.id}/status`,
        { status: newStatus }
      );

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        )
      );

      window.dispatchEvent(new Event("dashboard-refresh"));
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  }

  // ================= FILTER =================
  const filteredTasks = tasks.filter((t) => {
    const statusOk =
      statusFilter === "all" || t.status === statusFilter;

    const priorityOk =
      priorityFilter === "all" || t.priority === priorityFilter;

    return statusOk && priorityOk;
  });

  if (loading) return <p className="page-loading">Loading...</p>;

  return (
    <div className="tasks-page">
      <div className="tasks-card">
        <h2 className="page-title">All Tasks</h2>

        {/* FILTERS */}
        <div className="tasks-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <p className="empty-text">No tasks found</p>
        ) : (
          <div className="table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.projectName}</td>

                    <td>
                      <span className={`priority ${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <select
                        className={`status-select ${task.status}`}
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(task, e.target.value)
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>

                    <td>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
