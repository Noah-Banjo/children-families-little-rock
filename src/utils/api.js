// API utility functions for the Historical Archive application

/**
 * Get full image URL from Strapi image object
 * @param {Object} imageObj - Strapi image object
 * @returns {string|null} - Full image URL or null if no image
 */
export const getStrapiImageUrl = (imageObj) => {
  if (!imageObj) return null;

  let imageUrl = null;

  if (Array.isArray(imageObj) && imageObj.length > 0) {
    imageUrl = imageObj[0]?.url ?? null;
  } else if (imageObj?.data?.attributes?.url) {
    imageUrl = imageObj.data.attributes.url;
  } else if (imageObj?.attributes?.url) {
    imageUrl = imageObj.attributes.url;
  } else if (imageObj?.url) {
    imageUrl = imageObj.url;
  }

  if (!imageUrl) return null;

  const CMS_BASE_URL = 'https://children-families-cms.onrender.com';
  return imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
};

/**
 * Robust fetch function with error handling and timeout
 * @param {string} url - The API endpoint URL
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 * @returns {Object} - { success: boolean, data: array, error: string }
 */
export const fetchFromCMS = async (url, timeout = 30000) => {
  try {
    // Add timestamp for cache-busting
    const cacheBuster = `_t=${Date.now()}`;
    const urlWithCacheBuster = url.includes('?')
      ? `${url}&${cacheBuster}`
      : `${url}?${cacheBuster}`;

    const response = await fetch(urlWithCacheBuster, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      signal: AbortSignal.timeout(timeout)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const transformedData = data.data?.map(item => ({
      id: item.id,
      documentId: item.documentId,
      familyName: item.familyName,
      timePeriod: item.timePeriod,
      description: item.description,
      location: item.location,
      childrenNames: item.childrenNames,
      featuredPhoto: item.featuredPhoto,
      imageSource: item.imageSource,
      photographer: item.photographer,
      imageDate: item.imageDate,
      collection: item.collection,
      usageRights: item.usageRights,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      publishedAt: item.publishedAt
    })) || [];

    return { success: true, data: transformedData, error: null };
  } catch (error) {
    console.error('CMS fetch error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Fetch families data from CMS
 * @returns {Object} - { success: boolean, data: array, error: string }
 */
export const fetchFamilies = async () => {
  const CMS_BASE_URL = 'https://children-families-cms.onrender.com/api';
  return await fetchFromCMS(`${CMS_BASE_URL}/families?populate=*`);
};

/**
 * Fetch stories data from CMS
 * @returns {Object} - { success: boolean, data: array, error: string }
 */
export const fetchStories = async () => {
  const CMS_BASE_URL = 'https://children-families-cms.onrender.com/api';
  return await fetchFromCMS(`${CMS_BASE_URL}/stories?populate=*`);
};

/**
 * Fetch all data (families and stories) from CMS
 * @returns {Object} - { families: array, stories: array, error: string|null }
 */
export const fetchAllData = async () => {
  try {
    const [familiesResult, storiesResult] = await Promise.all([
      fetchFamilies(),
      fetchStories()
    ]);

    // Only set data if successful, otherwise keep empty arrays
    const families = familiesResult.success ? familiesResult.data : [];
    const stories = storiesResult.success ? storiesResult.data : [];

    // Clear error if families loaded successfully with data
    let error = null;
    if (familiesResult.success && families.length > 0) {
      // Data loaded successfully - clear any errors
      error = null;
    } else if (!familiesResult.success) {
      // Families fetch failed - show error
      error = 'Unable to connect to archive database. Please check your connection or try again later.';
    }

    return { families, stories, error };

  } catch (err) {
    console.error('Data fetch error:', err);
    return {
      families: [],
      stories: [],
      error: 'Archive temporarily unavailable. Please try again later.'
    };
  }
};

/**
 * Call Claude API for chatbot functionality
 * @param {string} prompt - The enhanced prompt to send to Claude
 * @returns {Object} - { success: boolean, response: string, error: string }
 */
export const callClaudeAPI = async (prompt) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    return { success: true, response: aiResponse, error: null };

  } catch (error) {
    console.error('Error calling Claude API:', error);
    return { success: false, response: null, error: error.message };
  }
};