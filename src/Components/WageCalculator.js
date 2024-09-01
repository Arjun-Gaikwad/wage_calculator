import React, { useState } from 'react';
import '../Styles/WageCalculator.css'

// Function to calculate earnings based on the time and rate
function calculateEarnings(startTime, endTime, rates) {
    let totalEarnings = 0;

    for (let hour = startTime; hour < endTime; hour++) {
        if (hour >= 9 && hour < 17) {  // Regular hours
            totalEarnings += rates.regular;
        } else if (hour >= 17 && hour < 22) {  // Nighttime hours
            totalEarnings += rates.nighttime;
        } else {  // Midnight hours
            totalEarnings += rates.midnight;
        }
    }

    return totalEarnings;
}

function WageCalculator() {
    const [rates, setRates] = useState({ regular: '', nighttime: '', midnight: '' });
    const [daysWorked, setDaysWorked] = useState(0);
    const [times, setTimes] = useState([]);
    const [totalSalary, setTotalSalary] = useState(null);
    const [error, setError] = useState(null);

    const handleRateChange = (e) => {
        const value = parseInt(e.target.value, 10);
        const name = e.target.name;

        if (value < 0 || value > 3000) {
            setError(`Invalid value for ${name}. It must be between 0 and 3000.`);
        } else if (isNaN(value)) {
            setError(null);
            setRates({ ...rates, [name]: 0 });
        } else {
            setError(null);
            setRates({ ...rates, [name]: value });
        }
    };

    const handleDaysChange = (e) => {
        let days = parseInt(e.target.value, 10);

        if (isNaN(days) || days < 1 || days > 100) {
            setError("Number of days (N) must be between 1 and 100.");
            setDaysWorked(0);
            setTimes([]);
        } else {
            setError(null);
            setDaysWorked(days);
            // Initialize start and end times for each day
            const initialTimes = Array(days).fill({ startTime: '', endTime: '' });
            setTimes(initialTimes);
        }
    };

    const handleTimeChange = (index, type, value) => {
        const updatedTimes = times.map((time, i) =>
            i === index ? { ...time, [type]: value } : time
        );
        setTimes(updatedTimes);
    };

    const handleCalculate = () => {
        let total = 0;

        for (const { startTime, endTime } of times) {
            const start = parseInt(startTime, 10);
            const end = parseInt(endTime, 10);

            if (isNaN(start) || isNaN(end) || start < 0 || start >= 23 || end <= start || end > 23) {
                setError("Invalid start or end time. Ensure 0 ≦ S < T ≦ 23.");
                return;
            }

            total += calculateEarnings(start, end, {
                regular: parseInt(rates.regular, 10),
                nighttime: parseInt(rates.nighttime, 10),
                midnight: parseInt(rates.midnight, 10),
            });
        }

        setError(null);
        if (isNaN(total)) {
            setTotalSalary(0);
        } else {
            setTotalSalary(total);
        }
        
    };

    return (
        <div className='wage-calculator-div'>
            <h1>Wage Calculator</h1>

            <div>
                <label>Regular Rate (X): </label>
                <input
                    type="number"
                    name="regular"
                    value={rates.regular}
                    onChange={handleRateChange}
                    min="0"
                    max="3000"
                />
            </div>

            <div>
                <label>Nighttime Rate (Y): </label>
                <input
                    type="number"
                    name="nighttime"
                    value={rates.nighttime}
                    onChange={handleRateChange}
                    min="0"
                    max="3000"
                />
            </div>

            <div>
                <label>Midnight Rate (Z): </label>
                <input
                    type="number"
                    name="midnight"
                    value={rates.midnight}
                    onChange={handleRateChange}
                    min="0"
                    max="3000"
                />
            </div>

            <div>
                <label>Number of Days: </label>
                <input
                    type="number"
                    value={daysWorked}
                    onChange={handleDaysChange}
                    min="1"
                    max="100"
                />
            </div>

            {Array.from({ length: daysWorked }, (_, index) => (
                <div key={index}>
                    <h4>Day {index + 1}</h4>
                    <div>
                        <label>Start Time: </label>
                        <input
                            type="number"
                            value={times[index]?.startTime || ''}
                            onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                            min="0"
                            max="22"
                        />
                    </div>
                    <div>
                        <label>End Time: </label>
                        <input
                            type="number"
                            value={times[index]?.endTime || ''}
                            onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                            min="1"
                            max="23"
                        />
                    </div>
                </div>
            ))}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <br />
            <button onClick={handleCalculate}>Calculate Total Salary</button>
            {totalSalary !== null && !error && <h2>Total Salary: {totalSalary} yen</h2>}
        </div>
    );
}

export default WageCalculator;
