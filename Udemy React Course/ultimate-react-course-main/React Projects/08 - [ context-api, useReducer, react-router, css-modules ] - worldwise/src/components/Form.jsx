// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
    const [cityName, setCityName] = useState("");
    const [countryName, setCountryName] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [lat, lng] = useUrlPosition();
    const [isLoading, setIsLoading] = useState(false);
    const [emoji, setEmoji] = useState("");
    const [geoCodingError, setGeoCodingError] = useState("");
    const { createCity, isLoading: isSubmitting } = useCities();
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!lat && !lng) return;
            async function fetchCityData() {
                try {
                    setIsLoading(true);
                    setGeoCodingError("");
                    const res = await fetch(
                        `${BASE_URL}?latitude=${lat}&longitude=${lng}`
                    );
                    const data = await res.json();

                    if (!data.countryCode)
                        throw new Error(
                            "That doesn't seem to be a city. Click somewhere else 🤨"
                        );

                    setCityName(data.city || data.locality || "");
                    setCountryName(data.countryName);
                    setNotes(`This is all about ${data.city}`);
                    setEmoji(convertToEmoji(data.countryCode));
                } catch (error) {
                    setGeoCodingError(error.message);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchCityData();
        },
        [lat, lng]
    );

    async function handleSubmit(e) {
        e.preventDefault();

        if (!cityName || !date) return;
        const newCity = {
            cityName: cityName,
            country: countryName,
            emoji: emoji,
            date: date,
            notes: notes,
            position: { lat, lng },
        };
        await createCity(newCity);
        navigate("/app/cities");
    }

    if (isLoading) return <Spinner />;
    if (geoCodingError) return <Message message={geoCodingError} />;
    if (!lat && !lng)
        return <Message message="Start by clicking somewhere in the map" />;

    return (
        <form
            className={`${styles.form} ${
                isSubmitting ? styles.submitting : ""
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
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">
                    Notes about your trip to {cityName}
                </label>
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