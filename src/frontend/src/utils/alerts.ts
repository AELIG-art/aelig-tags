import {enqueueSnackbar} from "notistack";

export const alertToast = (message: string, isError?: boolean) => {
    enqueueSnackbar(
        message,
        {
            variant: isError ? 'error' : 'success',
            persist: false,
            preventDuplicate: true,
            transitionDuration: 3,
            className: `rounded-0 ${isError ? "bg-danger" : "bg-success"}`,
        }
    );
}