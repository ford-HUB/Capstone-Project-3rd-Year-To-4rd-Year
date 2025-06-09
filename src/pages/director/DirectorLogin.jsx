import React from 'react'
import OptionModal from '../../components/modal/OptionModal'
import { asset } from '../../assets/asset'
import { useNavigate } from 'react-router-dom'

const DirectorLogin = () => {
    // form state
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [rememberMe, setRememberMe] = React.useState(false)
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
            {/* Subtle geometric accent */}
            <div className="absolute -top-24 -left-24 w-100 h-96 bg-blue-100 rounded-full opacity-30 z-0" />
            <div className="absolute bottom-0 right-0 w-100 h-80 bg-blue-200 rounded-full opacity-20 z-0" />
            <div className="relative z-10 flex flex-col items-center w-full max-w-md -top-4">
                <img src={asset.transparentLogo} alt="Director Logo" className="h-30 w-30 rounded-full object-cover shadow-lg mb-4 bg-white p-2" />
                <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-95 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Director Login</h1>
                    <p className="text-gray-500 text-sm mb-6 text-center">Sign in to your director account</p>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-700"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ID number or Email"
                        />
                        <input
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-gray-700"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <div className="flex justify-between items-center text-xs">
                            <label className="flex items-center gap-1">
                                <input type="checkbox" className="accent-blue-600" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                                Remember me
                            </label>
                            <button type="button" className="text-blue-600 hover:underline" onClick={() => {}}>Forgot password?</button>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-2 transition-colors mt-2" type="submit">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default DirectorLogin 