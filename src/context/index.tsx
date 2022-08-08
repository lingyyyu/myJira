import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import {QueryClientProvider,QueryClient} from 'react-query' 

//在根节点中将App包裹
export const AppProviders = ({ children }: { children: ReactNode }) => {
    return (
    <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
            {children}
        </AuthProvider>
    </QueryClientProvider>
    )
}