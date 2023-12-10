import Spinner from "../components/Spinner";
import Message from "../components/Message";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";

/* eslint-disable react/prop-types */

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message="Add your first city" />;

  const countries = cities.reduce((accArr, currCity) => {
    console.log(accArr, currCity);
    if (!accArr.map((el) => el.country).includes(currCity.country)) {
      return [...accArr, { country: currCity.country, emoji: currCity.emoji }];
    } else {
      return accArr;
    }
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
