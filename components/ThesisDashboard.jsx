import { useState } from "react";

export default function ThesisDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review Model Output", due: "Today", completed: false },
    { id: 2, text: "Draft Introduction", due: "Fri", completed: false },
    { id: 3, text: "Find 3 More Papers", due: "Next Week", completed: false },
  ]);

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Deverall Thesis Progress
          </h1>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">
                65% Complete
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "65%" }}></div>
            </div>
          </div>
        </div>

        {/* Rest of your component using the CSS utility classes */}
        {/* ... (giữ nguyên phần JSX từ code trước) ... */}
      </div>
    </div>
  );
}
