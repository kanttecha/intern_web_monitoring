ffmpeg -v verbose  -rtsp_transport tcp -i "rtsp://user1:abcd1234@scgr.saiiot.com:5554/cam/realmonitor?channel=1&subtype=1" -vf scale=1920:1080  -vcodec libx264 -r 25 -b:v 1000000 -crf 31 -acodec aac  -sc_threshold 0 -f hls  -hls_time 5  -segment_time 5 -hls_list_size 5 -hls_flags delete_segments output1.m3u8

