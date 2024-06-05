import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCube, faPencilAlt, faCalendarAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import GoalInput from '../GoalInput/GoalInput';
import PomodoroTimer from '../PomodoroTimer/PomodoroTimer';
import Assessment from '../Assessment/Assessment';
import Calendar from '../Calendar/Calendar';

const FloatingMenuButton: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPencil, setShowPencil] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [IsTimerStarted, setIsTimerStarted] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [userStatus, setUserStatus] = useState('onboarding')

  const handleClick = async () => {
    try {
      const response: {} = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getStorage"}, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
      console.log(response);
      // if (response.currentGoal !== null) {
      //   setUserStatus('onboarding')
      // }
      } catch (error) {
        console.error('Error:', error);
      }; 
    setMenuOpen(!menuOpen);
    setShowPencil(false);
    setShowPomodoro(false);
    setShowCalendar(false);
  };

  const handleTimerStart = () => {
    setIsTimerStarted(true);
  }

  const handleTimerFinish = () => {
    setShowAssessment(true);
    setShowPomodoro(false);
    setIsTimerStarted(false);
  }

  const handleTimerStop = () => {
    setIsTimerStarted(false);
  }

  const handleAssessmentSubmit =() => {
    setShowAssessment(false);
    setShowPomodoro(false);
  }

  const handlePomodoroClick = () => {
    setShowPomodoro(!showPomodoro);
  }

  const handlePencilClick = () => {
    setShowPencil(!showPencil);
    };

  const handleCalendarClick = async () => {
    setShowCalendar(!showCalendar);
    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "getStorage" }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
      console.log(response);
      } catch (error) {
        console.error('Error:', error);
      };
  }

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    backgroundColor: '#3a2723',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;

  const iconButtonStyle = {
    position: 'fixed',
    width: '50px',
    height: '50px',
    backgroundColor: '#3a2723',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    zIndex: 999,
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;

  return (
    <>
      <button style={buttonStyle} onClick={handleClick}>
        <FontAwesomeIcon icon={menuOpen ? faX : faCube} />
      </button>
      {menuOpen && (
        <>
<<<<<<< HEAD
          {pencilOpen && (
              <><GoalInput/>
              </>)}
=======
          {showPencil && (
              <GoalInput/>)}
>>>>>>> 1d73a437edda84ebea7c1a76dd2107a0cd41be2a
          <button
            style={{
              ...iconButtonStyle,
              bottom: '90px',
              right: '20px',
            }}
            onClick={handlePencilClick}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>
          <button
            style={{
              ...iconButtonStyle,
              bottom: '90px',
              right: '90px',
            }}
            onClick={handleCalendarClick}
          >
            <FontAwesomeIcon icon={faCalendarAlt} />
          </button>
          <button
            style={{
              ...iconButtonStyle,
              bottom:'20px',
              right: '90px',
            }}
            onClick={handlePomodoroClick}
          >
            <FontAwesomeIcon icon={faHourglassHalf} />
          </button>
        </>
      )}
      {showPomodoro && (
        <div style={{ 
          position: 'fixed', 
          bottom: IsTimerStarted ? '110px' : '160px',
          right: IsTimerStarted ? '0px' : '160px',
          transform: IsTimerStarted ? 'scale(0.8)' : 'scale(1)',
          transition: 'all 0.8s ease-in-out',
          }}>
          <PomodoroTimer onTimerStart={handleTimerStart} onTimerFinish={handleTimerFinish} onTimerStop={handleTimerStop} />
        </div>
      )}
<<<<<<< HEAD
      {showAssessment && <Assessment onAssessmentSubmit={handleAssessmentSubmit}/>}
=======
      {showAssessment && <Assessment/>}
      {showCalendar && <Calendar/>}
>>>>>>> 1d73a437edda84ebea7c1a76dd2107a0cd41be2a
    </>
  );
};

export default FloatingMenuButton;
