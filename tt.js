async function onRequest(context, request) {
    return request;
}

async function onResponse(context, request, response) {
    try {
        // Parse response body as JSON
        var responseData = JSON.parse(response.body);
        
        // Check if data field exists
        if (!responseData.data || responseData.data.length === 0) {
            return response;
        }
        
        var encryptedData = responseData.data;
        console.log("Original encrypted data length: " + encryptedData.length);
        
        // Call API to process encrypted data
        // Change this URL to your server address
        var apiUrl = "http://47.94.228.151:5000/process";
        
        var apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                encrypted: encryptedData
            })
        });
        
        if (apiResponse.ok) {
            var result = await apiResponse.json();
            
            if (result.success) {
                // Replace encrypted data with modified version
                responseData.data = result.encrypted;
                response.body = JSON.stringify(responseData);
                
                console.log("Success! Modified closeStatus: " + result.modified.closeStatus);
                console.log("Modified timeSharingStoreStatus: " + result.modified.timeSharingStoreStatus);
            } else {
                console.log("API error: " + result.error);
            }
        } else {
            console.log("API request failed: " + apiResponse.status);
        }
        
    } catch (e) {
        console.log("Script error: " + e.toString());
    }
    
    return response;
}
