import SidePanel from "../../components/participant/SidePanel";
import RightCard from "../../components/participant/RightCard";


const ParticipantHomePage = () => {
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4">
        <SidePanel/>

        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-2/3 max-h-[600px] overflow-y-auto">
          <RightCard />
        </div>
      </div>
    </div>
  );
};

export default ParticipantHomePage;
