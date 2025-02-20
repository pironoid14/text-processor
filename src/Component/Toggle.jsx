import { useEffect } from 'react';
import { useState } from 'react'


function Toggle() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(()=>{
        localStorage.setItem('theme',theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    },[theme])

    const toggleTheme = ()=>{
        setTheme(theme === 'light' ? 'dark':'light');
    }
  return (
    <button onClick={toggleTheme} className='text-black dark:text-white'> {theme === 'light' ? 'Dark Mode' : 'Light Mode'}</button>
  )
}

export default Toggle;