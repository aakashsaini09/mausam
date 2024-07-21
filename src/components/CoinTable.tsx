import axios from "axios"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { currency } from "../store"
import { numberWithCommas } from "./Carousel"
import { createTheme, Pagination } from "@mui/material"
import { ThemeProvider } from '@mui/system';
import { useNavigate } from "react-router-dom"
const CoinTable = () => {
    const currentCurrency = useRecoilValue(currency)
    const history = useNavigate()
    useEffect(() => {
        GetCoins()
    }, [])
    interface allcoins{
        name: string,
        id: number,
        image: string,
        symbol: string,
        price_change_percentage_24h: number,
        current_price: string,
        market_cap: number
    }
    const [page, setpage] = useState(1)
    const [coins, setcoins] = useState<allcoins[]>([])
    console.log("Into the comp")
    const GetCoins= async()=>{
        console.log("Into the eff")
        const {data} = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currentCurrency}&order=gecko_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`)
        setcoins(data)
        console.log(data)
    }
    const theme = createTheme({
      palette: {
        background: {
          paper: '#fc0800',
        },
        text: {
          primary: '#FFFF00',
          secondary: '#fc0800',
        },
        primary: {
          main: "#fc0800"
        },
        action: {
          active: '#fc0800',
        }
      },
    });
    
   return (
     <div>
      <ThemeProvider theme={theme}>
        <div className="top">
            <h1 className="text-white text-4xl font-semibold text-center mt-5">Cryptocurrency Prices by Market Cap</h1>
        </div>
        <div className="w-full text-white flex justify-center items-center">
          <input type="text" className="bg-gray-950 border border-gray-700 text-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 mt-4 p-3 py-5 text-base md:p4 md:pl-5 w-[78vw] " placeholder="Search for a crypto currency..." />
        </div>
        <div className="w-full flex justify-center">
          <div className="relative overflow-x-auto shadow-md rounded-sm flex items-center justify-center mt-6">
                <table className="w-[78vw] text-sm text-left rtl:text-right text-gray-500 mx-6 font-bold ">
                  <thead className="text-base uppercase bg-yellow-400 text-gray-900 h-16">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Coins
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                              24h Change
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Market Cap
                          </th>
                      </tr>
                  </thead>
                  <tbody className="pt-5">

                    {coins.slice((page -1) * 10, (page -1) * 10 +10).map((coin) => {
                      const profit = coin.price_change_percentage_24h > 0;
                      // @ts-ignore
                      return <tr onClick={() => history.push(`/coins/${coin.id}`)} id={coin.id} className="text-white py-3 text-lg border-b border-gray-500 hover:bg-slate-900 cursor-pointer">
                          <th scope="row" className="px-2 py-4 gap-3 font-medium text-gray-100 whitespace-nowrap flex">
                              <img src={coin.image} className="w-20" alt="" /> <span className="text-gray-400 font-medium text-sm w-full my-auto"><span className="uppercase text-white text-base font-bold">{coin.symbol} </span><br/>{coin.name}</span>
                          </th>
                          <td className="px-6 py-4">
                              $ {coin.current_price}
                          </td>
                          <td className={`px-6 py-4 ${profit ? 'text-green-600': 'text-red-600'}`}>
                          {profit && "+"} {coin?.price_change_percentage_24h?.toFixed(2)}%
                          </td>
                          <td className="px-6 py-4">
                          {numberWithCommas(coin.market_cap).toString().slice(0, -6)}M
                          </td>
                      </tr>  })}
                  </tbody>
                </table>
          </div>
        </div>
        <div className="w-full h-auto py-1">
        <Pagination size="large" color={"standard"} sx={{color: 'text.secondary'}} className="my-5 flex justify-center text-center" count={Number((coins.length/10).toFixed(0))} onChange={(_, value) => { setpage(value); window.scroll(0, 450)}}/>
        </div>
    </ThemeProvider>
    </div>
  )
}

export default CoinTable
