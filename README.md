https://bigfuture.collegeboard.org/scholarship-search?sort=deadline-nearest-first

Claims to have over 28239 results, although I have been unable so far to be able to get more than 10,000 total results, if you see in getData.js, I attempt a couple of workarounds using special filters however I am unable to pull more than 10,000 unique scholarships through the API they provide. Attempting to replicate this through the browser leads to the same conclusion. 

https://web.archive.org/web/20240327051820/https://bigfuture.collegeboard.org/scholarship-search
Looking at the web archive, it seems as if around 5,000~ new scholarships have been added since this(24,947)

Run ```node getData.js``` to get the data from the API and save it to a file.
Run ```node parseData.js``` to parse the data and save it to a file.

```
Black: 4.48% of scholarships (448 total), 40.18% need-based
Women: 5.14% of scholarships (514 total), 44.55% need-based
LGBT: 0.38% of scholarships (38 total), 28.95% need-based
Veterans: 3.34% of scholarships (334 total), 31.14% need-based
Native American: 0.61% of scholarships (61 total), 49.18% need-based
Other: 86.05% of scholarships (8605 total), 37.02% need-based

Overall Need-Based Scholarships: 37.40% of all scholarships (3740 out of 10000)
Average Scholarship Maximum Award: $2914
``` 

