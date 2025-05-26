import CurrentEvent from "./CurrentEvent";
import NextEventCarousel from "./NextEventCarousel";
import ParticipantUpcomingEvent from "./ParticipantUpcomingEvent";
import QuickStatsFooter from "./QuickStatsFooter";

const RightCard = () => {

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">      
      <CurrentEvent />
      <NextEventCarousel />
      <ParticipantUpcomingEvent/>
      <QuickStatsFooter/>
    </div>
  );
};

export default RightCard;