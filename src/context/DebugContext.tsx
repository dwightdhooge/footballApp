import React, { createContext, useContext, useState, ReactNode } from "react";

interface DebugContextType {
  isDebugMode: boolean;
  showDebugTab: () => void;
  hideDebugTab: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = (): DebugContextType => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error("useDebug must be used within a DebugProvider");
  }
  return context;
};

interface DebugProviderProps {
  children: ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [isDebugMode, setIsDebugMode] = useState(false);

  const showDebugTab = () => {
    setIsDebugMode(true);
  };

  const hideDebugTab = () => {
    setIsDebugMode(false);
  };

  return (
    <DebugContext.Provider
      value={{
        isDebugMode,
        showDebugTab,
        hideDebugTab,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};
