import { Outlet } from "react-router"
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import { MobileSidebar, NavItems } from "../../../components"

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
