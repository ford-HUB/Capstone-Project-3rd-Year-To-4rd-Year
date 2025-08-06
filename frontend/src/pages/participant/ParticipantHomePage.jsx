import SidePanel from "../../components/participant/SidePanel";
import CurrentEvent from '../../components/participant/CurrentEvent.jsx'
import NextEventCarousel from "../../components/participant/NextEventCarousel";
import ParticipantUpcomingEvent from "../../components/participant/ParticipantUpcomingEvent";
import QuickStatsFooter from "../../components/participant/QuickStatsFooter";
import React from "react";
import { useEventStore } from "../../store/participant/useEventStore.js";

const ParticipantHomePage = () => {
  const { matchedEvents, getMatchEvent } = useEventStore()
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  
  React.useEffect(() => {
    let isMounted = true
    
    const fetchEvents = async () => {
      try {
        if (matchedEvents.length === 0) {
          const checkMatch = await getMatchEvent()
          if (!checkMatch && isMounted) {
            setError("Failed to fetch events")
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchEvents()

    return () => {
      isMounted = false
    }
  }, [getMatchEvent, matchedEvents])

  if (isLoading) return <div className="">loading...</div>
  if (error) return

  return (
    <div className="px-6 p-2 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4">
        <SidePanel/>
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-2/3 max-h-[600px] overflow-y-auto">
          <CurrentEvent matchedEvents={matchedEvents}/>
          <NextEventCarousel matchedEvents={matchedEvents}/>
          <ParticipantUpcomingEvent events={matchedEvents}/>
          <QuickStatsFooter/>
        </div>
      </div>
    </div>
  );
};

export default ParticipantHomePage;