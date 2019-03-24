from datetime import datetime
from elasticsearch import Elasticsearch,  helpers
import random
import socket
import struct
import os
import binascii
import pyshark
import time
import csv
import hashlib
import json
import pytz

def run():
    md5 = {
        "_index": "agent-md5",
        "_type": "_doc",
        "ip": "192.168.0.1",
        "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')),
        "file": "/bin/helloworld",
        "md5": "1231324a56wdawd32a1sd32asd"
    }
    md5["ip"] = socket.inet_ntoa(struct.pack(
        '>I', random.randint(1, 0xffffffff)))
    md5["file"] = "/bin/" + random.choice(os.listdir("/usr/share"))
    md5["md5"] = binascii.hexlify(os.urandom(16))

    pid = {
        "_index": "agent-pid",
        "_type": "_doc",
        "ip": "192.168.0.1",
        "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')),
        "listOfPID": ["123", "243"]
    }
    pid["ip"] = md5["ip"]
    pid["listOfPID"] = map(str, random.sample(
        range(1000), random.randint(1, 4)))

    syscall = {
        "_index": "agent-syscall",
        "_type": "_doc",
        "ip": "192.168.0.1",
        "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')),
        "pid": "11",
        "cmdline": "telnet",
        "syscall": "read"
    }
    syscall["ip"] = md5["ip"]
    syscall["pid"] = str(random.randint(0, 1000))
    syscall["cmdline"] = random.choice(
        ["telnet", "ssh", "nc", "busybox", "tcpdump", "strace", "ps", "ls", "grep", "wget"])
    syscall["syscall"] = random.choice(
        ["read", "open", "write", "close", "access", "accept", "times", "wait", "bind", "listen", "link"])

    return md5, pid, syscall


def pushMd5(md5):
    helpers.bulk(es, md5, chunk_size=1000, request_timeout=200)
    #res = es.index(index="agent-md5",doc_type='_doc', body=md5)
    # print(res['result'])


def pushSyscall(syscall):
    helpers.bulk(es, syscall, chunk_size=1000, request_timeout=200)
    #res = es.index(index="agent-syscall", doc_type='_doc',body=syscall)
    # print(res['result'])


def pushPid(pid):
    helpers.bulk(es, pid, chunk_size=1000, request_timeout=200)
    #res = es.index(index="agent-pid", doc_type='_doc', body=pid)
    # print(res['result'])


def mappingMd5():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "ip":    { "type": "ip"  },
                "timestamp":     { "type": "date"  },
                "file":      { "type": "text" },
                "md5":  {"type":   "text"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-md5', body=mapping)


def mappingPid():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "ip":    { "type": "ip"  },
                "timestamp":     { "type": "date"  },
                "listOfPID":      { "type": "text" }
            }
            }
        }
    }'''
    es.indices.create(index='agent-pid', body=mapping)


def mappingSyscall():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "ip":    { "type": "ip"  },
                "timestamp":     { "type": "date"  },
                "pid":      { "type": "integer" },
                "cmdline":  {"type":   "text"},
                "syscall":{"type":"text"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-syscall', body=mapping)


def mappingPcap():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "ip_src":    { "type": "ip"  },
                "ip_dst":     { "type": "ip"  },
                "port_src":      { "type": "integer" },
                "port_dst":  {"type":   "integer"},
                "timestamp":{"type":"date"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-pcap', body=mapping)


def mappingMalware():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "smurf":    { "type": "text"  },
                "back":     { "type": "text"  },
                "teardrop":      { "type": "text" },
                "ipsweep":  {"type":   "text"},
                "guess_passwd":  {"type":   "text"},
                "pod":  {"type":   "text"},
                "portsweep":  {"type":   "text"},
                "buffer_overflow":  {"type":   "text"},
                "ftp_write":  {"type":   "text"},
                "neptune":  {"type":   "text"},
                "land":  {"type":   "text"},
                "perl":  {"type":   "text"},
                "loadmodule":  {"type":   "text"},
                "timestamp":{"type":"date"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-malware', body=mapping)


def mappingMalwareCount():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "att_type":{"type":"text"},
                "timestamp":{"type":"date"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-malwarecount', body=mapping)


def mappingMalware():
    mapping = '''
    {
        "mappings": {
            "_doc": {
            "properties": {
                "smurf":    { "type": "text"  },
                "back":     { "type": "text"  },
                "teardrop":      { "type": "text" },
                "ipsweep":  {"type":   "text"},
                "guess_passwd":  {"type":   "text"},
                "pod":  {"type":   "text"},
                "portsweep":  {"type":   "text"},
                "buffer_overflow":  {"type":   "text"},
                "ftp_write":  {"type":   "text"},
                "neptune":  {"type":   "text"},
                "land":  {"type":   "text"},
                "perl":  {"type":   "text"},
                "loadmodule":  {"type":   "text"},
                "timestamp":{"type":"date"}
            }
            }
        }
    }'''
    es.indices.create(index='agent-malware', body=mapping)


def pushPcap(pcap):
    cap = pyshark.FileCapture(pcap)
    ret = []
    for packet in cap:
        if hasattr(packet, "ip"):
            ip_src = packet['ip'].src
            ip_dst = packet['ip'].dst
        else:
            continue
        if hasattr(packet, "tcp"):
            port_src = packet.tcp.srcport
            port_dst = packet.tcp.dstport
        else:
            continue
        cap = {
            "_index": "agent-pcap",
            "_type": "_doc",
            "ip_src": ip_src,
            "ip_dst": ip_dst,
            "port_src": port_src,
            "port_dst": port_dst,
            "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
        }
        ret.append(cap)
    print(ret)
    helpers.bulk(es, ret, chunk_size=1000, request_timeout=200)

def pushMalware():
    ret = []
    cap = {
        "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
    }
    count = []
    cc = {
        "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
    }

    f = open("attack_info.txt", "r")
    while True:
        line = f.readline()
        if line == '':
            break
        key = line.split(' ')[0]
        value = line.split(' ')[1][:-1]
        cap[key] = value
        for i in xrange(int(value)):
            count.append({"_index": "agent-malwarecount",
                          "_type": "_doc", "timestamp": datetime.now(), "att_type": key})
    tmp = {
        "_index": "agent-malware",
        "_type": "_doc",
    }
    tmp["data"] = cap
    ret.append(tmp)
    f.close()
    helpers.bulk(es, ret, chunk_size=1000, request_timeout=200)
    helpers.bulk(es, count, chunk_size=1000, request_timeout=200)


if __name__ == "__main__":
    es = Elasticsearch()
    '''Set mapping '''
    # mappingMd5()
    # mappingPid()
    # mappingSyscall()
    # mappingPcap()
    # mappingMalwareCount()
    #mappingMalware()
    # #md5s = []
    # pids = []
    # syscalls = []
    #for i in range(10):
        #md5, pid, syscall = run()
        #pushSyscall(syscall)
        #pushMd5(md5)
        #pushPid(pid)
        #md5s.append(md5)
        #pids.append(pid)
        #syscalls.append(syscall)
    #while True:
    #    pushMalware()
    #    time.sleep(5)
    #    print('Daelay 5s')
    #pushMd5(md5s)
    # pushPid(pids)
    # pushSyscall(syscalls)

    filehash = hashlib.md5()
    filehash.update(open('behaviour.pcap', 'rb').read())
    pushPcap('behaviour.pcap')
    print(filehash.hexdigest())
    has = filehash.hexdigest()
    while (1):
        newhash = hashlib.md5()
        newhash.update(open('behaviour.pcap', 'rb').read())
        print(newhash.hexdigest())
        if newhash.hexdigest() != has:
            pushPcap('behaviour.pcap')
            has = newhash.hexdigest()
            print("file changed!")
        time.sleep(30)
    
    # push md5 list with data = md5s
    #helpers.bulk(es, md5s, chunk_size=1000, request_timeout=200)

    '''
    es.indices.refresh(index="agent-syscall")
    res = es.search(index="agent-syscall", body={"query": {"match_all": {}}})
    print("Got %d Hits:" % res['hits']['total'])
    for hit in res['hits']['hits']:
        print(hit["_source"])
    '''

