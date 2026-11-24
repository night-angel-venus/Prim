import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'; // <--- Added useLocation
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from './ui/sidebar';
import { LayoutDashboard, Users, Plane, Logs, ShoppingCart, UserRoundGroup, MessageSquare, Clock, Phone, EighthNote } from 'lucide-react';


export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation(); // <--- Get the current URL

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

    const navItems = [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Employees", url: "/employees", icon: Users },
        { title: "Activity Log", url: "/reports", icon: Logs },
        { title: "TikTok Live", url: "/tiktok", icon: EighthNote },
        { title: "Purchases", url: "/purchases", icon: ShoppingCart },
        { title: "Deadlines", url: "/deadlines", icon: Clock },
        { title: "FedEx", url: "/fedex", icon: Plane },
        { title: "Phrasebank", url: "/phrasebank", icon: MessageSquare },
        { title: "Accounts", url: "/accounts", icon: UserRoundGroup },
        { title: "Contacts", url: "/contacts", icon: Phone },
    ];

    return (
        <SidebarProvider className='select-none'>
            <Sidebar>
                <SidebarHeader>
                    <img src="/Sidebar_logo.svg"  alt="" />
                </SidebarHeader>
                
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        {/* isActive checks if the current URL matches the item's URL */}
                                        <Link to={item.url} className='flex flex-row items-center gap-2'>
                                        <SidebarMenuButton 
                                            isActive={location.pathname === item.url}
                                        >
                                                <item.icon/>

                                                
                                                <span>{item.title}</span>
                                        </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    
                    <div>
                       
                    </div>

                    <button onClick={handleLogout} className="w-full px-2 py-1 cursor-pointer text-[#161111] hover:bg-[#e5b85c]/70 bg-[#E5B85C] rounded-xs">
                        Log out
                    </button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="flex flex-col h-screen overflow-hidden">
                <header className="bg-[#9a0002] text-[#efe6dd] flex h-10 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />

                    <div className='flex flex-row justify-between w-full pe-11'>
                        <h2 className='font-bold'>BEA | BizSolv Everyday Archive</h2>
                        <h2 className="font-bold">{currentDate}</h2>
                    </div>
                </header>
                <main className="bg-[#efe6dd] flex flex-1 flex-col overflow-hidden h-[calc(100vh-64px)] gap-4 py-2 px-15">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}