import baseData from '../data/appData.json';

const STORAGE_KEY = 'appDataOverrides_v1';

const deepMerge = (target, source) => {
  if (Array.isArray(target) && Array.isArray(source)) return source;
  if (typeof target === 'object' && typeof source === 'object') {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      out[key] = deepMerge(target?.[key], source[key]);
    }
    return out;
  }
  return source === undefined ? target : source;
};

export const getAppData = async () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const overrides = raw ? JSON.parse(raw) : {};
    return deepMerge(baseData, overrides);
  } catch {
    return baseData;
  }
};

const setOverrides = (overrides) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
};

export const updateAppData = async (patch) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const overrides = raw ? JSON.parse(raw) : {};
  const next = deepMerge(overrides, patch);
  setOverrides(next);
  return deepMerge(baseData, next);
};

export const recordAssessmentResult = async (assessmentId, score, level, answers) => {
  const now = new Date().toISOString();
  const raw = localStorage.getItem(STORAGE_KEY);
  const overrides = raw ? JSON.parse(raw) : {};
  const history = overrides?.interactions?.assessmentsHistory || [];
  const nextHistory = [
    ...history,
    { id: assessmentId, date: now, score, level }
  ];
  const answersStore = overrides?.user?.answers || {};
  const nextAnswers = { ...answersStore, [assessmentId]: { date: now, answers } };

  const next = deepMerge(overrides, {
    interactions: { assessmentsHistory: nextHistory },
    user: { answers: nextAnswers }
  });

  setOverrides(next);
  return deepMerge(baseData, next);
};
