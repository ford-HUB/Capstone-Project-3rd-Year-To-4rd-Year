import React from 'react'
import { asset } from '../../assets/asset'

const Home = () => {
    return (
        <>
            <div className="homeContainer flex h-screen w-screen fixed overflow-visible">
                {/* Background Image */}
                <div className="backgroundContainer fixed inset-0">
                    <img src={asset.backgroundV2} alt="UCLM Cover"
                        className="bg-no-repeat bg-cover h-full w-full opacity-60" />
                </div>

                {/* Content Section */}
                <div className="content flex justify-between items-center w-full h-full relative px-16">
                    {/* Left Content */}
                    <div className="leftContent relative text-left max-w-lg">
                        <h1 className="text-[52px] font-bold leading-tight">
                            Welcome To <span className='text-blue-600'>UCLM</span> Community Awareness, Relations and Extension Services
                            <span className='inline-flex px-4'><img className='w-18 h-18' src={asset.uclmLogo} alt="UCLM LOGO" /></span>
                            <span className='inline-flex'><img className='w-18 h-18' src={asset.logo} alt="UC CARES LOGO" /></span>
                        </h1>
                    </div>

                    {/* Right Content */}
                    <div className="rightContent relative px-8 flex justify-center items-center">
                        <div className="containerImage p-6 bg-white drop-shadow-md flex justify-center items-center rounded-md">
                            <img src={asset.groupImage} alt='group-image'
                                className='rounded-md'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
