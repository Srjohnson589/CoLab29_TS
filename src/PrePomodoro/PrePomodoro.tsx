import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPencilAlt, faRepeat, faPlus, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import Assessment, { AssessmentData } from '../Assessment/Assessment';

interface Props {
  goal: string;
  subtasksList: string[];
  onSubtaskClick: (subtask: Subtask) => void;
  handleTimerStart: () => void;
  handleTimerStop: () => void;
  
  showAssessment: boolean;
  setShowAssessment: React.Dispatch<React.SetStateAction<boolean>>;
  handleAssessmentSubmit: (assessment: AssessmentData) => void;
  assessment: { [week: string]: { [day: number]: AssessmentData[] } };
  
}
interface Subtask {
  id: number;
  title: string;
  completed: boolean;
  started: boolean;
}

const PrePomodoro: React.FC<Props> = ({ goal, subtasksList, onSubtaskClick, handleTimerStart, handleTimerStop, showAssessment, setShowAssessment, handleAssessmentSubmit }) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [activeSubtask, setActiveSubtask] = useState<Subtask | null>(null);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [showPomodoroTimer, setShowPomodoroTimer] = useState(false);

  useEffect(() => {
    setSubtasks(subtasksList.map((title: string, index: number) => ({ id: index, title, completed: false, started: false })));
  }, [subtasksList]);

  useEffect(() => {
    const anySubtaskStarted = subtasks.some((subtask) => subtask.started);
    const allSubtasksCompleted = subtasks.every((subtask) => subtask.completed);

    if (anySubtaskStarted && allSubtasksCompleted) {
      setShowAssessment(false);
    } else {
      setShowAssessment(false);
    }
  }, [subtasks, setShowAssessment]);

  const handleSubtaskChange = (id: number, title: string) => {
    const updatedSubtasks = subtasks.map((subtask) => {
      if (subtask.id === id) {
        return { ...subtask, title };
      }
      return subtask;
    });
    setSubtasks(updatedSubtasks);
  };

  const handleSubtaskClick = (subtask: Subtask) => {
    setActiveSubtask(subtask);
    setEditMode(null);

    const updatedSubtasks = subtasks.map((st) => {
      if (st.id === subtask.id) {
        return { ...st, started: true };
      }
      return st;
    });
    setSubtasks(updatedSubtasks);
  };

  const handleSubtaskCompleted = (subtask: Subtask) => {
    setActiveSubtask(null);
    const updatedSubtasks = subtasks.map((st) => {
      if (st.id === subtask.id) {
        return { ...st, completed: true };
      }
      return st;
    });
    setSubtasks(updatedSubtasks);

    if (updatedSubtasks.every((subtask) => subtask.completed)) {
      setShowAssessment(false);
    }
  };

  const handleRedoSubtask = (subtask: Subtask) => {
    setActiveSubtask(subtask);
    const updatedSubtasks = subtasks.map((st) => {
      if (st.id === subtask.id) {
        return { ...st, completed: false };
      }
      return st;
    });
    setSubtasks(updatedSubtasks);
  };

  const handleAddSubtask = () => {
    const newSubtask: Subtask = {
      id: subtasks.length,
      title: '',
      completed: false,
      started: false,
    };
    setSubtasks([...subtasks, newSubtask]);
    setEditMode(newSubtask.id);
  };

  const handleEditSubtask = (id: number) => {
    setEditMode(id);
  };

  const handleStartPomodoroTimer = () => {
    setShowPomodoroTimer(true);
    handleTimerStart();
  }

  const handleTimerFinish = () => {
    setShowPomodoroTimer(false);
    if (activeSubtask) {
      handleSubtaskCompleted(activeSubtask);
    }
    setShowAssessment(true);
  };

  const handleEndSession = () => {
    setShowAssessment(true);
  }
  
 

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: '32px',
    backgroundColor: '#F8F9FF',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '480px',
    height: '500px',
    border: '1px solid #D0D5DD',
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
  };

  const goalStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: 'Roboto',
    margin: 0,
  };

  const multipleSubtaskContainerStyle: React.CSSProperties = {
    height: '340px',
    overflowY: 'scroll'
  };

  const subtaskContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: 'rgba(56, 96, 143, 0.05)',
    border: '1px solid #C3C6CF',
    borderRadius: '12px',
    padding: '16px',
    height: '82px',
    marginBottom: '16px',
  };

  const subtaskTitleStyle: React.CSSProperties = {
    flex: 1,
    fontSize: '16px',
    fontWeight: 400,
    marginBottom: '8px',
    fontFamily: 'Roboto',
  };

  const subtaskButtonsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    fontFamily: 'Roboto',
    fontSize: '14px',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: 'rgba(34, 25, 26, 1)',
    cursor: 'pointer',
    border: 'none',
    marginRight: '8px',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
  };

  const startButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'rgba(56, 96, 143, 1)',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: '14px', 
    fontWeight: 500,
    padding: '8px 14px',
    borderRadius: '8px',

  };

  const addButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'rgba(215, 227, 248, 1)',
    color: 'rgba(16, 28, 43, 1)',
    padding: '8px 14px',
    fontWeight: 500,
    fontSize: '14px',
    borderRadius: '8px'
  };

  const completedStyle: React.CSSProperties = {
    textDecoration: 'line-through',
    color: 'gray',
  };

  return (
    <>
      {showAssessment ? (
        <Assessment
          onAssessmentSubmit={(assessment: AssessmentData) => handleAssessmentSubmit(assessment)}
          assessment={{ rating: 0, reflection: '' }}
        />
      ) : (
        <>
          {showPomodoroTimer ? (
              <PomodoroTimer
                setShowPomodoroTimer={setShowPomodoroTimer}
                onTimerStart={handleTimerStart}
                onTimerFinish={handleTimerFinish}
                subtaskTitle={activeSubtask ? activeSubtask.title : ''}
                subtaskList={[]}
                goal={goal}
              />
          ) : (
            <>
              <div style={containerStyle}>
              <h2 style={goalStyle}>{goal}</h2>
              <div style={multipleSubtaskContainerStyle}>
                {subtasks.map((subtask) => (
                  <div key={subtask.id} style={subtaskContainerStyle}>
                    <div style={subtaskTitleStyle}>
                      {editMode === subtask.id ? (
                        <input
                          type="text"
                          value={subtask.title}
                          onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                          style={inputStyle}
                          autoFocus
                        />
                      ) : (
                        <span style={subtask.completed ? completedStyle : undefined}>{subtask.title}</span>
                      )}
                    </div>
                    <div style={subtaskButtonsStyle}>
                      <button
                        onClick={() => {
                          setActiveSubtask(subtask);
                          setShowPomodoroTimer(true);
                          handleTimerStart();
                        }}
                        style={buttonStyle}
                      >
                        <FontAwesomeIcon icon={faPlay} style={{marginRight: '5px'}}/> Start Timer
                      </button>
                      <button onClick={() => handleEditSubtask(subtask.id)} style={buttonStyle}>
                        <FontAwesomeIcon icon={faPencilAlt} style={{marginRight: '5px'}}/> Edit Task
                      </button>
                      {subtask.completed && (
                        <button onClick={() => handleRedoSubtask(subtask)} style={buttonStyle}>
                          <FontAwesomeIcon icon={faRepeat} style={{marginRight: '5px'}}/> Repeat Task
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <button onClick={handleStartPomodoroTimer} style={startButtonStyle}>
                  Start Pomodoro Timer <FontAwesomeIcon icon={faPlay} style={{marginLeft: '5px'}}/>
                </button>
                <button onClick={handleAddSubtask} style={addButtonStyle}>
                  Add Subtask <FontAwesomeIcon icon={faPlus} style={{marginLeft: '5px'}} />
                </button>
                {subtasks.every((subtask) => subtask.completed) && (
                  <button onClick={handleEndSession} style={addButtonStyle}>
                    End Session <FontAwesomeIcon icon={faCheck} style={{marginLeft: '5px'}}/>
                  </button>
                )}
              </div>
              </div>
            </>
          )}
        </>
      )}
    
    </>
  );
};

export default PrePomodoro;

