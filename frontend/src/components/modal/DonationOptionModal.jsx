import { HandCoins, X } from 'lucide-react'
import React from 'react'

const DonationOptionModal = ({ event, open, setOpen, onConfirm }) => {
    const [checkedFunds, setCheckedFunds] = React.useState(false)
    const [checkedGoods, setCheckedGoods] = React.useState(false)

    const handleSelectAll = () => {
        const shouldCheckAll = !(checkedFunds && checkedGoods)
        setCheckedFunds(shouldCheckAll)
        setCheckedGoods(shouldCheckAll)
    }

    React.useEffect(() => {
        if(open) {
            setCheckedFunds(event.funds)
            setCheckedGoods(event.goods)
        }
    }, [open])

    if(!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white flex flex-col rounded-lg p-4 w-full max-w-md mx-4">
                <div className='flex justify-between items-center my-4'>
                    <div className='inline-flex space-x-3'>
                        <HandCoins/>
                        <h1 className='font-semibold text-xl'>Type Donation</h1>
                    </div>

                    <div className='flex justify-end items-center'>
                        <label htmlFor="select all">Select All
                            <input onClick={handleSelectAll}
                            type="checkbox" className='checkbox h-5 w-5 mx-3'/>
                        </label>
                    </div>
                </div>

                <div className='mt-4'>
                    <div className='flex flex-col space-y-2'>
                        <button
                        onClick={() => setCheckedFunds(!checkedFunds)}
                        className={`flex items-center w-full gap-2 px-4 py-2 border rounded-xl cursor-pointer transition 
                            ${checkedFunds ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'}
                        `}
                        >
                        <input
                            className='checkbox hidden'
                            type="checkbox"
                            checked={checkedFunds}
                            onChange={() => setCheckedFunds(!checkedFunds)}
                        />
                        { checkedFunds ? 'Donation Funds Activated': 'Activate Funds Donation' }
                        </button>

                        <button onClick={() => setCheckedGoods(!checkedGoods)}
                        className={`flex items-center w-full gap-2 px-4 py-2 border rounded-xl cursor-pointer transition 
                            ${checkedGoods ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border-gray-300'}
                        `}
                        >
                        <input
                            className='checkbox hidden'
                            type="checkbox"
                            checked={checkedGoods}
                            onChange={() => setCheckedGoods(!checkedGoods)}
                        />
                        { checkedGoods ? 'Donation Goods Activated': 'Activate Goods Donation' }
                        </button>

                        <div className='inline-flex justify-between items-center'>
                            <span className='text-gray-600 text-xs'>Please choose the donation you open</span>
                            <div className='space-x-3'>
                                <button onClick={() => setOpen(false)}
                                className='border transition-colors duration-300 border-gray-300 hover:bg-blue-600 hover:text-white px-3 rounded-md'>Back</button>
                        
                                <button
                                onClick={() => onConfirm({ funds: checkedFunds, goods: checkedGoods })}
                                className={`hover:bg-blue-600 hover:text-white border transition-colors duration-300 border-gray-300  px-3 rounded-md`}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonationOptionModal