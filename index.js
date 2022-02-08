const url = "https://myprivacy.uber.com/privacy/api/getEatsOrders?localeCode=en-US"

async function fetchOrder(uuid = null) {
    let data = {"limit": 40, "lastWorkflowUuid": uuid}
    let payload = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json', 'x-csrf-token': 'x'},
        body: JSON.stringify(data)
    }
    let resp = await fetch(url, payload)
    return await resp.json()
}


i = 0
let lastWorkflowUuid = null
total = 0
while (i < 1) {
    let result = await fetchOrder(lastWorkflowUuid)
    if (result.data.orders.length === 0) {
        break
    }
    lastWorkflowUuid = result.data.orders[result.data.orders.length - 1].uuid
    for (const order of result.data.orders) {
        total += order.fare
    }
    console.log('讀取中...')
    console.log('目前總金額：', total)
}
console.log('UberEats總消費金額➡️', total)
