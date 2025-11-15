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
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch data from CMS
  useEffect(() => {
    const loadData = async () => {
      console.log('====================================');
      console.log('🔄 useArchiveData: Starting data fetch...');
      console.log('🕐 Fetch triggered at:', new Date().toLocaleTimeString());
      console.log('====================================');

      setLoading(true);
      setError(null);

      const { families: fetchedFamilies, stories: fetchedStories, error: fetchError } = await fetchAllData();

      console.log('====================================');
      console.log('✅ useArchiveData: Data fetch complete!');
      console.log('👨‍👩‍👧‍👦 Number of families returned:', fetchedFamilies.length);
      console.log('📖 Number of stories returned:', fetchedStories.length);

      if (fetchedFamilies.length > 0) {
        console.log('🏠 First family name:', fetchedFamilies[0].familyName);
        console.log('🏠 First family data:', fetchedFamilies[0]);
      } else {
        console.log('⚠️ No families returned from API');
      }

      if (fetchError) {
        console.log('❌ Fetch error:', fetchError);
      }
      console.log('====================================');

      setFamilies(fetchedFamilies);
      setStories(fetchedStories);
      setError(fetchError);
      setLoading(false);
    };

    loadData();
  }, [refreshCounter]); // Re-fetch when refreshCounter changes

  // Retry function - full page reload
  const handleRetry = () => {
    window.location.reload();
  };

  // Manual refresh function - re-fetches without page reload
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered by user');
    setRefreshCounter(prev => prev + 1);
  };

  return {
    families,
    stories,
    loading,
    error,
    handleRetry,
    handleRefresh
  };
};