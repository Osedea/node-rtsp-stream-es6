const child_process = require('child_process');
const EventEmitter = require('events');

class Mpeg1Muxer extends EventEmitter {
    constructor(options) {
        super(options);
        this.url = options.url;
        this.stream = child_process.spawn(
            'ffmpeg',
            // -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -b 0
            // '-bufsize', '512k', '-maxrate', '3000k'
            // ['-rtsp_transport', 'tcp','-i', this.url, '-vcodec', 'copy', '-probesize', '200000', '-an', '-f', 'mp4', '-reset_timestamps', '1', '-movflags', 'empty_moov+default_base_moof+frag_keyframe', '-loglevel','debug', '-'],
            ['-loglevel', 'quiet', '-rtsp_transport', 'tcp', '-re', '-i', this.url, '-s','1280x720','-an', '-f', 'mpegts','-codec:v', 'mpeg1video','-g', '30', '-bf', '0', '-b:v', '512k','-q', '20', '-'],
            // ['-loglevel', 'debug', '-rtsp_transport', 'tcp', '-i', this.url, '-f', 'mpegts', '-vf', 'crop=iw-mod(iw\\,2):ih-mod(ih\\,2)', '-b', '0', '-' ],
            { detached: false }
        );

        this.inputStreamStarted = true
        this.stream.stdout.on('data', (data) => { return this.emit('mpeg1data', data) })
        this.stream.stderr.on('data', (data) => { return this.emit('ffmpegError', data) })
    }
}

module.exports = Mpeg1Muxer;
