[
    {
        "id": "ccdd48e8665c2d0a",
        "type": "debug",
        "z": "30faa66cef67a545",
        "name": "debug 9",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 560,
        "y": 60,
        "wires": []
    },
    {
        "id": "91b7e18ddeaba6b4",
        "type": "string",
        "z": "30faa66cef67a545",
        "name": "",
        "methods": [
            {
                "name": "split",
                "params": [
                    {
                        "type": "str",
                        "value": ","
                    },
                    {
                        "type": "num",
                        "value": "8"
                    }
                ]
            }
        ],
        "prop": "payload",
        "propout": "payload",
        "object": "msg",
        "objectout": "msg",
        "x": 380,
        "y": 95,
        "wires": [
            [
                "ccdd48e8665c2d0a",
                "aa2f505ba544145f"
            ]
        ]
    },
    {
        "id": "aa2f505ba544145f",
        "type": "function",
        "z": "30faa66cef67a545",
        "name": "function 1",
        "func": "msg.payload = msg.payload[0]\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 565,
        "y": 120,
        "wires": [
            [
                "3ceef57ae08ea820",
                "ae715a5f3b432ebc",
                "03f52bb8e7441ba6",
                "4e7c21beee01b67c",
                "82e825a199457d85",
                "0d68b73a48c0c1ba",
                "5a34f5fbd28ce16b",
                "b4aad092e5ffda48",
                "88b0c4af3dbc7ff2",
                "875e18517a805322",
                "9ec2d2ef4c2aa564"
            ]
        ]
    },
    {
        "id": "e5cc530cc0a0b7d0",
        "type": "modbus-read",
        "z": "30faa66cef67a545",
        "name": "",
        "topic": "",
        "showStatusActivities": false,
        "logIOActivities": false,
        "showErrors": false,
        "showWarnings": true,
        "unitid": "1",
        "dataType": "InputRegister",
        "adr": "0",
        "quantity": "8",
        "rate": "500",
        "rateUnit": "ms",
        "delayOnStart": false,
        "enableDeformedMessages": false,
        "startDelayTime": "",
        "server": "a1b2c3d4e5f6a004",
        "useIOFile": false,
        "ioFile": "",
        "useIOForPayload": false,
        "emptyMsgOnFail": false,
        "x": 205,
        "y": 50,
        "wires": [
            [
                "91b7e18ddeaba6b4"
            ],
            []
        ]
    },
    {
        "id": "3ceef57ae08ea820",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "5be4719c5ce6a501",
        "order": 1,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-battery",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#62a0ea",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 765,
        "y": 140,
        "wires": [
            []
        ]
    },
    {
        "id": "ae715a5f3b432ebc",
        "type": "debug",
        "z": "30faa66cef67a545",
        "name": "debug 3",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 770,
        "y": 375,
        "wires": []
    },
    {
        "id": "03f52bb8e7441ba6",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "5be4719c5ce6a501",
        "order": 2,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-34",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 760,
        "y": 90,
        "wires": [
            []
        ]
    },
    {
        "id": "4e7c21beee01b67c",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "63f11ca1d36a4250",
        "order": 1,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-tank",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 765,
        "y": 185,
        "wires": [
            []
        ]
    },
    {
        "id": "82e825a199457d85",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "63f11ca1d36a4250",
        "order": 3,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-half",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 765,
        "y": 230,
        "wires": [
            []
        ]
    },
    {
        "id": "0d68b73a48c0c1ba",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "cf381acd16455143",
        "order": 3,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "4",
        "gtype": "gauge-tank",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "200",
                "color": "#8ff0a4",
                "text": "",
                "textType": "label"
            },
            {
                "from": "400",
                "color": "#57e389",
                "text": "",
                "textType": "label"
            },
            {
                "from": "600",
                "color": "#33d17a",
                "text": "",
                "textType": "label"
            },
            {
                "from": "800",
                "color": "#26a269",
                "text": "",
                "textType": "label"
            },
            {
                "from": "900",
                "color": "#f9f06b",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#f8e45c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1200",
                "color": "#f6d32d",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1500",
                "color": "#f5c211",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2000",
                "color": "#e5a50a",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#c01c28",
                "text": "",
                "textType": "label"
            },
            {
                "from": "3000",
                "color": "#a51d2d",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 765,
        "y": 270,
        "wires": [
            []
        ]
    },
    {
        "id": "5a34f5fbd28ce16b",
        "type": "ui-progress",
        "z": "30faa66cef67a545",
        "group": "cf381acd16455143",
        "name": "",
        "label": "Progress",
        "order": 1,
        "width": 0,
        "height": 0,
        "color": "",
        "className": "",
        "x": 775,
        "y": 325,
        "wires": []
    },
    {
        "id": "88b0c4af3dbc7ff2",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "5be4719c5ce6a501",
        "order": 3,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-battery",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#62a0ea",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 505,
        "y": 295,
        "wires": [
            []
        ]
    },
    {
        "id": "b4aad092e5ffda48",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "63f11ca1d36a4250",
        "order": 2,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-34",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 500,
        "y": 245,
        "wires": [
            []
        ]
    },
    {
        "id": "875e18517a805322",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "5be4719c5ce6a501",
        "order": 4,
        "value": "payload",
        "valueType": "msg",
        "width": "2",
        "height": "2",
        "gtype": "gauge-tank",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 505,
        "y": 340,
        "wires": [
            []
        ]
    },
    {
        "id": "9ec2d2ef4c2aa564",
        "type": "ui-gauge",
        "z": "30faa66cef67a545",
        "name": "",
        "group": "cf381acd16455143",
        "order": 2,
        "value": "payload",
        "valueType": "msg",
        "width": "3",
        "height": "3",
        "gtype": "gauge-half",
        "gstyle": "needle",
        "title": "gauge",
        "alwaysShowTitle": false,
        "floatingTitlePosition": "top-left",
        "units": "units",
        "icon": "",
        "prefix": "",
        "suffix": "",
        "segments": [
            {
                "from": "0",
                "color": "#5cd65c",
                "text": "",
                "textType": "label"
            },
            {
                "from": "1000",
                "color": "#99c1f1",
                "text": "",
                "textType": "label"
            },
            {
                "from": "2500",
                "color": "#ea5353",
                "text": "",
                "textType": "label"
            }
        ],
        "min": 0,
        "max": "5000",
        "sizeThickness": 16,
        "sizeGap": 4,
        "sizeKeyThickness": 8,
        "styleRounded": true,
        "styleGlow": false,
        "className": "",
        "x": 505,
        "y": 385,
        "wires": [
            []
        ]
    },
    {
        "id": "a1b2c3d4e5f6a004",
        "type": "modbus-client",
        "name": "RS485 USB",
        "clienttype": "serial",
        "bufferCommands": true,
        "stateLogEnabled": false,
        "queueLogEnabled": false,
        "failureLogEnabled": true,
        "tcpHost": "127.0.0.1",
        "tcpPort": "502",
        "tcpType": "DEFAULT",
        "serialPort": "/dev/ttyUSB2",
        "serialType": "RTU-BUFFERD",
        "serialBaudrate": "9600",
        "serialDatabits": "8",
        "serialStopbits": "1",
        "serialParity": "none",
        "serialConnectionDelay": "100",
        "serialAsciiResponseStartDelimiter": "0x3A",
        "unit_id": "",
        "commandDelay": 100,
        "clientTimeout": 1000,
        "reconnectOnTimeout": false,
        "reconnectTimeout": 2000,
        "parallelUnitIdsAllowed": false,
        "showErrors": false,
        "showWarnings": true,
        "showLogs": true
    },
    {
        "id": "5be4719c5ce6a501",
        "type": "ui-group",
        "name": "Group 1",
        "page": "5b90ca959bb10075",
        "width": "4",
        "height": 1,
        "order": 1,
        "showTitle": true,
        "className": "",
        "visible": "true",
        "disabled": "false",
        "groupType": "default"
    },
    {
        "id": "63f11ca1d36a4250",
        "type": "ui-group",
        "name": "Group 2",
        "page": "5b90ca959bb10075",
        "width": "4",
        "height": 1,
        "order": 2,
        "showTitle": true,
        "className": "",
        "visible": "true",
        "disabled": "false",
        "groupType": "default"
    },
    {
        "id": "cf381acd16455143",
        "type": "ui-group",
        "name": "Group 3",
        "page": "5b90ca959bb10075",
        "width": "4",
        "height": 1,
        "order": 3,
        "showTitle": true,
        "className": "",
        "visible": "true",
        "disabled": "false",
        "groupType": "default"
    },
    {
        "id": "5b90ca959bb10075",
        "type": "ui-page",
        "name": "OTICS INDONESIA OEE TRIAL CONTROL SYSTEM NAIS ONE",
        "ui": "b44e45b16a484ff4",
        "path": "/page1",
        "icon": "home",
        "layout": "grid",
        "theme": "6ea9609268795cb6",
        "breakpoints": [
            {
                "name": "Default",
                "px": "0",
                "cols": "3"
            },
            {
                "name": "Tablet",
                "px": "576",
                "cols": "6"
            },
            {
                "name": "Small Desktop",
                "px": "768",
                "cols": "9"
            },
            {
                "name": "Desktop",
                "px": "1024",
                "cols": "12"
            }
        ],
        "order": 1,
        "className": "",
        "visible": true,
        "disabled": false
    },
    {
        "id": "b44e45b16a484ff4",
        "type": "ui-base",
        "name": "My Dashboard",
        "path": "/dashboard",
        "appIcon": "",
        "includeClientData": true,
        "acceptsClientConfig": [
            "ui-notification",
            "ui-control"
        ],
        "showPathInSidebar": false,
        "headerContent": "page",
        "navigationStyle": "default",
        "titleBarStyle": "default",
        "showReconnectNotification": true,
        "notificationDisplayTime": 1,
        "showDisconnectNotification": true,
        "allowInstall": false
    },
    {
        "id": "6ea9609268795cb6",
        "type": "ui-theme",
        "name": "Default Theme",
        "colors": {
            "surface": "#ffffff",
            "primary": "#0094CE",
            "bgPage": "#eeeeee",
            "groupBg": "#ffffff",
            "groupOutline": "#cccccc"
        },
        "sizes": {
            "density": "default",
            "pagePadding": "12px",
            "groupGap": "12px",
            "groupBorderRadius": "4px",
            "widgetGap": "12px"
        }
    },
    {
        "id": "f5dbf6648b67b85e",
        "type": "global-config",
        "env": [],
        "modules": {
            "node-red-contrib-string": "1.0.0",
            "node-red-contrib-modbus": "5.45.2",
            "@flowfuse/node-red-dashboard": "1.30.1"
        }
    }
]
