import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";

//在根节点中将App包裹
export const AppProviders = ({ children }: { children: ReactNode }) => {
    return <AuthProvider>
        {children}
    </AuthProvider>
}