const KEY = "editTokens";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

export const getEditToken = (postId) => read()[postId] || null;

export const saveEditToken = (postId, token) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...read(), [postId]: token }));
  } catch {
    /* storage unavailable */
  }
};

export const removeEditToken = (postId) => {
  const all = read();
  delete all[postId];
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
};