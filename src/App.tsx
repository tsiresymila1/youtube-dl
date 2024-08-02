import { Router } from '@/router'
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/api/client.ts";
import { Loader } from './components/Loader';


export default function App() {
    return <QueryClientProvider client={queryClient}>
        <Router/>
        <Loader/>
    </QueryClientProvider>
}
