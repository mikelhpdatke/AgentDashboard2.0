import os
import json
from elasticsearch import Elasticsearch,  helpers
from datetime import datetime
import pytz
from time import sleep
import pyshark


def push(pcap):
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
    helpers.bulk(es, ret, chunk_size=1000, request_timeout=200)

if __name__ == "__main__":
    es = Elasticsearch()
    push('behaviour.pcap')
