// API utility functions for the Historical Archive application

/**
 * Get full image URL from Strapi image object
 * @param {Object} imageObj - Strapi image object
 * @returns {string|null} - Full image URL or null if no image
 */
export const getStrapiImageUrl = (imageObj) => {
  console.log('🖼️ getStrapiImageUrl input:', imageObj);

  // Handle null/undefined
  if (!imageObj) {
    console.log('❌ No image object provided');
    return null;
  }

  let imageUrl = null;

  // Handle array structure (actual Strapi response)
  if (Array.isArray(imageObj) && imageObj.length > 0) {
    // featuredPhoto is an array, get first image
    const firstImage = imageObj[0];
    if (firstImage?.url) {
      imageUrl = firstImage.url;
      console.log('✅ Found image URL in array structure:', imageUrl);
    }
  }
  // Handle legacy nested structure
  else if (imageObj?.data?.attributes?.url) {
    imageUrl = imageObj.data.attributes.url;
    console.log('✅ Found image URL in v4 nested structure:', imageUrl);
  }
  // Handle flattened structure
  else if (imageObj?.attributes?.url) {
    imageUrl = imageObj.attributes.url;
    console.log('✅ Found image URL in flattened structure:', imageUrl);
  }
  // Handle direct URL
  else if (imageObj?.url) {
    imageUrl = imageObj.url;
    console.log('✅ Found direct image URL:', imageUrl);
  }
  else {
    console.log('❌ No image URL found in any expected structure');
    return null;
  }

  if (!imageUrl) {
    console.log('❌ Image URL is empty');
    return null;
  }

  const CMS_BASE_URL = 'https://children-families-cms.onrender.com';

  // If URL is already absolute, return as-is, otherwise construct full URL
  const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${CMS_BASE_URL}${imageUrl}`;
  console.log('🌐 Final image URL:', fullUrl);
  return fullUrl;
};

/**
 * Robust fetch function with error handling and timeout
 * @param {string} url - The API endpoint URL
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Object} - { success: boolean, data: array, error: string }
 */
export const fetchFromCMS = async (url, timeout = 10000) => {
  try {
    // Add timestamp for cache-busting
    const cacheBuster = `_t=${Date.now()}`;
    const urlWithCacheBuster = url.includes('?')
      ? `${url}&${cacheBuster}`
      : `${url}?${cacheBuster}`;

    console.log('🌐 Making API request to URL:', urlWithCacheBuster);
    console.log('🕐 Cache-buster timestamp:', Date.now());

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
    console.log('🔍 Strapi API Response:', data);
    console.log('🔍 Families data array:', data.data);

    if (data.data && data.data[0]) {
      console.log('🔍 First family complete structure:', JSON.stringify(data.data[0], null, 2));
      console.log('🔍 Available attributes keys:', Object.keys(data.data[0].attributes || {}));
      console.log('🔍 First family featuredPhoto:', data.data[0].attributes?.featuredPhoto);

      // Check for different possible image field names
      const attrs = data.data[0].attributes || {};
      ['featuredPhoto', 'featured_photo', 'image', 'photo', 'thumbnail'].forEach(field => {
        if (attrs[field] !== undefined) {
          console.log(`📷 Found image field '${field}':`, attrs[field]);
        }
      });
    }

    // Transform Strapi response: Since we're using populate=*, the data is already flat
    // The API returns featuredPhoto as an array directly in the attributes
    const transformedData = data.data?.map(item => {
      // In this version of Strapi, attributes are already at the root level
      const familyData = {
        id: item.id,
        documentId: item.documentId,
        familyName: item.familyName,
        timePeriod: item.timePeriod,
        description: item.description,
        location: item.location,
        childrenNames: item.childrenNames,
        featuredPhoto: item.featuredPhoto, // This will be an array or null
        imageSource: item.imageSource,
        photographer: item.photographer,
        imageDate: item.imageDate,
        collection: item.collection,
        usageRights: item.usageRights,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt
      };

      console.log(`📋 Processing family: ${familyData.familyName}`);
      console.log(`📷 Featured photo data:`, familyData.featuredPhoto);

      return familyData;
    }) || [];

    console.log('🔍 Transformed data sample:', transformedData[0]);

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

  // Use populate=* which works according to our API test
  console.log('🔄 Fetching families with populate=* to include featuredPhoto');
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

    // Set error only if both failed
    let error = null;
    if (!familiesResult.success && !storiesResult.success) {
      error = 'Unable to connect to archive database. Please check your connection or try again later.';
    } else if (!familiesResult.success || !storiesResult.success) {
      error = 'Some archive content may be temporarily unavailable.';
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