import sunny from '../assets/images/sunny.png';
import cloudy from '../assets/images/cloudy.png';
import rainy from '../assets/images/rainy.png';
import snowy from '../assets/images/snowy.png';
import loadingGif from '../assets/images/loading.gif';
import { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const api_key = '0857bdfbf9822bcb5f4d0f481d5e160a';

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoading(true);
      const defaultLocation = 'Gurgaon';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
      setLoading(false);
    };

    fetchDefaultWeather();
  }, []);

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const search = async () => {
    if (location.trim() !== '') {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const searchData = await res.json();
      if (searchData.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(searchData);
        setLocation('');
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
  };

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

  const backgroundImages = {
    Clear: 'bg-gradient-to-r from-[#f3b07c] to-[#fcd283]',
    Clouds: 'bg-gradient-to-r from-[#57d6d4] to-[#71eeec]',
    Rain: 'bg-gradient-to-r from-[#5bc8fb] to-[#80eaff]',
    Snow: 'bg-gradient-to-r from-[#aff2ff] to-[#ffffff]',
    Haze: 'bg-gradient-to-r from-[#57d6d4] to-[#71eeec]',
    Mist: 'bg-gradient-to-r from-[#57d6d4] to-[#71eeec]',
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : 'bg-gradient-to-r from-[#f3b07c] to-[#fcd283]';

  const currentDate = new Date();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();

  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className={`w-full h-screen ${backgroundImage} flex justify-center items-center overflow-hidden`}>
      <div className={`w-[35rem] h-[65rem] bg-gradient-to-t from-[#f3b07c] to-[#fcd283] rounded-3xl flex flex-col items-center p-8 shadow-2xl relative`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <i className="fa-solid fa-location-dot text-4xl text-[#2f2e57]"></i>
            <div className="text-2xl text-[#484569] tracking-wide">{data.name}</div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-[25rem] h-[3.5rem] bg-transparent border-2 border-[#676394] rounded-full outline-none p-4 pr-12 text-2xl text-[#484569] placeholder:text-xl placeholder:text-[#676394] placeholder:tracking-wide focus:placeholder:text-transparent"
            />
            <i className="fa-solid fa-magnifying-glass absolute top-1/2 transform -translate-y-1/2 right-6 text-2xl text-[#2f2e57] cursor-pointer" onClick={search}></i>
          </div>
        </div>
        {loading ? (
          <img className="w-20 mt-40" src={loadingGif} alt="loading" />
        ) : data.notFound ? (
          <div className="text-6xl text-[#484569] mt-20 shadow-lg">Not Found </div>
        ) : (
          <>
            <div className="weather">
              <img className="mt-[9rem] h-[250px] w-[600px]" src={weatherImage} alt="weather" />
              <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 text-2xl text-[#484569]">
                {data.weather ? data.weather[0].main : null}
              </div>
              <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 text-9xl bg-gradient-to-r from-[#2f2e57] to-[#605d80] bg-clip-text text-transparent shadow-lg">
                {data.main ? `${Math.floor(data.main.temp)}°` : null}
              </div>
            </div>
            <div className="absolute bottom-[22%] text-2xl text-[#484569]">
              <p>{formattedDate}</p>
            </div>
            <div className="absolute bottom-8 w-full flex gap-8 px-8">
              <div className="flex-1 flex flex-col items-center gap-6 bg-white/20 p-4 rounded-xl">
                <div className="text-2xl text-[#605d80]">Humidity</div>
                <i className="fa-solid fa-droplet text-4xl text-white shadow-lg"></i>
                <div className="text-4xl text-[#2f2e57]">
                  {data.main ? data.main.humidity : null}%
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-6 bg-white/20 p-4 rounded-xl">
                <div className="text-2xl text-[#605d80]">Wind</div>
                <i className="fa-solid fa-wind text-4xl text-white shadow-lg"></i>
                <div className="text-4xl text-[#2f2e57]">
                  {data.wind ? data.wind.speed : null} km/h
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
