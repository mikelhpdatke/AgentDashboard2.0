#!/bin/bash
bro -r $1 src/server/pcap_handle/darpa2gurekddcup.bro > src/server/pcap_handle/conn.list
sort -n src/server/pcap_handle/conn.list > src/server/pcap_handle/conn_sort.list
src/server/pcap_handle/trafAld.out src/server/pcap_handle/conn_sort.list
python src/server/pcap_handle/kdd.py src/server/pcap_handle/trafAld.list
