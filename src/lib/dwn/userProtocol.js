export const userProtocol = {
    "protocol": "https://luna-focus.vercel.app/username",
    "published": true,
    "types": {
        "username": {
            "schema": "https://luna-focus.vercel.app/usernameSchema",
            "dataFormats": ["application/json"]
        }
    },
    "structure": {
        "username": {
            "$actions": [
                {
                    "who": "anyone",
                    "can": ["create"]
                },
                {
                    "who": "author",
                    "of": "username",
                    "can": ["read"]
                },
                {
                    "who": "recipient",
                    "of": "username",
                    "can": ["read"]
                }
            ]
        }
    }
};
