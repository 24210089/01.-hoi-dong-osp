// src/context/SidebarContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isCompact, setIsCompact] = useState(() => {
    const saved = localStorage.getItem("sidebarCompact");
    return saved === "true";
  });

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const saved = localStorage.getItem("sidebarExpandedGroups");
    return saved ? JSON.parse(saved) : [];
  });

  const [pinnedItems, setPinnedItems] = useState(() => {
    const saved = localStorage.getItem("sidebarPinnedItems");
    return saved ? JSON.parse(saved) : [];
  });

  /**
   * Save state to localStorage
   */
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("sidebarCompact", isCompact);
  }, [isCompact]);

  useEffect(() => {
    localStorage.setItem(
      "sidebarExpandedGroups",
      JSON.stringify(expandedGroups)
    );
  }, [expandedGroups]);

  useEffect(() => {
    localStorage.setItem("sidebarPinnedItems", JSON.stringify(pinnedItems));
  }, [pinnedItems]);

  /**
   * Toggle sidebar
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Open sidebar
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close sidebar
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle compact mode
   */
  const toggleCompact = useCallback(() => {
    setIsCompact((prev) => !prev);
  }, []);

  /**
   * Toggle group expansion
   */
  const toggleGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  }, []);

  /**
   * Expand group
   */
  const expandGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => {
      if (!prev.includes(groupId)) {
        return [...prev, groupId];
      }
      return prev;
    });
  }, []);

  /**
   * Collapse group
   */
  const collapseGroup = useCallback((groupId) => {
    setExpandedGroups((prev) => prev.filter((id) => id !== groupId));
  }, []);

  /**
   * Collapse all groups
   */
  const collapseAllGroups = useCallback(() => {
    setExpandedGroups([]);
  }, []);

  /**
   * Toggle pin item
   */
  const togglePin = useCallback((itemId) => {
    setPinnedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  }, []);

  /**
   * Pin item
   */
  const pinItem = useCallback((itemId) => {
    setPinnedItems((prev) => {
      if (!prev.includes(itemId)) {
        return [...prev, itemId];
      }
      return prev;
    });
  }, []);

  /**
   * Unpin item
   */
  const unpinItem = useCallback((itemId) => {
    setPinnedItems((prev) => prev.filter((id) => id !== itemId));
  }, []);

  /**
   * Clear all pins
   */
  const clearPins = useCallback(() => {
    setPinnedItems([]);
  }, []);

  /**
   * Check if item is pinned
   */
  const isPinned = useCallback(
    (itemId) => {
      return pinnedItems.includes(itemId);
    },
    [pinnedItems]
  );

  /**
   * Check if group is expanded
   */
  const isGroupExpanded = useCallback(
    (groupId) => {
      return expandedGroups.includes(groupId);
    },
    [expandedGroups]
  );

  /**
   * Reset sidebar state
   */
  const reset = useCallback(() => {
    setIsOpen(true);
    setIsCompact(false);
    setExpandedGroups([]);
    setPinnedItems([]);
    localStorage.removeItem("sidebarOpen");
    localStorage.removeItem("sidebarCompact");
    localStorage.removeItem("sidebarExpandedGroups");
    localStorage.removeItem("sidebarPinnedItems");
  }, []);

  const value = {
    isOpen,
    isCompact,
    expandedGroups,
    pinnedItems,
    toggle,
    toggleSidebar: toggle,
    open,
    close,
    closeSidebar: close,
    toggleCompact,
    toggleGroup,
    expandGroup,
    collapseGroup,
    collapseAllGroups,
    togglePin,
    pinItem,
    unpinItem,
    clearPins,
    isPinned,
    isGroupExpanded,
    reset,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

/**
 * useSidebar hook
 */
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

export default SidebarContext;
