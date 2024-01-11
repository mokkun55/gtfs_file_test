window.onload = function() {
    let fileContent; // ファイルの内容を保存するための変数を定義します
    let txtfile = `stop_times.txt`
    fetch(txtfile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('fileContent').textContent = data;
            fileContent = data; // ファイルの内容を変数に代入します

            let cleanedData = data.replace(/"/g, '');
            document.getElementById('fileContent').textContent = cleanedData;

            let lines = cleanedData.split('\n'); // テキストを行ごとに分割します
            let times = []; // arrival_timeを保存するための配列を作成します
            for (let line of lines) {
                let [trip_id,arrival_time,departure_time,stop_id,stop_sequence,stop_headsign,pickup_type,drop_off_type,shape_dist_traveled] = line.split(','); // 各行をカンマで分割します
                if (stop_id === '5736_1') { // の場合
                    times.push(arrival_time); // 配列にarrival_timeを追加します
                }

                
            }
            times.sort(); // 配列をソートします
            for (let time of times) {
                console.log(time); // ソートされた時間を出力します
            }
        })
        .catch(error => console.error('エラー:', error));
};
