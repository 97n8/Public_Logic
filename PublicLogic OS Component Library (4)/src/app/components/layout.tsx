import React from "react";
import { LayoutDashboard, FileText, Settings, Shield, User, Bell, Search, Menu, Box, Globe, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Seal image from Unsplash
const SEAL_URL = "https://images.unsplash.com/photo-1682005337311-82cc24ad9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2l0eSUyMHNlYWwlMjBsb2dvfGVufDF8fHx8MTc3MDI0NTMwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export const Sidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'case-space', icon: Box, label: 'Case Space' },
    { id: 'records', icon: FileText, label: 'Records Portal' },
    { id: 'network', icon: Globe, label: 'Municipal Network' },
    { id: 'settings', icon: Settings, label: 'Compliance' },
  ];

  const TEXTURE_BG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExEWFhUXGBgYGBgXGR0eHRgYHhgYGh0bGxgbHSggGBsmHR0YITEhJSkrLi4uGh8zODMsNygtLisBCgoKDg0OGxAQGzAlICYtLS0tNS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0vLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAEBQIDBgABBwj/xAA/EAABAgQDBQYEBAUDBAMAAAABAhEAAyExBBJBBSJRYXEGEzKBkaFCsdHwI1LB8RQVFmLhU4KSBzNDojRysv/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EADARAAICAQMDAQcEAQUAAAAAAAABAhEDEiExBBNBURQiYXGBofAVkbHx0QUyQsHh/9oADAMBAAIRAxEAPwDfY5SdKUrW54wHKxraxWrZs00FY9/kE78vqY6NvU4ve8IOw+JKiAKvB68wAJ/aANn4QSzvA9Um3lB07EuG8Q5iJ87Gi43A50ty7xQrDc49mIrSId2eMbo52eHDR4MKTYP0iXdmDtlYsS1FyXNIJSaQRim6BsDgSpTEkAX4iHGHSpDDM4FjyePZ09JqhwDLxJ1NIxlJyN4xURnPmlVhFGVQoU9DFUqdWLpuNJA04vEGnILtTDrU1H5isebOfLmKug4jnzi3E4sCoML0Y9ndi9Y0VuNGTcVKzsZOcOUNwEJ59T84OXJVML5qPS8WnBAJLh1Et9vG0WomElKYq7ugIf01rSPBGmRN3QDVqf4aIrwyHSoSxT4Wp6awu96oPZ/RiPDJdQrrDSalR3QsKHK49Y9xKJYL5CKaUr0EA5laJPvCb17lJaNmCY+UU0esJJqFE0MaRSVn4fWIDBn8qYa2E9zNnDTfykxJEpbsxjVIkzAKN6xESDyfp+sFhpE8nBUqovwA/WDJWHSlrkw1lyswYGouIE71qFNGN2hakPRR6tZIAAAHH/MeSJGrwDNmqJbSDcPLUzW6wMFuwySQaPHk5ZqEikW4XDtXWCkIAiU0i6bQrly18POO/hV/f7Q7SinhpHhpD7odpCmXgFa/KL0bM5wd3hicqcliVqZuES8khrHECGzxzjoLXtZiwlgjnHkLXIeiAnOKWC6UqHk49on/ADqfbL52iKkHiacIvQkNcvBt6C39ShE5ZNQRz4wSnM1fKPEShF0tKRctzqYAPcJKClgFuLHURfi+6AICK8XP2RCzGYsAgPaCMFtGwzPpWzQnfI01wRKBAWJw6iXSWhgtLH6R6ptHitQtIpImJ+L2MVrmTUgFnfh9IeIkEkB7xRMwhc1ZuBg1INLFUvaKtQYIRjCphWLFYMPvZvJvpFicIgK3VrAb4gL9WgbQkpBc3DktuuwrygcyB+WLjPOYHMfaIpOpMJSZTimclahYCBcXjMvWDUFPxEJ6xWMTJcDKDxUX9mtBYV8QXA48DWsE/A=";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-slate-900 border-r border-white/5 flex flex-col z-[50] shadow-2xl overflow-hidden">
      {/* Texture Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay grayscale invert"
        style={{ backgroundImage: `url(${TEXTURE_BG})`, backgroundSize: '300px' }}
      />
      
      <div className="p-8 relative z-10">
        <div className="flex flex-col mb-10 relative group">
          <span className="text-[10px] text-accent-primary font-black uppercase tracking-[0.4em] leading-none mb-2 drop-shadow-sm">Governance OS</span>
          <div className="h-px w-8 bg-accent-primary/50 mb-4" />
          <h1 className="text-xl font-black text-white tracking-tighter uppercase">Phillipston</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-small font-bold text-[14px] transition-all duration-200 text-left",
                activeTab === item.id 
                  ? "bg-accent-primary text-white shadow-lg shadow-accent-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-small border border-white/10 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-black truncate text-white uppercase tracking-wider">Town Clerk</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Phillipston, MA</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export const Header = ({ title }: { title: string }) => (
  <header className="h-[80px] border-b border-line bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-[40]">
    <div className="flex items-center gap-4">
      <button className="lg:hidden p-2 hover:bg-accent-primary/5 rounded-small">
        <Menu className="w-5 h-5 text-text-primary" />
      </button>
      <h1 className="text-xl font-bold tracking-tight text-text-primary">{title}</h1>
    </div>

    <div className="flex items-center gap-4">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input 
          type="text" 
          placeholder="Search requests..." 
          className="bg-slate-100 border border-slate-200 rounded-pill px-10 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent-primary/30 w-[240px] text-text-primary placeholder:text-text-muted/50"
        />
      </div>
      <button className="p-2 hover:bg-slate-100 rounded-full text-text-muted relative transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
      </button>
    </div>
  </header>
);

export const ViewToggle = ({ active, onChange }: { active: 'staff' | 'resident', onChange: (v: 'staff' | 'resident') => void }) => (
  <div className="flex p-1 bg-slate-100 rounded-pill border border-slate-200 w-fit">
    <button
      onClick={() => onChange('staff')}
      className={cn(
        "px-4 py-1.5 rounded-pill text-[11px] font-bold uppercase tracking-widest transition-all",
        active === 'staff' ? "bg-white text-accent-primary shadow-sm" : "text-text-muted hover:text-text-primary"
      )}
    >
      Staff
    </button>
    <button
      onClick={() => onChange('resident')}
      className={cn(
        "px-4 py-1.5 rounded-pill text-[11px] font-bold uppercase tracking-widest transition-all",
        active === 'resident' ? "bg-white text-accent-primary shadow-sm" : "text-text-muted hover:text-text-primary"
      )}
    >
      Resident
    </button>
  </div>
);
