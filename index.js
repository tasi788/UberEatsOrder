const url = 'https://myprivacy.uber.com/privacy/api/getEatsOrders?localeCode=en-US'

async function fetchOrder(uuid = null) {
    const data = {limit: 40, lastWorkflowUuid: uuid}
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
    let lastWorkflowUuid = null
    let total = 0
    let oldest = null
    let awkward = {};
    while (true) {
        const result = await fetchOrder(lastWorkflowUuid)
        if (result.data.orders.length === 0) {
            break
        }
        lastWorkflowUuid = result.data.orders[result.data.orders.length - 1].uuid
        oldest = result.data.orders[result.data.orders.length - 1].completionTime
        for (const order of result.data.orders) {
            if (order.currencyCode === "TWD") {
                total += order.fare
            } else {
                if (isNaN(awkward[order.currencyCode])) {
                        awkward[order.currencyCode] = 0
                    }
                    awkward[order.currencyCode] += order.fare
            }
        }
        console.log('讀取中...')
        console.log('目前總金額：', total)

    }

    console.log('自從 ', new Date(oldest).toLocaleString())
    console.log('UberEats 的總消費金額 ➡️', total)
    console.log('Uber 的外幣消費金額（未加總於上方金額） ➡️\n', JSON.stringify(awkward))
})()