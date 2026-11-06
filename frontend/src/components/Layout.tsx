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
import { Home, Users, Truck, Video, ShoppingCart, FileText, MessageSquare, Clock, Key, Phone } from 'lucide-react';


export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation(); // <--- Get the current URL
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "Employees", url: "/employees", icon: Users },
        { title: "FedEx", url: "/fedex", icon: Truck },
        { title: "TikTok Live", url: "/tiktok", icon: Video },
        { title: "Purchases", url: "/purchases", icon: ShoppingCart },
        { title: "Report Logs", url: "/reports", icon: FileText },
        { title: "Phrasebank", url: "/phrasebank", icon: MessageSquare },
        { title: "Deadlines", url: "/deadlines", icon: Clock },
        { title: "Accounts", url: "/accounts", icon: Key },
        { title: "Contacts", url: "/contacts", icon: Phone },
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <img src="/public/Sidebar_logo.svg"  alt="" />
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
                    <button onClick={handleLogout} className="w-full px-2 py-1 cursor-pointer text-[#161111] hover:bg-[#e5b85c]/70 bg-[#E5B85C] rounded-xs">
                        Log out
                    </button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="bg-[#9a0002] text-[#efe6dd] flex h-10 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />

                    <div className='flex flex-row justify-between w-full pe-11'>
                        <h2 className='font-bold'>PRIM Admin Panel</h2>
                        <h2 className="font-semibold">Hello, {user?.name || 'Admin'}!</h2>
                    </div>
                </header>
                <main className="bg-[#efe6dd] flex flex-1 flex-col gap-4 py-4 px-15">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}