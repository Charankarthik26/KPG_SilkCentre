import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');
    const [transitionPosition, setTransitionPosition] = useState(null);

    useEffect(() => {
        // Only set the attribute on mount, no transition
        document.documentElement.setAttribute('data-theme', theme);
    }, []);

    const toggleTheme = (e) => {
        // Get click coordinates for the circular reveal animation
        const x = e.clientX;
        const y = e.clientY;
        setTransitionPosition({ x, y });

        // Change the theme state immediately
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        // Wait briefly for React to render the overlay, then start animation and swap theme
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', newTheme);
            setTheme(newTheme);

            // Remove overlay after animation completes (adjust timing based on CSS duration)
            setTimeout(() => {
                setTransitionPosition(null);
            }, 800);
        }, 50);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* The global background */}
            <div className="glass-background">
                <div className="glass-orb orb-gold"></div>
                <div className="glass-orb orb-accent"></div>
            </div>

            {/* The circular reveal overlay */}
            {transitionPosition && (
                <div
                    className={`theme-transition-overlay ${theme === 'dark' ? 'to-light' : 'to-dark'}`}
                    style={{
                        '--click-x': `${transitionPosition.x}px`,
                        '--click-y': `${transitionPosition.y}px`,
                    }}
                ></div>
            )}

            {/* The app content, ensured to be above background */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
