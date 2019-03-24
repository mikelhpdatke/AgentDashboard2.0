var fs = require('fs');
var cmd = require('node-cmd');
var elasticsearch = require('elasticsearch');
var mysql = require('promise-mysql');
var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
});

var Promise =require('bluebird');

var utils = {

    moveFile: async function (src, dst) {
        const copyFile = require('fs-copy-file');

        copyFile(src, dst, (err) => {
            if (err)
                throw err;

            console.log('source.txt was copied to destination.txt');
        });
    },

    addToELK: function (index, data) {
        return client.index({
            type: '_doc',
            index: index,
            body: data
        });
    },

    saveToPcap: function (s) {
        s = s.replace("0x", "0");
        s = s.replace(":", "");
        data = s.split(" ");
        for (var i = 1; i < data.length; i++) {
            var tmp = data[i];
            if (tmp.length > 2) {
                tmp = tmp.slice(0, 2) + " " + tmp.slice(2);
            }
            data[i] = tmp;
        }
        data[0] = data[0].slice(1);
        var res = "";
        for (var i = 0; i < data.length; i++) {
            res = res + data[i] + " ";
        }
        return res + "\n";
    },

    pushPcapToELK: function (fileName) {
        cmd.run(`python3 src/server/pushPcap.py`);
    },

    detection: async function (fileName) {
        cmd.run('sudo src/server/pcap_handle/script_run.sh ' + fileName);
    },

    reconstructionFileFromPcap: function(fileName) {
        var datetime = new Date();
        var dir = "/media/ais/Data/re_file/" + datetime
        fs.mkdirSync(dir);
        cmd.run('sudo foremost -i behaviour.pcap -o ' + dir);
    },

    convertToPcap: function (fileName) {
        var datetime = new Date();
        var newFilename = "/media/ais/Data/pcap/" + datetime + ".pcap";
        this.moveFile('behaviour.pcap', newFilename);
        data = fs.readFileSync(fileName, "utf8");
        var sentences = data.split("\n");
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            if (sentence.indexOf("Done") != -1) {
                break;
            }
            if (sentence.indexOf("0x0") != -1) {
                var res = this.saveToPcap(sentence);
                fs.appendFileSync('text2pcap.txt', res);
            }
        }
        cmd.get("text2pcap text2pcap.txt behaviour.pcap", (err, data, stderr) => {
            try {
                fs.unlinkSync("tcpdump.txt");
                fs.unlinkSync("text2pcap.txt");
                utils.pushPcapToELK('behaviour.pcap');
                utils.detection('behaviour.pcap');
                utils.reconstructionFileFromPcap('behaviour.pcap');
            }
            catch {

            }
        });
    },

    storeMD5: function (ip, data) {
        fs.appendFileSync("md5.txt", data.toString());
        if (data.toString().indexOf("Done") != -1) {
            var content = fs.readFileSync("md5.txt", "utf8");
            var sentences = content.split('\n');
        }
        else {
            return data;
        }
        var pos = 0;
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].indexOf("done_ps") != -1) {
                pos = i + 1;
                break;
            }
            var tmp = sentences[i];
            if (tmp.indexOf("PID USER       VSZ STAT COMMAND") != -1) continue;
            var dataToELK = {
                "ip": ip.substring(ip.lastIndexOf(':') + 1),
                "timestamp": Date.now(),
                "listOfPID": sentences[i]
            }
            this.addToELK('agent-pid', dataToELK);
        }
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].indexOf("Done") != -1) break;
            var tmp = sentences[i].split('  ');
            if (tmp.length > 2) continue;
            var md5 = tmp[0];
            var fileName = tmp[1];
            //console.log(ip);
            var dataToELK = {
                "ip": ip.substring(ip.lastIndexOf(':') + 1),
                "timestamp": Date.now(),
                "file": fileName,
                "md5": md5
            }
            this.addToELK('agent-md5', dataToELK)
        }
        fs.unlinkSync("md5.txt");
        return data;
    },

    storeSyscall: function (ip, data) {
        fs.appendFileSync("syscall.txt", data.toString());
        if (data.toString().indexOf("PID") != -1) {
            var content = fs.readFileSync("syscall.txt", "utf8");
            var sentences = content.split('\n');
            var PID = "";
            for (var i = sentences.length - 1; i--; i >= 0) {
                if (sentences[i].indexOf("PID") != -1) {
                    PID = sentences[i].substr(sentences[i].indexOf("PID") + 5, -1);
                    break;
                }
            }
        }
        else {
            return data;
        }
        console.log(PID);
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i].indexOf("PID") != -1) break;
            dataToELK = {
                "ip": ip.substring(ip.lastIndexOf(":") + 1),
                "timestamp": Date.now(),
                "pid": parseInt(PID),
                "cmdline": "",
                "syscall": sentences[i]
            }
            this.addToELK('agent-syscall', dataToELK)
        }
        fs.unlinkSync("syscall.txt");
        return data;
    },

    storePcap: async function (data) {
        fs.appendFileSync('tcpdump.txt', data.toString());
        if (data.toString().indexOf("Done") != -1) {
            this.convertToPcap('tcpdump.txt');
        }
        return data.toString();
    },

    storeData: function (ip, task, data) {
        var response = null;
        if (task == "1") {
            response = this.storeMD5(ip, data);
        }
        else {
            if (task == "2") {
                response = this.storePcap(data);
            }
            else {
                if (task == "3") {
                    response = this.storeSyscall(ip, data);
                }
            }
        }
        return response;
    },


    addClient: function (L, c) {
        for (var i = 0; i < L.length; i++) {
            tmp = L[i]
            if (tmp['ip'] == c['ip']) {
                L.splice(i, 1);
                break;
            }
        }
        L.push(c);
        return L;
    },


    getTask: function (L, sName) {
        for (var i = 0; i < L.length; i++) {
            if (L[i]['address'] == sName) {
                return L[i]['currentTask'];
            }
        }
        return null;
    },

    getListOfClients: async function () {
        db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'AGENT'
        });
        let listOfDevices = await db.query('select ip, address from agent_info');
        let res = [];
        for (var i = 0; i < listOfDevices.length; i++) {
            res.push({
                "socket": "",
                "address": "",
                "ip": listOfDevices[i].ip,
                "port": "",
                "active": false,
                "currentTask": ""
            });
        }
        return res;
    }

}

module.exports = utils;
