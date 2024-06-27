export const periodTrackerProtocol = {
    "protocol": "https://luna-focus.vercel.app/period-calendar",
    "published": true,
    "types": {
        "periodEntry": {
            "schema": "https://luna-focus.vercel.app/period-calendar/periodEntrySchema",
            "dataFormats": ["application/json"]
        }
    },
    "structure": {
        "periodEntry": {
            "$actions": [
                {
                    "who": "anyone",
                    "can": ["create"]
                },
                {
                    "who": "author",
                    "of": "periodEntry",
                    "can": ["create", "read", "update", "delete"]
                },
                {
                    "who": "recipient",
                    "of": "periodEntry",
                    "can": ["read"]
                }
            ]
        }
    }
};
