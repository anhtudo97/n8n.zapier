"use client"

import { FolderOpenIcon, HistoryIcon, KeyIcon } from 'lucide-react'
import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import Link from 'next/link'

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions"
            },
        ]
    }
]

export const AppSidebar = () => {
    return (
        <Sidebar collapsible='icon'>
            <SidebarContent>
                {
                    menuItems.map((group, index) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupContent>
                                {
                                    group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={false}
                                                asChild
                                                className="gap-x-4 h-10 px-4"
                                            >
                                                <Link href={item.url} prefetch>
                                                    <item.icon className="size-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
            </SidebarContent>
        </Sidebar>
    )
}
