import os.path
import re

from os import walk
from glob import glob

print "CACHE MANIFEST"
print "CACHE:"

filter_patterns = [".*", "*.py", "graphics", "build", "BUGS", "cache.manifest", "index.html", "app.yaml", "deploy.sh", "robots.txt"]
expanded_patterns = reduce(lambda a, b: a + b, [glob(pattern) for pattern in filter_patterns])

def filter_list(list, patterns, prefix):
	patterns = [re.sub(re.escape(prefix), '', pattern) for pattern in patterns]
	for element in reversed(list):
		if element in patterns:
			list.remove(element)

for (root, dirs, files) in walk("."):
	filter_list(dirs, expanded_patterns, root[2:] + '/')
	filter_list(files, expanded_patterns, root[2:] + '/')
	if len(files) > 0:
		print "\n".join([os.path.join(root, file)[1:] for file in files])
	
# External files
print "http://code.jquery.com/jquery-1.4.2.min.js"

# open up for third party files
print "NETWORK:"
print "*"
