import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { TrendingCoins } from "../../config/api";
import { useCrypto } from "../../context/CurrencyContext.jsx";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = useCrypto();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
    }
  };

  console.log(trending);
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link
        to={`/coins/${coin.id}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          textTransform: "uppercase",
          color: "white",
        }}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span
          style={{
            color: profit > 0 ? "rgb(14,203,129)" : "red",
            fontWeight: 500,
          }}
        >
          {coin?.symbol}
          &nbsp;
          <span>
            {profit && "+"}
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <Box sx={{ height: "50%", display: "flex", alignItems: "center" }}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000} //1000 mili sec = 1 sec
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </Box>
  );
};

export default Carousel;
