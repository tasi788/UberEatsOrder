const url = 'https://myprivacy.uber.com/privacy/api/getRiderTrips?localeCode=zh-TW'

async function fetchRide(cursor = null) {
    const data = {limit: 40, cursor: cursor}
    const payload = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'x-csrf-token': 'x'},
        body: JSON.stringify(data)
    }
    const resp = await fetch(url, payload)
    return await resp.json()
}

(async () => {
    let cursor = null
    let total = 0
    let oldest = null
    let distance = 0
    let awkward = {}
    while (true) {
        const result = await fetchRide(cursor)
        cursor = result.data.next
        let trips = await result.data.dataPage.trips
        for (const trip of trips) {
            if (trip.status === 'COMPLETED') {
                oldest = trips[trips.length - 1].requestTime

                distance += trip.distance
                if (trip.currencyCode === "TWD") {
                    total += trip.fare
                } else {
                    if (isNaN(awkward[trip.currencyCode])) {
                        awkward[trip.currencyCode] = 0
                    }
                    awkward[trip.currencyCode] += trip.fare
                }
            }
        }
        console.log('讀取中...')
        console.log('目前總金額：', Math.round(total))
        if (result.data.next === null) {
            break
        }

    }

    console.log('自從 ', new Date(oldest).toLocaleString())
    console.log('Uber 的總消費金額 ➡️', total)
    console.log('Uber 的外幣消費金額（未加總於上方金額） ➡️\n', JSON.stringify(awkward))
    console.log('🚗 總移動距離：', distance)
})()