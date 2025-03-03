import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

interface LoadingStateContextProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}


const LoadingStateContext = createContext<LoadingStateContextProps | undefined>(undefined);

export const useLoadingState = () => {
  const context = useContext(LoadingStateContext);
  if (!context) {
    throw new Error("useLoadingState must be used within a LoadingStateProvider");
  }
  return context;
};

interface LoadingStateProviderProps {
  children: React.ReactNode;
}

export const LoadingStateProvider: React.FC<LoadingStateProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingStateContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingStateContext.Provider>
  );
};
