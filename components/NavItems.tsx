import {Link, NavLink, useLoaderData, useNavigate} from "react-router";
import {sidebarItems} from "~/constants";
import {cn} from "~/lib/utils";

const NavItems = ({handleClick}: { handleClick: () => void }) => {

    const user = {
        name: 'Adrian',
        email: 'contact@support.com',
        imageUrl: '/assets/images/david.webp'
    }

  return (
    <section className="nav-items">
      <Link to = '/' className = "link-logo">
            <img src="/assets/icons/logo.svg" alt = "logo" className="size-[30px]"/>
            <h1>Tourvisto</h1>
      </Link>   

      <div className="container">
        <nav>
            {sidebarItems.map(({id, href, icon, label }) =>(
                <NavLink to= {href} key = {id}>
                    {({isActive} : {isActive: boolean}) => (
                        <div className={cn('group flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-primary-100 hover:text-white', {
                            'bg-primary-100 text-white': isActive
                        })} onClick={handleClick}>
                            <img
                                src ={icon}
                                alt = {label}
                                className={cn('w-6 h-6 transition-all', {
                                    'brightness-0 invert': isActive,
                                    'group-hover:brightness-0 group-hover:invert': !isActive
                                })}
                            />
                            <span>{label}</span>
                        </div>
                    )}
                </NavLink>
            ))}
        </nav>

        <footer className="nav-footer">
            <img src= {user?.imageUrl || '/assets/images/david.webp'} alt = {user?.name || "David"}/>
            <article>
               <h2>{user?.name}</h2> 
                <p>{user?.email}</p>
            </article>
            <button onClick = {() => {
                console.log('logout')
            }}
            className="cursor-pointer"
            >
                <img src = '/assets/icons/logout.svg' 
                alt = "logout" 
                className="size-6"
                />
            </button>
        </footer>
      </div>
    </section>
  )
}

export default NavItems
