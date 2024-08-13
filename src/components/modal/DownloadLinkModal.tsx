import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    InputAdornment,
    Stack,
    TextField
} from "@mui/material";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useCallback, useState } from "react";
import { LinkOutlined } from "@mui/icons-material";
import { getVideoInfo } from "@/api/command.ts";
import { QualityDialogModal } from "@/components/modal/QualityModal.tsx";
import { toast } from "react-hot-toast";

export type DownloadLinkModalProps = DialogProps


const DownloadLinkModal = ({...props}: DownloadLinkModalProps) => {

    const [link, setLink] = useState<String>("")
    const startVideo = useCallback(async () => {
        const toastId = toast.loading("Getting video info ...")
        const info = await getVideoInfo(link)
        toast.dismiss(toastId)
        props.onClose?.({}, "escapeKeyDown")
        await NiceModal.show(QualityDialogModal, {
            info
        })
    }, [link])

    return (
        <Dialog
            {...props}
            open={props.open}
            fullWidth
            scroll="paper"
        >
            <DialogTitle id="scroll-dialog-title">
                Enter link
            </DialogTitle>
            <DialogContent>
                <Stack>
                    <TextField
                        sx={{
                            px: 2,
                            py: 0
                        }}
                        variant='standard'
                        placeholder="Enter youtube link or videoId"
                        margin="dense"
                        focused
                        fullWidth
                        InputProps={{
                            autoFocus: true,
                            endAdornment: (
                                <InputAdornment position="start">
                                    <LinkOutlined color="disabled"/>
                                </InputAdornment>
                            ),
                            disableUnderline: true,
                            sx: {
                                px: 2,
                                borderRadius: 1,
                                py: 1
                            }
                        }}
                        onChange={e => setLink(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack display="flex" direction="row" justifyContent="end" columnGap={1}>
                    <Button onClick={e => {
                        props.onClose?.(e, "escapeKeyDown")
                    }} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button disabled={link.trim().length === 0} onClick={startVideo} variant="contained" color="success">
                        Download
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}

export const DownloadLinkDialogModal = NiceModal.create<DownloadLinkModalProps>((props) => {
    const modal = useModal()
    return <DownloadLinkModal {...props} open={modal.visible} onClose={modal.hide}/>
})
