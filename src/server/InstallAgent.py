import telnetlib
import sys
import time
import MySQLdb

def getDeviceInfo(HOST):
    HOST = HOST[HOST.rfind(':') + 1:]
    db = MySQLdb.connect("localhost", "root", "root", "AGENT")
    cursor = db.cursor()
    sql = "SELECT * FROM device_auth WHERE address_ip LIKE '" + HOST + "'"
    cursor.execute(sql)
    data = cursor.fetchone()
    print data
    return data[1], data[2], data[3], data[4]
    db.close()

def install(HOST, PORT, USER, PASSWORD):
    print(HOST)
    print(PORT)
    telnet = telnetlib.Telnet(HOST)
    telnet.read_until("ogin: ")
    telnet.write(USER + "\n")
    if PASSWORD != "":
        telnet.read_until("assword: ")
        telnet.write(PASSWORD + "\n")
    telnet.write("sh\n")
    telnet.write("cd /tmp\n")
    if HOST == '192.168.1.2':
        telnet.write('wget http://192.168.1.3/ARM/agent_arm.sh\n')
        telnet.write('chmod +x agent_arm.sh\n')
        telnet.write('sh agent_arm.sh\n')
    else:
        if HOST == '192.168.1.1':
            telnet.write('wget http://192.168.1.3/MIPS32/agent_MIPS32.sh\n')
            telnet.write('chmod +x agent_MIPS32.sh\n')
            telnet.write('sh agent_MIPS32.sh\n')
    telnet.write("exit\n")
    print telnet.read_all()

if __name__ == '__main__':
    HOST, PORT, USER, PASSWORD = getDeviceInfo(sys.argv[1])
    install(HOST, PORT, USER, PASSWORD)
