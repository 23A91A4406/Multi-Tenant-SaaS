import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const projectsRes = await api.get("/projects");
        const projectsData = projectsRes.data?.data?.projects || [];
        setProjects(projectsData);

        let allTasks = [];

        for (let project of projectsData) {
          try {
            const taskRes = await api.get(
              `/projects/${project.id}/tasks?assignedTo=${user.id}`
            );

            const projectTasks =
              taskRes.data?.data?.tasks?.map((t) => ({
                ...t,
                project: {
                  id: project.id,
                  name: project.name,
                },
              })) || [];

            allTasks = allTasks.concat(projectTasks);
          } catch {}
        }

        setTasks(allTasks);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user.id]);

  if (loading) {
    return <p style={{ padding: 30 }}>Loading dashboard...</p>;
  }

  // ===== STATS =====
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  // ===== FILTER TASKS =====
  const filteredTasks =
    taskFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === taskFilter);

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>

      {/* ================= STATS BOXES ================= */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <span className="stat-title">Projects</span>
          <span className="stat-value">{totalProjects}</span>
        </div>

        <div className="stat-box">
          <span className="stat-title">Tasks</span>
          <span className="stat-value">{totalTasks}</span>
        </div>

        <div className="stat-box success">
          <span className="stat-title">Completed</span>
          <span className="stat-value">{completedTasks}</span>
        </div>

        <div className="stat-box warning">
          <span className="stat-title">Pending</span>
          <span className="stat-value">{pendingTasks}</span>
        </div>
      </div>

      {/* ================= RECENT PROJECTS ================= */}
      <h3 style={{ marginTop: 40 }}>Recent Projects</h3>

      {projects.length === 0 && <p>No projects found</p>}

      <ul>
        {projects.slice(0, 5).map((p) => (
          <li key={p.id} style={{ marginBottom: 6 }}>
            <Link to={`/projects/${p.id}`}>
              <b>{p.name}</b>
            </Link>{" "}
            — {p.status} •{" "}
            {tasks.filter((t) => t.project?.id === p.id).length} tasks
          </li>
        ))}
      </ul>

      {/* ================= MY TASKS ================= */}
      <h3 style={{ marginTop: 40 }}>My Tasks</h3>

      <div style={{ marginBottom: 10 }}>
        <label>
          Filter:&nbsp;
          <select
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            style={{ padding: 6 }}
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
      </div>

      <div style={styles.tableWrapper}>
        {filteredTasks.length === 0 ? (
          <p style={{ padding: 20 }}>No tasks assigned</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t, idx) => (
                <tr key={idx}>
                  <td>{t.title}</td>
                  <td>{t.project?.name || "—"}</td>
                  <td>{t.priority || "medium"}</td>
                  <td>{t.status}</td>
                  <td>
                    {t.dueDate
                      ? new Date(t.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ================= TABLE STYLES ================= */
const styles = {
  tableWrapper: {
    background: "#1f2933",        // dark, no white
    borderRadius: 8,
    border: "1px solid #2d3748",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
