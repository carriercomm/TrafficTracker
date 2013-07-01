# Ping several locations to generate markers
# for leaflet map

echo "Pinging started...."

ping -q -c 5 english.gov.cn &
ping -q -c 5 gov.za &
ping -q -c 5 naenara.com.kp &
ping -q -c 5 cctld.ru &
ping -q -c 5 imgur.com &
ping -q -c 5 ting.com &
ping -q -c 5 hs.fi &
ping -q -c 5 wikileaks.org

echo " "
echo "All done, exiting."