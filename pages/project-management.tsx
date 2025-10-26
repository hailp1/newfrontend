import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { apiService } from '../services/api';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  team: string[];
  tasks: Task[];
  milestones: Milestone[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  dependencies: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  deliverables: string[];
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState('');

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    team: [] as string[]
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: '',
    dueDate: ''
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        loadProjects();
      }
    }
  }, []);

  const loadProjects = async () => {
    try {
      const response = await apiService.getProjects();
      if (response.success && response.data) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const createProject = async () => {
    if (!newProject.title.trim()) return;

    setLoading(true);
    try {
      const response = await apiService.createProject(newProject);
      if (response.success) {
        setShowCreateModal(false);
        setNewProject({ title: '', description: '', startDate: '', endDate: '', team: [] });
        loadProjects();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!selectedProject || !newTask.title.trim()) return;

    setLoading(true);
    try {
      const response = await apiService.updateProject(selectedProject.id, {
        tasks: [...selectedProject.tasks, {
          id: Date.now().toString(),
          ...newTask,
          status: 'todo',
          dependencies: []
        }]
      });
      
      if (response.success) {
        setNewTask({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
        loadProjects();
        setSelectedProject(projects.find(p => p.id === selectedProject.id) || null);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (projectId: string, taskId: string, status: Task['status']) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updatedTasks = project.tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      );

      await apiService.updateProject(projectId, { tasks: updatedTasks });
      loadProjects();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#f59e0b';
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'on-hold': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <Head>
        <title>Project Management - NCS Research Platform</title>
        <meta name="description" content="Manage your research projects with AI-powered project management tools" />
      </Head>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                📊 Project Management
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                Manage your research projects with AI-powered tools
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + New Project
              </button>
              <Link href="/" style={{ 
                color: '#3b82f6', 
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                border: '1px solid #3b82f6',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#3b82f6';
              }}
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left Column - Projects List */}
          <div>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '0.75rem', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                📁 My Projects
              </h2>
              
              {projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
                  <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No projects yet</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Create Your First Project
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      style={{
                        padding: '1rem',
                        border: selectedProject?.id === project.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: selectedProject?.id === project.id ? '#f0f9ff' : 'white'
                      }}
                      onMouseOver={(e) => {
                        if (selectedProject?.id !== project.id) {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedProject?.id !== project.id) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                          {project.title}
                        </h3>
                        <span style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: getStatusColor(project.status),
                          color: 'white',
                          borderRadius: '0.25rem',
                          textTransform: 'capitalize'
                        }}>
                          {project.status}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                        {project.description}
                      </p>
                      
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Progress</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{project.progress}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${project.progress}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                        <span>📅 {formatDate(project.startDate)}</span>
                        <span>👥 {project.team.length} members</span>
                        <span>📋 {project.tasks.length} tasks</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Project Details */}
          <div>
            {selectedProject ? (
              <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {selectedProject.title}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                      {selectedProject.description}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: getStatusColor(selectedProject.status),
                    color: 'white',
                    borderRadius: '0.375rem',
                    textTransform: 'capitalize',
                    fontWeight: '500'
                  }}>
                    {selectedProject.status}
                  </span>
                </div>

                {/* Project Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #0ea5e9' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0369a1', marginBottom: '0.25rem' }}>
                      {selectedProject.progress}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>Progress</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #22c55e' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', marginBottom: '0.25rem' }}>
                      {selectedProject.tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#fef3c7', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>
                      {selectedProject.tasks.filter(t => t.status === 'in-progress').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#d97706' }}>In Progress</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', border: '1px solid #6b7280' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.25rem' }}>
                      {selectedProject.team.length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#374151' }}>Team Members</div>
                  </div>
                </div>

                {/* Tasks Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                      📋 Tasks
                    </h3>
                    <button
                      onClick={() => {
                        const taskTitle = prompt('Enter task title:');
                        if (taskTitle) {
                          setNewTask({ ...newTask, title: taskTitle });
                          addTask();
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      + Add Task
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedProject.tasks.map((task) => (
                      <div key={task.id} style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: task.status === 'completed' ? '#f0fdf4' : 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                              type="checkbox"
                              checked={task.status === 'completed'}
                              onChange={(e) => updateTaskStatus(selectedProject.id, task.id, e.target.checked ? 'completed' : 'todo')}
                              style={{ margin: 0 }}
                            />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: 0 }}>
                              {task.title}
                            </h4>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              padding: '0.125rem 0.375rem',
                              backgroundColor: getPriorityColor(task.priority),
                              color: 'white',
                              borderRadius: '0.25rem',
                              textTransform: 'capitalize'
                            }}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(selectedProject.id, task.id, e.target.value as Task['status'])}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.25rem',
                                backgroundColor: 'white'
                              }}
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                            {task.description}
                          </p>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>👤 {task.assignee || 'Unassigned'}</span>
                          <span>📅 {task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones Section */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                    🎯 Milestones
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} style={{
                        padding: '1rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: milestone.status === 'completed' ? '#f0fdf4' : 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', margin: 0 }}>
                            {milestone.title}
                          </h4>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: milestone.status === 'completed' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            borderRadius: '0.25rem',
                            textTransform: 'capitalize'
                          }}>
                            {milestone.status}
                          </span>
                        </div>
                        
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                          {milestone.description}
                        </p>
                        
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          📅 Due: {formatDate(milestone.dueDate)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                background: 'white', 
                padding: '4rem 2rem', 
                borderRadius: '0.75rem', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Select a Project
                </h3>
                <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                  Choose a project from the list to view details and manage tasks
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
              width: '500px',
              maxWidth: '90vw'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem' }}>
                Create New Project
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Enter project title"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={createProject}
                  disabled={!newProject.title.trim() || loading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: (!newProject.title.trim() || loading) ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: (!newProject.title.trim() || loading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;