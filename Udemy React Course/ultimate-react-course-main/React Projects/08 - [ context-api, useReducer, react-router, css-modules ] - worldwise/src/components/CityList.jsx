import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
    const { cities, isLoading } = useCities();
    if (isLoading) {
        return <Spinner />;
    }
    if (!cities.length)
        return (
            <Message message="Add you first city by clicking on a city on the map" />
        );
    return (
        <ul className={styles.cityList}>
            {cities.map(function (city) {
                return <CityItem city={city} key={city.id} />;
            })}
        </ul>
    );
}

export default CityList;
