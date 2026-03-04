import SliderHome from "./SliderHome";
import { fetchSliders } from "../lib/server-api";

export default async function SliderServer() {
  const slidersData = await fetchSliders();

  return <SliderHome initialSliders={slidersData} />;
}
