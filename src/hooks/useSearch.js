import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing search functionality
 * @param {Array} families - Array of family data
 * @param {Array} stories - Array of story data
 * @param {Function} getTimelineData - Function to get timeline data
 * @returns {Object} - Search state and handlers
 */
export const useSearch = (families, stories, getTimelineData) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState({ families: [], stories: [], timeline: [] });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(globalSearch, 300);

  // Memoized search functions for better performance
  const searchFamilies = useCallback((query) => {
    if (!query || !Array.isArray(families)) return families;

    const lowercaseQuery = query.toLowerCase();
    return families.filter(family => {
      return (
        (family.familyName && family.familyName.toLowerCase().includes(lowercaseQuery)) ||
        (family.childrenNames && family.childrenNames.toLowerCase().includes(lowercaseQuery)) ||
        (family.description && family.description.toLowerCase().includes(lowercaseQuery)) ||
        (family.location && family.location.toLowerCase().includes(lowercaseQuery)) ||
        (family.timePeriod && family.timePeriod.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [families]);

  const searchStories = useCallback((query) => {
    if (!query || !Array.isArray(stories)) return stories;

    const lowercaseQuery = query.toLowerCase();
    return stories.filter(story => {
      return (
        (story.title && story.title.toLowerCase().includes(lowercaseQuery)) ||
        (story.content && story.content.toLowerCase().includes(lowercaseQuery)) ||
        (story.storyType && story.storyType.toLowerCase().includes(lowercaseQuery)) ||
        (story.timePeriod && story.timePeriod.toLowerCase().includes(lowercaseQuery))
      );
    });
  }, [stories]);

  const searchTimelineEvents = useCallback((query) => {
    if (!query) return [];

    const timelineData = getTimelineData();
    const allEvents = [];

    Object.entries(timelineData).forEach(([year, yearData]) => {
      const yearEvents = [...(yearData.historical || []), ...(yearData.families || [])];
      yearEvents.forEach(event => {
        allEvents.push({ ...event, year });
      });
    });

    const lowercaseQuery = query.toLowerCase();
    return allEvents.filter(event => {
      return (
        (event.title && event.title.toLowerCase().includes(lowercaseQuery)) ||
        (event.description && event.description.toLowerCase().includes(lowercaseQuery)) ||
        (event.family && event.family.toLowerCase().includes(lowercaseQuery)) ||
        (event.children && event.children.toLowerCase().includes(lowercaseQuery)) ||
        (event.location && event.location.toLowerCase().includes(lowercaseQuery)) ||
        (event.year && event.year.includes(lowercaseQuery))
      );
    });
  }, [getTimelineData]);

  // Update search results when debounced search changes
  useEffect(() => {
    if (debouncedSearch.trim()) {
      const results = {
        families: searchFamilies(debouncedSearch),
        stories: searchStories(debouncedSearch),
        timeline: searchTimelineEvents(debouncedSearch)
      };
      setSearchResults(results);
      setIsSearchActive(true);
    } else {
      setSearchResults({ families: [], stories: [], timeline: [] });
      setIsSearchActive(false);
    }
  }, [debouncedSearch, searchFamilies, searchStories, searchTimelineEvents]);

  // Handle search input changes
  const handleSearchChange = useCallback((value) => {
    setGlobalSearch(value);
    setShowSearchOverlay(value.length > 0);
  }, []);

  // Handle search result selection
  const handleSearchResultClick = useCallback((type, item) => {
    setShowSearchOverlay(false);
    setGlobalSearch('');

    return { type, item };
  }, []);

  return {
    globalSearch,
    debouncedSearch,
    searchResults,
    isSearchActive,
    showSearchOverlay,
    setShowSearchOverlay,
    handleSearchChange,
    handleSearchResultClick
  };
};