// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import useURLPosition from "../hooks/useURLPosition";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

/* eslint-disable*/
function Form() {
  const { createCity, isLoading: isLoadingCreatingCity } = useCities();
  const [geoLat, geoLng] = useURLPosition();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
  const [errorGeoLocation, setErrorGeoLocation] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(
    function () {
      async function fetchCities() {
        if (!geoLat && !geoLng) return;

        try {
          setIsLoadingGeoLocation(true);
          setErrorGeoLocation("");
          const res = await fetch(
            `${BASE_URL}?latitude=${geoLat}&longitude=${geoLng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That's not a country. Please select another position 😉"
            );
          console.log(data);
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setErrorGeoLocation(err.message);
        } finally {
          setIsLoadingGeoLocation(false);
        }
      }
      fetchCities();
    },
    [geoLat, geoLng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: geoLat, lng: geoLng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  if (errorGeoLocation) return <Message message={errorGeoLocation} />;

  if (!geoLat && !geoLng)
    return <Message message="Start by clicking somewhere on the map." />;

  if (isLoadingGeoLocation) return <Spinner />;

  return (
    <form
      className={`${styles.form} ${
        isLoadingCreatingCity ? styles.loading : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
