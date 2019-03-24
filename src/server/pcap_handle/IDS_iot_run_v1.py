import pandas
import argparse
from time import time
col_names = ["duration","protocol_type","service","flag","src_bytes","dst_bytes","land","wrong_fragment","urgent","hot","num_failed_logins","logged_in","num_compromised","root_shell","su_attempted","num_root","num_file_creations","num_shells","num_access_files","num_outbound_cmds",
    "is_host_login","is_guest_login","count","srv_count","serror_rate",
    "srv_serror_rate","rerror_rate","srv_rerror_rate","same_srv_rate",
    "diff_srv_rate","srv_diff_host_rate","dst_host_count","dst_host_srv_count",
    "dst_host_same_srv_rate","dst_host_diff_srv_rate","dst_host_same_src_port_rate",
    "dst_host_srv_diff_host_rate","dst_host_serror_rate","dst_host_srv_serror_rate",
    "dst_host_rerror_rate","dst_host_srv_rerror_rate","label"]
kdd_data_10percent = pandas.read_csv("src/server/pcap_handle/datasetKDD99", header=None, names = col_names)
#print kdd_data_10percent.describe()
#print kdd_data_10percent['label'].value_counts()
num_features = [
    "duration","src_bytes",
    "dst_bytes","land","wrong_fragment","urgent","hot","num_failed_logins",
    "logged_in","num_compromised","root_shell","su_attempted","num_root",
    "num_file_creations","num_shells","num_access_files","num_outbound_cmds",
    "is_host_login","is_guest_login","count","srv_count","serror_rate",
    "srv_serror_rate","rerror_rate","srv_rerror_rate","same_srv_rate",
    "diff_srv_rate","srv_diff_host_rate","dst_host_count","dst_host_srv_count",
    "dst_host_same_srv_rate","dst_host_diff_srv_rate","dst_host_same_src_port_rate",
    "dst_host_srv_diff_host_rate","dst_host_serror_rate","dst_host_srv_serror_rate",
    "dst_host_rerror_rate","dst_host_srv_rerror_rate"
]
features = kdd_data_10percent[num_features].astype(float)
#print features.describe()

from sklearn.neighbors import KNeighborsClassifier
labels = kdd_data_10percent['label'].copy()
#labels[labels!='normal.'] = 'attack.'
#print labels.value_counts()

from sklearn.preprocessing import MinMaxScaler
df = features
scaled_features = MinMaxScaler().fit_transform(df.values)
scaled_features_df = pandas.DataFrame(scaled_features, index=df.index, columns=df.columns)
#print(scaled_features_df.describe())


clf = KNeighborsClassifier(n_neighbors = 5, algorithm = 'ball_tree', leaf_size=500)
#t0 = time()
clf.fit(features,labels)
#tt = time()-t0
#print "Classifier trained in {} seconds".format(round(tt,3))

""" #save model to disk
filename='knn_model.sav'
import pickle
pickle.dump(clf, open(filename,'wb'))

#load the model form disk
loaded_model = pickle.load(open(filename,'rb'))
 """

#print "nhan nhan"
#nhan = clf.predict(features)
#print "ghi nhan: "
#print(nhan[1:2])
print "\n"
kdd_data_corrected = pandas.read_csv("src/server/pcap_handle/kqout", header=None, names = col_names)
#print kdd_data_corrected['label'].value_counts()

#kdd_data_corrected['label'][kdd_data_corrected['label']!='normal.'] = 'attack.'
#print kdd_data_corrected['label'].value_counts()


from sklearn.cross_validation import train_test_split
# from sklearn.model_selection import train_test_split
kdd_data_corrected[num_features] = kdd_data_corrected[num_features].astype(float)

df = kdd_data_corrected[num_features]
scaled_features = MinMaxScaler().fit_transform(df.values)
scaled_features_df = pandas.DataFrame(scaled_features, index=df.index, columns=df.columns)
#print(scaled_features_df.describe())


features_train, features_test, labels_train, labels_test = train_test_split(
    kdd_data_corrected[num_features], 
    kdd_data_corrected['label'], 
    test_size=0.8, 
    random_state=10)
t0 = time()
pred = clf.predict(features_test)
tt = time() - t0
print "Predicted in {} seconds".format(round(tt,3))

print "nhan du doan:"
n= len(pred)
print n
#print (pred[0:n])
i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0]
for index in range(n):
	if pred[index]=="smurf.":
		i[0]+=1
	elif pred[index]=="back.":
		i[1]+=1
	elif pred[index]=="teardrop.":
		i[2]+=1
	elif pred[index]=="ipsweep.":
		i[3]+=1
	elif pred[index]=="guess_passwd.":
		i[4]+=1
	elif pred[index]=="pod.":
		i[5]+=1
	elif pred[index]=="portsweep.":
		i[6]+=1
	elif pred[index]=="buffer_overflow.":
		i[7]+=1
	elif pred[index]=="ftp_write.":
		i[8]+=1
	elif pred[index]=="neptune.":
		i[9]+=1
	elif pred[index]=="land.":
		i[10]+=1
	elif pred[index]=="perl.":
		i[11]+=1
	elif pred[index]=="loadmodule.":
		i[12]+=1
	else:
		i[13]+=1

print "so luong nhan normal: %i" %(i[13])
print "so luong nhan attack: %i" %(n-i[13])

if n-i[13] > 0:
	from subprocess import call
	call(["node", "/home/ais/Desktop/test.js"])

print "thong ke so luong tan cong:"
nhan = ['smurf','back','teardrop','ipsweep','guess_passwd','pod','portsweep','buffer_overflow','ftp_write','neptune','land','perl','loadmodule']
for x in range(len(i)-1):
	print nhan[x]+': '+str(i[x])

f = open("attack_info.txt", "w")
for x in range(len(i)-1):
	f.write(nhan[x]+' '+str(i[x])+'\n')


