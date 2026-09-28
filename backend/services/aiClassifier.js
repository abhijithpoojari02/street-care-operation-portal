// AI-powered issue classification service
// This uses keyword matching as a fallback, but can be enhanced with OpenAI API

const classifyIssue = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Define keywords for each category
  const categoryKeywords = {
    'Roads': [
      'road', 'pothole', 'street', 'asphalt', 'pavement', 'crack', 'highway',
      'intersection', 'traffic', 'lane', 'divider', 'speed bump', 'road damage',
      'broken road', 'uneven road', 'road repair'
    ],
    'Drainage': [
      'drain', 'drainage', 'sewer', 'water', 'flood', 'waterlog', 'gutter',
      'manhole', 'pipe', 'overflow', 'clog', 'blocked drain', 'water stagnant',
      'rainwater', 'sewage', 'water accumulation'
    ],
    'Streetlight': [
      'light', 'streetlight', 'lamp', 'bulb', 'electricity', 'illumination',
      'dark', 'lighting', 'street lamp', 'light post', 'not working',
      'broken light', 'dim light', 'flickering'
    ],
    'Waste Management': [
      'garbage', 'trash', 'waste', 'dustbin', 'litter', 'rubbish', 'dump',
      'smell', 'dirty', 'bin', 'collection', 'disposal', 'cleanliness',
      'overflowing', 'garbage collection', 'waste disposal'
    ],
    'Parks': [
      'park', 'garden', 'playground', 'bench', 'tree', 'grass', 'plant',
      'fountain', 'recreation', 'green space', 'public park', 'children play',
      'swing', 'slide', 'maintenance'
    ]
  };

  // Calculate score for each category
  const scores = {};
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    scores[category] = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        scores[category]++;
      }
    }
  }

  // Find category with highest score
  let bestCategory = 'Other';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  // If no keywords matched, return 'Other'
  if (maxScore === 0) {
    return 'Other';
  }

  return bestCategory;
};

// Enhanced classification with confidence score
const classifyWithConfidence = (title, description) => {
  const category = classifyIssue(title, description);
  const text = `${title} ${description}`.toLowerCase();
  
  // Calculate confidence based on keyword matches
  const categoryKeywords = {
    'Roads': ['road', 'pothole', 'street', 'asphalt', 'pavement'],
    'Drainage': ['drain', 'drainage', 'sewer', 'water', 'flood'],
    'Streetlight': ['light', 'streetlight', 'lamp', 'bulb', 'electricity'],
    'Waste Management': ['garbage', 'trash', 'waste', 'dustbin', 'litter'],
    'Parks': ['park', 'garden', 'playground', 'bench', 'tree']
  };

  const keywords = categoryKeywords[category] || [];
  const matches = keywords.filter(kw => text.includes(kw)).length;
  const confidence = Math.min((matches / 3) * 100, 100); // Max 100%

  return {
    category,
    confidence: Math.round(confidence),
    suggestedCategories: category === 'Other' ? ['Roads', 'Drainage', 'Streetlight', 'Waste Management', 'Parks'] : [category]
  };
};

module.exports = { classifyIssue, classifyWithConfidence };