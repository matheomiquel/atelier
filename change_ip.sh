#!/bin/bash
url="http:\/\/$(wget -qO- ipinfo.io/ip):8000\/api\/file\/"
echo $url
sed -i '' "s/ipPublic/${url}/g" ~/atelier/front/pages/cat.vue
sed -i '' "s/ipPublic/${url}/g" ~/atelier/front/pages/index.vue
