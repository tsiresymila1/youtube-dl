import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    Stack,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useHistoryStore } from "@/store/history.ts";
import { useCallback, useState } from "react";
import { checkDownload, downloadVideo } from "@/api/command.ts";
import { Format, VideoInfo } from "@/types.ts";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

export type CategoryModalProps = DialogProps & {
    info: VideoInfo
}


const QualityModal = ({info, ...props}: CategoryModalProps) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [format, setFormat] = useState<Format | undefined>([...info.formats].shift())
    const {addVideo} = useHistoryStore()
    const startVideo = useCallback(async () => {
        setLoading(true)
        try {
            const canDownload = await checkDownload()
            if (canDownload) {
                console.log(format)
                addVideo(info.videoDetails, format!.itag)
                props.onClose?.({}, "backdropClick")
                navigate("/history")
                const extension = format!.mimeType.split(";").shift()?.split('/').pop() ?? 'mp4'
                const promise = downloadVideo(info.videoDetails.videoId, format!.itag, `${info.videoDetails.title}.${extension}`)
                await toast.promise(promise, {
                    loading: `Downloading "${info.videoDetails.title}"`,
                    error: `Error downloading "${info.videoDetails.title}"`,
                    success: "Download success"
                }, {
                    position: "bottom-right"
                })
            } else {
                toast.error("FFMPEG not installed. Please install it.", {position: "bottom-right"});
            }
        } catch (e) {
            toast.error("Error when downloading video.", {position: "bottom-right"});
        } finally {
            setLoading(false)
        }

    }, [info, format])

    return (
        <Dialog
            {...props}
            open={props.open}
            fullWidth
            scroll="paper"
        >
            <DialogTitle id="scroll-dialog-title">
                Format
            </DialogTitle>
            <DialogContent dividers>
                <ToggleButtonGroup
                    value={format}
                    exclusive
                    onChange={(_, v) => setFormat(v)}
                >
                    {info.formats.filter(e => e.hasVideo).map(e => {
                        return <ToggleButton value={e} aria-label="left aligned">
                            {e.qualityLabel} {e.mimeType.split(";").shift()}
                        </ToggleButton>
                    })}
                </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
                <Stack display="flex" direction="row" justifyContent="end" columnGap={1}>
                    <Button onClick={e => {
                        props.onClose?.(e, "escapeKeyDown")
                    }} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button disabled={!format || loading} sx={{color: "white"}} onClick={startVideo} variant="contained"
                            color="success">
                        Start
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

export const QualityDialogModal = NiceModal.create<CategoryModalProps>((props) => {
    const modal = useModal()
    return <QualityModal {...props} open={modal.visible} onClose={modal.hide}/>
})
