#!/bin/bash
url=$(wget -qO- ipinfo.io/ip)
sed -i '' "s/ipPublic/${url}/g" ~/atelier/front/pages/cat.vue
sed -i '' "s/ipPublic/${url}/g" ~/atelier/front/pages/index.vue
