import { asset } from '../../assets/asset';

const GuestHome = () => {
  return (
    <div className="homeContainer flex h-screen w-screen fixed overflow-visible">
      {/* Background Image */}
      <div className="backgroundContainer fixed inset-0">
        <img
          src={asset.backgroundV2}
          alt="UCLM Cover"
          className="object-cover h-full w-full opacity-60"
        />
      </div>

      {/* Content Section */}
      <div className="content flex justify-between items-center w-full h-full relative px-16">
        {/* Left Content */}
        <div className="leftContent relative text-left max-w-2xl flex-shrink-0">
          <h1 className="text-[52px] font-bold leading-snug text-gray-800 drop-shadow-md">
            Welcome to <span className="text-blue-500">UCLM</span> Community Awareness,
            Relations and Extension Services
            <span className="inline-flex items-center px-2">
              <img className="w-16 h-16" src={asset.uclmLogo} alt="UCLM Logo" />
            </span>
            <span className="inline-flex items-center">
              <img className="w-16 h-16" src={asset.logo} alt="UC CARES Logo" />
            </span>
          </h1>
        </div>

        {/* Right Content */}
        <div className="rightContent relative px-8 flex justify-center items-center">
          <div className="containerImage p-6 bg-white drop-shadow-md flex justify-center items-center rounded-md">
            <img
              src={asset.groupImage}
              alt="Group"
              className="rounded-md max-h-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHome;
