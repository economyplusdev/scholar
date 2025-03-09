https://bigfuture.collegeboard.org/scholarship-search?sort=deadline-nearest-first

Claims to have over 28239 results, although I have been unable so far to be able to get more than 10,000 total results, if you see in getData.js, I attempt a couple of workarounds using special filters however I am unable to pull more than 10,000 unique scholarships through the API they provide. Attempting to replicate this through the browser leads to the same conclusion. 

https://web.archive.org/web/20240327051820/https://bigfuture.collegeboard.org/scholarship-search
Looking at the web archive, it seems as if around 5,000~ new scholarships have been added since this(24,947)

Run ```node getData.js``` to get the data from the API and save it to a file.
Run ```node parseData.js``` to parse the data and save it to a file.

```
Total number of scholarships: 10000

For African Americans: 4.48% of scholarships (448 total), 40.18% need-based
For Women: 5.14% of scholarships (514 total), 44.55% need-based
For LGBT: 0.38% of scholarships (38 total), 28.95% need-based
For Veterans: 3.34% of scholarships (334 total), 31.14% need-based
For Native American: 0.61% of scholarships (61 total), 49.18% need-based
For Hispanic: 0.74% of scholarships (74 total), 63.51% need-based
For Asian: 0.42% of scholarships (42 total), 52.38% need-based
For First Generation: 1.33% of scholarships (133 total), 63.91% need-based
For Disability: 1.06% of scholarships (106 total), 42.45% need-based
For Other: 82.50% of scholarships (8250 total), 36.21% need-based

Overall Need-Based Scholarships: 37.40% of all scholarships (3740 out of 10000)
Average Scholarship Maximum Award: 2914$
Percentage of scholarships that only require an essay: 19.77%
Percentage of scholarships that require a letter of recommendation: 19.54%
Percentage of scholarships that require both an essay and a letter of recommendation: 13.72%
``` 

