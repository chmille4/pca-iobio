#!/bin/bash

# stop servers
forever stop pageServer.js
forever stop iobio/services/gdsServer.js
forever stop iobio/services/snpRelateServer.js
forever stop iobio/services/vcflibServer.js
forever stop iobio/services/tabixServer.js