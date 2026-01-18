import React from 'react';

// Inspired by react-hot-toast library
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Define action types as an enum
enum ActionType {
  ADD_TOAST = 'ADD_TOAST',
  UPDATE_TOAST = 'UPDATE_TOAST',
  DISMISS_TOAST = 'DISMISS_TOAST',
  REMOVE_TOAST = 'REMOVE_TOAST',
}

type Action =
  | {
      type: ActionType.ADD_TOAST;
      toast: ToasterToast;
    }
  | {
      type: ActionType.UPDATE_TOAST;
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType.DISMISS_TOAST;
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType.REMOVE_TOAST;
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  for (const listener of listeners) {
    listener(memoryState);
  }
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case ActionType.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case ActionType.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      };
    case ActionType.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...toastProps }: Toast) {
  const id = genId();

  const updateToastFn = (toastUpdate: ToasterToast) =>
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: toastUpdate,
    });
  const dismiss = () =>
    dispatch({ type: ActionType.DISMISS_TOAST, toastId: id });

  dispatch({
    type: ActionType.ADD_TOAST,
    toast: {
      ...toastProps,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss();
        }
      },
    },
  });

  return {
    id,
    dismiss,
    update: updateToastFn,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: ActionType.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

let count = 0;
