#!/bin/bash

# stop servers
forever stop pageServer.js
forever stop minion/services/gdsServer.js
forever stop minion/services/snpRelateServer.js
forever stop minion/services/vcflibServer.js
forever stop minion/services/tabixServer.js