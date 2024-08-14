import { toast, ToastBar, Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const ToasterApp = () => {
    useEffect(() => {
        listen<{event: string, message: string}>(`app_event`, (event) => {
            if (event.payload.event === "success") {
                toast.success(event.payload.message.toString())
            } else {
                toast.error(event.payload.message.toString())
            }
        }).then(() => null)
    }, [])
    return <Toaster>
        {(t) => (
            <ToastBar style={{ backgroundColor: "transparent"}} position="bottom-right" toast={t}>
                {({icon, message}) => (
                    <Alert
                        icon={icon}
                        variant="standard"
                        severity={
                            t.type === "success" ? "success" : t.type === "error" ? "error" : "info"
                        }
                        action={
                            t.type !== 'loading' ? (
                                <IconButton onClick={() => toast.dismiss(t.id)}>
                                    <Close />
                                </IconButton>
                            ) : undefined
                        }
                    >
                        {message}

                    </Alert>
                )}
            </ToastBar>
        )}
    </Toaster>;
}
