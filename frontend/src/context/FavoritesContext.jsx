import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/user/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    }, [token]);

    useEffect(() => {
        if (user && token) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user, token, fetchFavorites]);

    const toggleFavorite = async (productId) => {
        if (!user) return { success: false, message: 'Please login to add favorites' };

        try {
            const response = await fetch(`${API_BASE_URL}/user/favorites/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.favorited) {
                    setFavorites(prev => [...prev, productId]);
                } else {
                    setFavorites(prev => prev.filter(id => id !== productId));
                }
                return { success: true, favorited: data.favorited };
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            return { success: false, message: 'Server error' };
        }
    };

    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading, fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
