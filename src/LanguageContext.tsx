import {createContext, useContext, type ReactNode} from "react"
import {translations} from "./translations"

type Language = keyof typeof translations

type LanguageContextType = {
    language: Language
    t: (typeof translations)[Language]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({children}: {children: ReactNode}){
    const browserLanguage = navigator.language.split("-")[0]

    const language: Language = browserLanguage === "pl" ? "pl" : "en"

    const t = translations[language]

    return(
        <LanguageContext.Provider value={{language, t}}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)

    if(!context){
        throw new Error("useLanguage must be used inside LanguageProvider")
    }

    return context
}