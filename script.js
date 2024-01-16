window.onload = function() {
    let fileContent; // ファイルの内容を保存するための変数を定義します
    let txtfile = `trips.txt`
    let heijitu = `5_1_20231101` //←平日パターン

    fetch(txtfile)
        .then(response => response.text())
        .then(data => {
            let cleanedData = data.replace(/"/g, '');
            let lines = cleanedData.split('\n'); // テキストを行ごとに分割します
            let tripid = []; // 保存するための配列を作成します
            for (let line of lines) {
                let [route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id,jp_trip_desc,jp_trip_desc_symbol,jp_office_id,wheelchair_accessible] = line.split(','); // 各行をカンマで分割します
                if (service_id === heijitu) { // の場合
                    tripid.push(trip_id); // 配列にarrival_timeを追加します
                }
            }
            tripid.sort(); // 配列をソートします
            return tripid;
        })
        .then(tripid => {
            let txtfile = `stop_times.txt`
            fetch(txtfile)
                .then(response => response.text())
                .then(data => {
                    let cleanedData = data.replace(/"/g, '');
                    let lines = cleanedData.split('\n'); // テキストを行ごとに分割します
                    let arrivalTimes = []; // 保存するための配列を作成します
                    for (let line of lines) {
                        let [trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled] = line.split(','); // 各行をカンマで分割します
                        if (tripid.includes(trip_id) && stop_id === '5736_1') { // の場合
                            arrivalTimes.push(arrival_time); // 配列にarrival_timeを追加します
                        }
                    }

                    console.log(arrivalTimes)

                    // 配列内の時間
                    const times = arrivalTimes

                    // 最も近い未来のバスの時刻と次の次のバスの時刻を見つけて表示
                    const [closestFutureTime, secondClosestTime] = findClosestFutureTimes(times);
                    document.getElementById('closestTime').textContent = closestFutureTime;
                    document.getElementById('secondClosestTime').textContent = secondClosestTime;

                    // 1秒ごとに時間を更新する
                    setInterval(function() {
                        // 最も近い未来のバスの時刻と次の次のバスの時刻を見つけて表示
                        const [closestFutureTime, secondClosestTime] = findClosestFutureTimes(times);
                        document.getElementById('closestTime').textContent = closestFutureTime;
                        document.getElementById('secondClosestTime').textContent = secondClosestTime;

                        // 現在の時間を表示
                        const now = new Date();
                        document.getElementById('currentTime').textContent = `${now.getHours()}:${now.getMinutes()}`;
                    }, 1000); // 1000ミリ秒（1秒）ごとに更新
                })
                .catch(error => console.error('エラー:', error));
        })
        .catch(error => console.error('エラー:', error));

    // 時間を秒に変換する関数
    function timeToSeconds(time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    }

    // 現在の時間と配列内の時間との差を計算し、最も近い未来のバスの時刻と次の次のバスの時刻を見つける関数
    function findClosestFutureTimes(timeArray) {
        const now = new Date();
        const nowInSeconds = timeToSeconds(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
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

        // closestTimeおよびsecondClosestTimeがnullでないことを確認してからsubstringメソッドを適用
        if (closestTime !== null) {
            closestTime = closestTime.substring(0, closestTime.lastIndexOf(":"));
        }

        if (secondClosestTime !== null) {
            secondClosestTime = secondClosestTime.substring(0, secondClosestTime.lastIndexOf(":"));
        }

        return [closestTime, secondClosestTime];
    }
}
