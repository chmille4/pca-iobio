#!/bin/bash

# start application server
forever start pageServer.js --port 7070

# start server that reads cached gds files
# gds files are what snpRelate creates after processing the VCF
forever start iobio/services/gdsServer.js --port 8000

# start pca server
forever start iobio/services/snpRelateServer.js --port 8010

# start vcflib server
forever start iobio/services/vcflibServer.js --port 7080

# start tabix server to download vcf slices
forever start iobio/services/tabixServer.js --port 7090
