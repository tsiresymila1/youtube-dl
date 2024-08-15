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
    const [loading, setLoading]= useState<boolean>(false)
    const [link, setLink] = useState<String>("")

    const reset = useCallback(()=> {
        setLoading(false)
        setLink("")
    },[])
    const startVideo = useCallback(async () => {
        setLoading(true)
        try{
            const toastId = toast.loading("Getting video info ...",{
                position: "bottom-right"
            })
            const info = await getVideoInfo(link)
            toast.dismiss(toastId)
            props.onClose?.({}, "escapeKeyDown")
            reset()
            await NiceModal.show(QualityDialogModal, {
                info
            })
        }catch(err){
            toast.dismiss()
            toast.error(`${err}`)
            reset()
        }
        finally {
            reset()
        }
    }, [link,reset])

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
                        value={link}
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
                        reset()
                        props.onClose?.(e, "escapeKeyDown")
                    }} variant="contained" color="error">
                        Cancel
                    </Button>
                    <Button sx={{ color: "white"}} disabled={link.trim().length === 0 || loading} onClick={startVideo} variant="contained" color="success">
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
