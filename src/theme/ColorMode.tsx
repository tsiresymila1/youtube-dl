import React, { PropsWithChildren, useContext } from "react";

type ColorModeProps = {
    toggleColorMode: () => void
}

const ColorModeContext = React.createContext<ColorModeProps>({
    toggleColorMode: () => {
    }
});

export type ColorModeProviderProps = PropsWithChildren & ColorModeProps
export const ColorModeProvider = ({children, toggleColorMode}: ColorModeProviderProps) => {
    return <ColorModeContext.Provider value={{toggleColorMode}}>
        {children}
    </ColorModeContext.Provider>
}

export const useColorMode = () => useContext<ColorModeProps>(ColorModeContext)
