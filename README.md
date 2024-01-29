# Stanford Dogs Classifier Performance Analysis

This repository is dedicated to analyzing the performance of a multi-class image classifier on the Stanford Dogs dataset. It provides insights into how well the classifier performs across different dog breeds. 

There are two main modules designed for this analysis:

## 1. Confusion Matrix

The Confusion Matrix module offers a visual representation of the classifier's performance. It helps us understand how the model's predictions compare to the actual labels for various dog breeds.

### Display Options - Click "Switch Display" button under the Confusion Matrix section

#### 1. Matrix Table

The Matrix Table is a straightforward representation of the confusion matrix. It displays the counts of true positives, true negatives, false positives, and false negatives for each dog breed.

#### 2. Heatmap

The Heatmap is a graphical representation of the confusion matrix. It uses color to visualize patterns in the classifier's performance. Additionally, it includes an overlay to highlight areas with false positives, providing a more comprehensive view of classification errors.

## 2. Sensitivity Score

Sensitivity, also known as the True Positive Rate, is an important metric that measures the classifier's ability to correctly identify positive cases (in this case, specific dog breeds) out of all actual positive cases. The Sensitivity Score for a breed is calculated using the following formula:

Sensitivity = True Positives / (True Positives + False Negatives)

This score helps us understand how well the classifier performs in correctly classifying each dog breed, particularly in terms of minimizing false negatives.

These modules aim to provide a clear and detailed analysis of the Stanford Dogs classifier's performance, enabling us to evaluate its strengths and weaknesses in breed classification.

## Run Instructions

1. Clone repository
2. Open terminal and run the following commands

```
npm install
npm run start -w frontend
```
