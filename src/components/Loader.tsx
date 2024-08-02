import { useEffect, useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import { useIsFetching } from "react-query";

export const Loader = () => {
    const ref = useRef<LoadingBarRef>(null)
    const isFetching = useIsFetching()
    useEffect(() => {
        if (isFetching) {
            ref.current?.continuousStart()
        } else {
            ref.current?.complete()
        }
    }, [isFetching]);
    return <LoadingBar height={4} color='#8E092FFF' ref={ref}/>
}
