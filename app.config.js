import 'dotenv/config';

export default {
  expo: {
    name: "WeatherApp",
    slug: "weatherapp",
    version: "1.0.0",
    extra: {
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    },
  },
};