import { useState, useEffect } from 'react';
import { fetchAllData } from '../utils/api';

/**
 * Custom hook for managing archive data (families and stories)
 * @returns {Object} - Archive data state and handlers
 */
export const useArchiveData = () => {
  const [families, setFamilies] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from CMS
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      const { families: fetchedFamilies, stories: fetchedStories, error: fetchError } = await fetchAllData();

      setFamilies(fetchedFamilies);
      setStories(fetchedStories);
      setError(fetchError);
      setLoading(false);
    };

    loadData();
  }, []);

  // Retry function
  const handleRetry = () => {
    window.location.reload();
  };

  return {
    families,
    stories,
    loading,
    error,
    handleRetry
  };
};