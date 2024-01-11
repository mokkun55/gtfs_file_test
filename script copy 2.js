window.onload = function() {
    let fileContent; // ファイルの内容を保存するための変数を定義します
    let txtfile = `trips.txt`
    let youbi = `5_1_20231101` //←平日パターン
    fetch(txtfile)
        .then(response => response.text())
        .then(data => {
            let cleanedData = data.replace(/"/g, '');
            let lines = cleanedData.split('\n'); // テキストを行ごとに分割します
            let tripid = []; // 保存するための配列を作成します
            for (let line of lines) {
                let [route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id,jp_trip_desc,jp_trip_desc_symbol,jp_office_id,wheelchair_accessible] = line.split(','); // 各行をカンマで分割します
                if (service_id === youbi) { // の場合
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
                    arrivalTimes.sort(); // 配列をソートします
                    for (let arrivalTime of arrivalTimes) {
                        console.log(arrivalTime); // ソートされた時間を出力します
                    }
                })
                .catch(error => console.error('エラー:', error));
        })
        .catch(error => console.error('エラー:', error));
};
