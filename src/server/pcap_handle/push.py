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
import pytz

def pushMalware():
    ret = []
    cap = {
        "timestamp":datetime.now(pytz.timezone('Asia/Ho_Chi_Minh'))
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
                          "_type": "_doc", "timestamp": datetime.now(pytz.timezone('Asia/Ho_Chi_Minh')), "att_type": key})
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
    pushMalware()
