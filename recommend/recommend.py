import pandas as pd
import numpy as np
import json
import sys

# Read the dataset
dataset = pd.read_csv('./recommend/Crop_recommendation.csv')
dataset = dataset[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'label']]

# Divide the dataset into features and labels
X = dataset.iloc[:, :-1].values  # Features (N, P, K, temperature, humidity, ph)
y = dataset.iloc[:, -1].values   # Labels (crop type)

# Split the dataset into training and test sets
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Train the model using the Random Forest Classifier algorithm
from sklearn.ensemble import RandomForestClassifier
classifier = RandomForestClassifier(n_estimators=10, criterion='entropy', random_state=0)
classifier.fit(X_train, y_train)

# Example user input - make sure the input has the correct number of features (6 features)
# data=[90,42,43,21,82,6.5]


# user_input = np.array(data)
# user_input = np.array([90,42,43,21,82,6.5])

data = sys.stdin.read()
input = json.loads(data)
user_input=np.array(input)



user_input = user_input.reshape(1, -1)

# Make predictions using the trained model
predictions = classifier.predict(user_input)

# Print the predicted crop
# print("Answer : ",str(predictions[0]))
# print("Answer : ",predictions[0])    # Output the crop predicted by the model

output_data = json.dumps({"result": predictions[0]})
sys.stdout.write(output_data)
sys.stdout.flush()
