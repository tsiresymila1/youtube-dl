import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useHistoryStore } from "@/store/history.ts";
import { useCallback, useState } from "react";
import { downloadVideo } from "@/api/command.ts";
import { Format, VideoInfo } from "@/types.ts";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

export type CategoryModalProps = DialogProps & {
    info: VideoInfo,
    timestamp: string
}


const QualityModal = ({info, timestamp = Date.now().toString(), ...props}: CategoryModalProps) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)
    const [format, setFormat] = useState<Format>([...info.formats].shift()!)
    const {addVideo} = useHistoryStore()
    const startVideo = useCallback(async () => {
        setLoading(true)
        try {
            addVideo(info.videoDetails, format!, timestamp)
            props.onClose?.({}, "escapeKeyDown")
            const extension = format!.hasVideo ? format!.mimeType.split(";").shift()?.split('/').pop() ?? 'mp4' : 'mp3'
            const promise = downloadVideo(info.videoDetails.videoId, format!.itag, `${info.videoDetails.title}.${extension}`, timestamp)
            toast.promise(promise, {
                loading: `Downloading "${info.videoDetails.title}"`,
                error: `Error downloading "${info.videoDetails.title}"`,
                success: "Download success"
            }, {
                position: "bottom-right"
            }).finally(() => {
                setLoading(false)
            })
            navigate("/history", {replace: true})
        } catch (e) {
            setLoading(false)
            toast.error("Error when downloading video.", {position: "bottom-right"});
        } finally {
            setLoading(false)
        }
    }, [info, format, timestamp])

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
                <FormControl fullWidth>
                    <Select
                        id="choose-format"
                        value={format?.itag}
                        onChange={(e) => {
                            const value = e.target.value
                            if (value && Number.isInteger(value)) {
                                setFormat(info.formats.find(e => e.itag === value)!)
                            }
                        }}
                    >
                        {info.formats.filter(e => e.hasVideo).map(e => {
                            return <MenuItem value={e.itag}>{e.qualityLabel} {e.mimeType.split(";").shift()}</MenuItem>
                        })}
                        {info.formats.filter(e => !e.hasVideo).slice(0, 1).map(e => {
                            return <MenuItem value={e.itag}>{e.qualityLabel} mp3</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Stack display="flex" direction="row" justifyContent="end" columnGap={1}>
                    <Button onClick={e => {
                        setLoading(false);
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
