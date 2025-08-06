import { ListCollapse } from "lucide-react";

const ListTopParticipants = () => {
  return (
    <>
        <div className="secondary-innerContainer border border-gray-300 rounded-2xl p-2">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                🏆 Top Participants This Week
            </h1>

                <div className="max-h-64 overflow-y-auto">
                  <ul className="list bg-base-100 rounded-box shadow-md">       
                    <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most active participants this week</li>
             
                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
                      <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/></div>
                      <div className="list-col-grow">
                        <div>Cris Dyford Bonghanoy</div>
                        <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <ListCollapse/>
                      </button>
                    </li>
                    
                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">02</div>
                      <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp"/></div>
                      <div className="list-col-grow">
                        <div>Darryl Gabito</div>
                        <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <ListCollapse/>
                      </button>
                    </li>
                    
                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">03</div>
                      <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp"/></div>
                      <div className="list-col-grow">
                        <div>Sean Allen Curaraton</div>
                        <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <ListCollapse/>
                      </button>
                    </li>

                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">04</div>
                      <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/3@94.webp"/></div>
                      <div className="list-col-grow">
                        <div>Daryl Jay Bueno</div>
                        <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <ListCollapse/>
                      </button>
                    </li>

                    <li className="list-row">
                      <div className="text-4xl font-thin opacity-30 tabular-nums">05</div>
                      <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/4@94.webp"/></div>
                      <div className="list-col-grow">
                        <div>Kent Amante</div>
                        <div className="text-xs uppercase font-semibold opacity-60">BSIT</div>
                      </div>
                      <button className="btn btn-square btn-ghost">
                        <ListCollapse/>
                      </button>
                    </li>
                  
                </ul>
            </div>
        </div>
    </>
  )
}

export default ListTopParticipants