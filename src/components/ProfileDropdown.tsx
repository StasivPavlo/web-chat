import { ChevronsUpDown, CircleUserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import api from '@api/axios';
import * as userActions from '@features/user/userSlice';
import { useMemo } from "react";

const ProfileDropdown = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const settings = useMemo(() => {
    return [
      {
        label: 'Open Profile',
        onClick: () => console.log('open profile'),
      },
      {
        label: 'Edit Profile',
        onClick: () => console.log('edit profile'),
      },
      {
        label: 'Logout',
        onClick: async () => {
          await api.post("/auth/logout");
          localStorage.removeItem('accessToken');
          dispatch(userActions.remove());
        },
      },
    ];
  }, []);

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="
                flex aspect-square size-6 items-center justify-center rounded-lg bg-sidebar-primary
                text-sidebar-primary-foreground
              ">
                <CircleUserRound className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{ user.name }</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {settings.map((setting, id) => (
             <>
               <DropdownMenuItem
                 key={setting.label}
                 onSelect={setting.onClick}
               >
                 {setting.label}
               </DropdownMenuItem>

               { id !== (settings.length - 1) && (
                 <DropdownMenuSeparator />
               )}
             </>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default ProfileDropdown;
