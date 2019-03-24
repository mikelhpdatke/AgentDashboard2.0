#!/bin/bash
file_pcap=$1
src/server/pcap_handle/pcap2kdd.sh $file_pcap
python src/server/pcap_handle/IDS_iot_run_v1.py
python src/server/pcap_handle/push.py
