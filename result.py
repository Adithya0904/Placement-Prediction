import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler
import sys

if __name__=='__main__':
        standard_scaler=pickle.load(open('D:\\PlacementPrediction-App\\scalerTF.pkl','rb'))
        model=pickle.load(open('D:\\PlacementPrediction-App\\modelRF.pkl','rb'))

        tenth=float(sys.argv[1])
        twelth=float(sys.argv[2])
        cgpa=float(sys.argv[3])
        communicationskills=float(sys.argv[4])
        majorproject=float(sys.argv[5])
        miniproject=float(sys.argv[6])
        workshops=float(sys.argv[7])
        internship=sys.argv[8]
        hackathon=sys.argv[9]
        backlogs=float(sys.argv[10])

        if internship=='No' or internship=='no':
                internship=0
        elif internship=='Yes' or internship=='yes':
                internship=1
        if hackathon=='No' or hackathon=='no':
                hackathon=0
        elif hackathon=='Yes' or hackathon=='yes':
                hackathon=1

        if cgpa>8.2:
                cgpa=8.2
                
        # print([tenth,twelth,cgpa,communicationskills,majorproject,miniproject,workshops,internship,hackathon,backlogs])
        scaled_input=standard_scaler.transform([[tenth,twelth,cgpa,communicationskills,majorproject,miniproject,workshops,internship,hackathon,backlogs]])
        result=model.predict(scaled_input)
        # print(result[0])

        if (tenth > 60 and twelth > 60 and
                cgpa >= 7 and
                communicationskills >= 3 and
                majorproject >= 1 and miniproject >= 2 and
                workshops >= 2 and
                (internship == 1 and (hackathon == 0 or hackathon == 1) and result[0] == 1)):
                print("Placed")
        else:
                print("Not-Placed")

                                                        
        # if result[0]==1:
        #         print("Placed")
        # else:
        #         print("Not-Placed")



                
       
        
