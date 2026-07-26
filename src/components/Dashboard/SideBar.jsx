import { ThemeToggle } from "../../utils/ThemeToggle";
import logo from "/public/logo.jpg";
import { Logo } from "../ui/Logo";
import { dashboardLinks } from "../../data/data";
import { Link, NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
const Sidebar = () => {
  return (
    <nav className="w-full min-w-75  h-screen flex flex-col   bg-primary  px-4 py-6 ">
      <div className=" flex justify-center items-center gap-8  border-b-2 border-b-text pb-10 pt-10 ">
        <img src={logo} alt="" className="size-16 rounded-full " />
       <Link to={"/"}>
       <Logo /> 
       </Link> 
      </div>
      <div className="">
        <ul className="py-10 flex flex-col gap-1">
            {dashboardLinks.map((link) => (
                <li key={link.name} className="w-full">
                    <NavLink to={link.path} className={ ({isActive})=> cn("flex items-center gap-2 px-3 py-4 rounded-3xl text-text hover:text-accent transition-colors",  isActive ? "bg-card" : "")}>
                        <span className="text-2xl"><link.icon/></span>
                        <span className="text-lg font-medium">{link.name}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
      </div>
    </nav>
  );
};
export default Sidebar;
