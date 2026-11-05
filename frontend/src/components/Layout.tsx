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
                    <button onClick={handleLogout} className="w-full p-2 bg-red-600 text-white rounded">
                        Log out
                    </button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                    <h2 className="font-semibold">Hello, {user?.name || 'Admin'}!</h2>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}