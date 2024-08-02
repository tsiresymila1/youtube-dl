import type { ContainerProps } from '@mui/material'
import { Container } from '@mui/material'
import { AnimatePresence, motion } from "framer-motion";
import React from 'react'

type ScreenProps = {
    children: React.ReactNode | React.ReactNode[] | null
} & ContainerProps

export function Screen({children, ...props}: ScreenProps) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                style={{ height: "100%"}}
            >
                <Container style={{ height: "100%"}} maxWidth="xl" color="background.paper" {...props}>
                    <React.Fragment>{children}</React.Fragment>
                </Container>
            </motion.div>
        </AnimatePresence>

    )
}
