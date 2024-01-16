window.onload = function () {
    let fileContent;
    let txtfile = `trips.txt`
    let heijitu = `5_1_20231101`

    fetch(txtfile)
        .then(response => response.text())
        .then(data => {
            let cleanedData = data.replace(/"/g, '');
            let lines = cleanedData.split('\n');
            let tripid = [];
            for (let line of lines) {
                let [route_id, service_id, trip_id, trip_headsign, trip_short_name, direction_id, block_id, shape_id, jp_trip_desc, jp_trip_desc_symbol, jp_office_id, wheelchair_accessible] = line.split(',');
                if (service_id === heijitu) {
                    tripid.push(trip_id);
                }
            }
            tripid.sort();
            return tripid;
        })
        .then(tripid => {
            let txtfile = `stop_times.txt`
            fetch(txtfile)
                .then(response => response.text())
                .then(data => {
                    let cleanedData = data.replace(/"/g, '');
                    let lines = cleanedData.split('\n');
                    let arrivalTimes = [];
                    for (let line of lines) {
                        let [trip_id, arrival_time, departure_time, stop_id, stop_sequence, stop_headsign, pickup_type, drop_off_type, shape_dist_traveled] = line.split(',');
                        if (tripid.includes(trip_id) && stop_id === '5736_1') {
                            arrivalTimes.push(arrival_time);
                        }
                    }

                    console.log(arrivalTimes)

                    const times = arrivalTimes;
                    const now = new Date();
                    const nowInSeconds = timeToSeconds(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);

                    const [closestFutureTime, secondClosestTime] = findClosestFutureTimes(times, nowInSeconds);

                    if (closestFutureTime !== null) {
                        document.getElementById('closestTime').textContent = formatTime(closestFutureTime);
                    } else {
                        document.getElementById('closestTime').textContent = 'バスは終了';
                    }

                    if (secondClosestTime !== null) {
                        document.getElementById('secondClosestTime').textContent = formatTime(secondClosestTime);
                    } else {
                        document.getElementById('secondClosestTime').textContent = 'バスは終了';
                    }

                    setInterval(function () {
                        const [closestFutureTime, secondClosestTime] = findClosestFutureTimes(times, nowInSeconds);

                        if (closestFutureTime !== null) {
                            document.getElementById('closestTime').textContent = formatTime(closestFutureTime);
                            document.getElementById('secondClosestTime').textContent = formatTime(secondClosestTime);
                        } else {
                            document.getElementById('closestTime').textContent = 'バスは終了';
                            document.getElementById('secondClosestTime').textContent = 'バスは終了';
                        }

                        now.setTime(now.getTime() + 1000);
                        document.getElementById('currentTime').textContent = formatTime(`${now.getHours()}:${now.getMinutes()}`);
                    }, 1000);
                })
                .catch(error => console.error('エラー:', error));
        })
        .catch(error => console.error('エラー:', error));

    function timeToSeconds(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    function findClosestFutureTimes(timeArray, nowInSeconds) {
        let closestTime = null;
        let secondClosestTime = null;
        let smallestDifference = null;
        let secondSmallestDifference = null;
        for (let i = 0; i < timeArray.length; i++) {
            const timeInSeconds = timeToSeconds(timeArray[i]);
            if (timeInSeconds > nowInSeconds) {
                const difference = timeInSeconds - nowInSeconds;
                if (smallestDifference === null || difference < smallestDifference) {
                    secondSmallestDifference = smallestDifference;
                    secondClosestTime = closestTime;
                    smallestDifference = difference;
                    closestTime = timeArray[i];
                } else if (secondSmallestDifference === null || difference < secondSmallestDifference) {
                    secondSmallestDifference = difference;
                    secondClosestTime = timeArray[i];
                }
            }
        }

        if (closestTime !== null) {
            closestTime = closestTime.substring(0, closestTime.lastIndexOf(":"));
        }

        if (secondClosestTime !== null) {
            secondClosestTime = secondClosestTime.substring(0, secondClosestTime.lastIndexOf(":"));
        }

        return [closestTime, secondClosestTime];
    }

    function formatTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${formattedHours}:${formattedMinutes}`;
    }
}
