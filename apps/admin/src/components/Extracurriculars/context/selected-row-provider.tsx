import { createContext, useContext, useState } from 'react';
import type { TableRowType } from '../core/types';

export type TableDialogType = 'add' | 'edit' | 'delete' | null;

export type DialogState =
  | {
      openDialog: 'add' | null;
    }
  | {
      openDialog: 'edit' | 'delete';
      selectedRow: TableRowType;
    };

type SelectedRowContextType = {
  handleCancel: () => void;
  dialogState: DialogState;
  handleDialogStateChange: (dialogState: DialogState) => void;
};

const SelectedRowContext = createContext<SelectedRowContextType | null>(null);

export function SelectedRowProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    openDialog: null,
  });

  const handleCancel = () => {
    setDialogState({ openDialog: null });
  };

  const handleDialogStateChange = (dialogState: DialogState) => {
    setDialogState(dialogState);
  };

  return (
    <SelectedRowContext.Provider
      value={{
        handleCancel,
        dialogState,
        handleDialogStateChange,
      }}
    >
      {children}
    </SelectedRowContext.Provider>
  );
}

export const useSelectedRow = () => {
  const context = useContext(SelectedRowContext);
  if (!context) {
    throw new Error('useSelectedRow must be used within a SelectedRowProvider');
  }
  return context;
};
