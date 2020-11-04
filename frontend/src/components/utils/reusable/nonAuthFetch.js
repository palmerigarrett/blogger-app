export default async function doFetch(request) {
    const url = request.url ? request.url : ''
    const body = request.body ? request.body : ''
    const type = request.type ? request.type : ''
    let data = {
        res: undefined,
        error: false,
        errorMessage: ''
    }

    if (type === "GET") {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const res = await response.json()
            console.log("nonAuth - res:", res)
            console.log("nonAuth - response:", response)
            if (res && response.ok) {
                data.res = res
                return data
            } else {
                data.res = res
                data.error = true
                data.errorMessage = res['error']
                return data
            }
        } catch (error) {
            data.error = true
            data.errorMessage = error
            return data
        }
    } else {
        try {
            const response = await fetch(url, {
                method: `${type}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const res = await response.json()
            console.log("nonAuth - res:", res)
            console.log("nonAuth - response:", response)
            if (res && response.ok) {
                console.log('res is ok: ', res)
                console.log('res is ok: ', response)
                data.res = res
                return data
            } else {
                console.log('res is NOTTT ok: ', res)
                data.res = res
                data.error = true
                data.errorMessage = res['error']
                console.log("data:", data)
                return data
            }
        } catch (error) {
            console.log('res got caught, dog: ')
            data.error = true
            data.errorMessage = error
            console.log('data.error: ', data.error)
            console.log('data.errorMessage: ', data.errorMessage)
            return data
        }
    }
}
