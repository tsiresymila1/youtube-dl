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
import { downloadVideo } from "@/api/command.ts";
import { VideoDetails } from "@/types.ts";
import { useNavigate } from "react-router";

export type CategoryModalProps = DialogProps & {
    details: VideoDetails
}

export enum VideoQuality {
    Highest = 'Highest',
    Lowest = 'Lowest',
    Highest_Audio = "Highest Audio",
    Lowest_Audio = "Lowest Audio",
    Highest_Video = "Highest Video",
    Lowest_Video = "Lowest Video"
}

const QualityModal = ({details, ...props}: CategoryModalProps) => {
    const navigate = useNavigate()
    const [quality, setQuality] = useState<VideoQuality>(VideoQuality.Highest)
    const {addVideo} = useHistoryStore()
    const startVideo = useCallback(async () => {
        addVideo(details)
        await downloadVideo(details.videoId, quality, details.title)
        props.onClose?.({}, "backdropClick")
        navigate("/history")
    }, [details, quality])

    return (
        <Dialog
            {...props}
            open={props.open}
            fullWidth
            scroll="paper"
        >
            <DialogTitle id="scroll-dialog-title">
                Quality
            </DialogTitle>
            <DialogContent dividers>
                <ToggleButtonGroup
                    value={quality}
                    exclusive
                    onChange={(_, v) => setQuality(v)}
                >
                    {Object.values(VideoQuality).map(e => {
                        return <ToggleButton value={e} aria-label="left aligned">
                            {e}
                        </ToggleButton>
                    })}
                </ToggleButtonGroup>
            </DialogContent>
            <DialogActions>
                <Stack display="flex" direction="row" justifyContent="end" columnGap={1}>
                    <Button onClick={e => {
                        props.onClose?.(e, "escapeKeyDown")
                    }} variant="contained" color="warning">
                        Cancel
                    </Button>
                    <Button onClick={startVideo} variant="contained" color="info">
                        Ok
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
