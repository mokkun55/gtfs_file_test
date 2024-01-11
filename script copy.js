window.onload = function() {
    let fileContent; // ファイルの内容を保存するための変数を定義します
    let txtfile = `trips.txt`
    fetch(txtfile)
        .then(response => response.text())
        .then(data => {
            document.getElementById('fileContent').textContent = data;
            fileContent = data; // ファイルの内容を変数に代入します

            let cleanedData = data.replace(/"/g, '');
            document.getElementById('fileContent').textContent = cleanedData;

            let lines = cleanedData.split('\n'); // テキストを行ごとに分割します
            let tripid = []; // 保存するための配列を作成します
            for (let line of lines) {
                let [route_id,service_id,trip_id,trip_headsign,trip_short_name,direction_id,block_id,shape_id,jp_trip_desc,jp_trip_desc_symbol,jp_office_id,wheelchair_accessible] = line.split(','); // 各行をカンマで分割します
                if (service_id === '5_1_20231101') { // の場合
                    tripid.push(trip_id); // 配列にarrival_timeを追加します
                    
                }

                
            }
            tripid.sort(); // 配列をソートします
            for (let tripid_sote of tripid) {
                console.log(tripid_sote); // ソートされた時間を出力します
            }

            // console.log(tripid)
        })
        .catch(error => console.error('エラー:', error));
};
