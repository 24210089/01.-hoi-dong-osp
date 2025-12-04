// src/utils/media.js

const DEFAULT_API_BASE = "http://localhost:5000";

const getFileBase = () => {
  const apiUrl = import.meta.env.REACT_APP_API_URL || DEFAULT_API_BASE;
  // If apiUrl ends with /api strip it so we point to the root server origin
  return apiUrl.replace(/\/?api\/?$/, "");
};

/**
 * Convert a stored relative upload path (e.g. /uploads/photos/xxx.jpg)
 * into a fully-qualified URL the browser can request. Falls back to the
 * provided value if it is already an absolute URL or a blob reference.
 */
export const resolveMediaUrl = (url) => {
  if (!url) {
    return "";
  }

  if (url.startsWith("http") || url.startsWith("blob:")) {
    return url;
  }

  const base = getFileBase();
  if (!base) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${base}${url}`;
  }

  return `${base}/${url}`;
};
