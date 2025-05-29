import { Outlet, redirect } from "react-router"
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import { MobileSidebar, NavItems } from "../../../components"
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

interface User {
    $id: string;
    status?: 'admin' | 'user';
}

export async function clientLoader() {
  try {
      const user = await account.get();
      if(!user.$id) return redirect('/sign-in');

      const existingUser = await getExistingUser(user.$id);
      
      // If no existing user, create one
      if (!existingUser) {
          try {
              const newUser = await storeUserData();
              // New users are always regular users, redirect to home
              return redirect('/');
          } catch (error) {
              console.error('Error creating user:', error);
              return redirect('/');
          }
      }

      // If user exists but is not admin, redirect to home
      if (existingUser.status !== 'admin') {
          return redirect('/');
      }

      return existingUser;
  } catch (e) {
      console.log('Error in clientLoader', e);
      // If there's an error but user is logged in, redirect to home
      const user = await account.get();
      if (user.$id) {
          return redirect('/');
      }
      return redirect('/sign-in');
  }
}

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
      {/* This is for Mobile */}
            <MobileSidebar/>
        {/* This is for desktop */}
        <aside className=" w-full max-w-[270px] hidden lg:block">
            <SidebarComponent width= {270} enableGestures = {false}>
              <NavItems handleClick={() => {}} />
            </SidebarComponent>
        </aside>
        {/* This will be for content */}
        <aside className = "children">
                <Outlet/>
             </aside>
    </div>
    
  )
}

export default AdminLayout
