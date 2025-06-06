import { asset } from '../../assets/asset'

const SideBar = () => {git 
  return (
    <>
        <div className="shadow-md border rounded-3xl w-[25rem] h-auto -mt-15 ml-2 bg-white">
            <div className="header m-4 flex items-center p-4">
                <img className='w-14' src={asset.logo} alt="UCLM CARES"/>
                <span className='font-bold px-4 text-[1.5rem] text-blue-800'>UCLM</span>
                <span className='font-bold text-[1.5rem] text-red-600'>CARES</span>
            </div>

            <div className="group-of-buttons border m-8 rounded-2xl shadow-md">
                <div className="inner-container flex justify-center border m-8 rounded-md bg-blue-950">
                    <button type='button' className='btn btn-primary px-24 py-12 text-[1.5rem] rounded-xl m-4'>JOIN NOW</button>
                </div>
            
                <div className="belowContainerButton grid grid-cols-3 gap-2 md:grid-cols-3 m-4">
                    <button type='button' className='btn'>Check</button>
                    <button type='button' className='btn'>Check</button>
                    <button type='button' className='btn'>Check</button>

                </div>
            </div>

            <div className="secondary-header">
                <h1 className='text-[1.5rem] ml-7'>Today Event</h1>
                <div className="inner-container-one border m-6 p-4 rounded-md">
                    Morning Event Schedule
                </div>

                <div className="inner-container-two border m-6 p-4 rounded-md">
                    Afternoon Event Schedule
                </div>
            </div>

        </div>
    </>
  )
}

export default SideBar