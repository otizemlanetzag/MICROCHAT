//% color="#e67e22" icon="\uf086" block="SparkleChat"
namespace sparkleChat {
    let messageHandler: (msg: string) => void;
    let dataHandler: (name: string, value: number) => void;

    /**
     * שולח הודעה לאפליקציה
     */
    //% block="send message %text to SparkleChat"
    export function sendMessage(text: string): void {
        serial.writeLine(text);
    }

    /**
     * שולח נתון מספרי לאפליקציה
     */
    //% block="send data %name with value %value"
    export function sendData(name: string, value: number): void {
        serial.writeLine("DATA:" + name + ":" + value);
    }

    /**
     * בלוק אירוע: פועל כשהאפליקציה שולחת הודעת טקסט
     */
    //% block="on message received"
    //% draggableParameters
    export function onMessageReceived(handler: (msg: string) => void) {
        messageHandler = handler;
    }

    /**
     * בלוק אירוע: פועל כשהאפליקציה שולחת נתון מספרי (DATA:name:value)
     */
    //% block="on data received"
    //% draggableParameters
    export function onDataReceived(handler: (name: string, value: number) => void) {
        dataHandler = handler;
    }

    basic.forever(function () {
        let inputStr = serial.readLine();
        if (inputStr) {
            inputStr = inputStr.trim();

            // טיפול בקבלת דטה: DATA:name:value
            if (inputStr.includes("DATA:")) {
                let parts = inputStr.split(":");
                if (parts.length == 3 && dataHandler) {
                    let name = parts[1];
                    let value = parseFloat(parts[2]);
                    dataHandler(name, value);
                }
            }
            // טיפול בטקסט במירכאות: "TEXT"
            else if (inputStr.charAt(0) == "\"" && inputStr.charAt(inputStr.length - 1) == "\"") {
                basic.showString(inputStr.substr(1, inputStr.length - 2));
            }
            // הודעה כללית לבלוק onMessageReceived
            else if (messageHandler) {
                messageHandler(inputStr);
            }
        }
        basic.pause(50);
    })

    serial.redirectToUSB();
}
