import { createHashRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import NiceModal from '@ebay/nice-modal-react'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/features/home/HomePage'
import { HistoryPage } from "@/features/history/HistoryPage.tsx";
import { DetailPage } from "@/features/details/DetailPage.tsx";

const router = createHashRouter([
    {
        element: (
            <NiceModal.Provider>
                <Layout/>
            </NiceModal.Provider>
        ),
        children: [
            {
                path: '/',
                index: true,
                element: <HomePage/>,
            },
            {
                path: '/history',
                index: true,
                element: <HistoryPage/>,
            },
            {
                path: '/video/:id',
                index: true,
                element: <DetailPage/>,
            },
        ],
    },
])

export function Router() {
    return <RouterProvider router={router}/>
}
