export interface ISnackBarContextType {
      snackBarState: {
        snackbarOpen: boolean;
        snackbarMessage: string;
        snackbarSeverity: string;
      };
      updateSnackBarState: (
        isOpen: boolean,
        message: any,
        severity: string
      ) => void;
    }