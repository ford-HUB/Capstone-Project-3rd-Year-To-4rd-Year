import { Home, Users, Bell, Calendar, PanelRightDashed, } from "lucide-react";
import LeftCard from "./LeftCard";
import { asset } from "../../assets/asset";

const SidePanel = () => {
  const contacts = [
    { id: 1, name: "UCLM", img: asset.uclmLogo, active: true },
  ];

  return (
    <>
        <aside className="w-12 bg-gray-50 mr-3 flex flex-col items-center">
        <div className="space-y-4">
            <button className="p-2 rounded-xl hover:bg-gray-200">
            <a href="">
                <Home size={25} />
                </a>
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-200">
                <a href="">
                    <Users size={25} />
                </a>
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-200 relative">
                <a href="">
                    <Bell size={25} />
                </a>
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-200">
                <a href="">
                    <Calendar size={25} />
                </a>
            </button>
        </div>

        <div className="my-4 w-6 border-t border-gray-300" />
        <div className="flex-1 overflow-y-auto space-y-3">
            {contacts.map((contact) => (
            <div key={contact.id} className="relative">
                <img
                src={contact.img}
                alt={contact.name}
                className="w-10 h-10 rounded-xl mx-auto cursor-pointer"
                />
                {contact.active && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full border-2 border-white" />
                )}
            </div>
            ))}
        </div>

        {/* Bottom Icon */}
        <div className="mt-4">
            <button className="p-2 rounded-xl hover:bg-gray-200">
            <PanelRightDashed size={25} />
            </button>
        </div>
        </aside>
        <LeftCard/>

    </>
  );
}

export default SidePanel
