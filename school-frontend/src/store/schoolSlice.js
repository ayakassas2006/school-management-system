import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [
    { id: 'CLS001', name: 'Advanced Mathematics', instructor: 'Prof. Mark Davis', students: 28, capacity: 30, schedule: 'Mon, Wed 09:00 AM', status: 'Active', color: 'var(--color-primary)' },
    { id: 'CLS002', name: 'Physics 101', instructor: 'Dr. Sarah Jenkins', students: 35, capacity: 40, schedule: 'Tue, Thu 11:00 AM', status: 'Active', color: 'var(--color-secondary)' },
    { id: 'CLS003', name: 'World History', instructor: 'Elena Rodríguez', students: 45, capacity: 45, schedule: 'Mon, Fri 01:00 PM', status: 'Full', color: 'var(--color-accent)' },
    { id: 'CLS004', name: 'Computer Science Fundamentals', instructor: 'James Wilson', students: 15, capacity: 30, schedule: 'Wed 02:00 PM', status: 'Active', color: 'var(--color-success)' },
  ],
  events: [
    { id: 1, title: 'Staff Meeting', time: '10:00 - 11:50', location: 'Conference Room A', dayIndex: 2, top: '160px', height: '150px', color: 'var(--color-primary)' },
    { id: 2, title: 'School Assembly', time: '13:00 - 14:30', location: 'Main Hall', dayIndex: 4, top: '400px', height: '110px', color: 'var(--color-warning)' },
  ]
};

const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
      const newEvent = {
        id: Date.now(),
        title: action.payload.name,
        time: '09:00 - 10:30',
        location: 'Room ' + (100 + state.courses.length),
        dayIndex: 1,
        top: '80px',
        height: '120px',
        color: action.payload.color || 'var(--color-primary)'
      };
      state.events.push(newEvent);
    },
    setCourses: (state, action) => {
      // Replace the entire courses array with fresh data from the backend
      state.courses = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    }
  }
});

export const { addCourse, setCourses, addEvent } = schoolSlice.actions;
export default schoolSlice.reducer;
