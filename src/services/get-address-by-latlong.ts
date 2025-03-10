import axios from "axios";

export const getAddressByLatLong = async (lat: number, lon: number) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await axios.get<{ display_name: string }>(url, {
      headers: { "User-Agent": "AddressRetriever/1.0" },
    });

    if (response.data?.display_name) {
      return response.data.display_name;
    } else {
      throw new Error("No address found");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};
