import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React from "react";
import Error from "./error";


export default function DashbaordLayout({
                                            children,
                                            create,
                                            delete_car,
                                            update,
                                        }: {
    children: React.ReactNode
    // team: React.ReactNode
    // user:React.ReactNode
    // login:React.ReactNode
    create: React.ReactNode
    delete_car: React.ReactNode
    update: React.ReactNode
}) {

    return (

        <div>
            {/* <Link href={'/dashboard'}> Dashboard </Link>
            <Link href={'/dashboard/settings'}>Setting Page</Link> */}
            <ErrorBoundary errorComponent={Error}>
                {children}
                {/* {team}
              {user}*/}
                {/* {create}  */}

                {create}
                {update}
                {delete_car}
            </ErrorBoundary>
        </div>
    )
}