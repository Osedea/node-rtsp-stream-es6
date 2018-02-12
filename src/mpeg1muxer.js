const child_process = require('child_process');
const EventEmitter = require('events');

class Mpeg1Muxer extends EventEmitter {
    constructor(options) {
        super(options);
        this.url = options.url;
        this.stream = child_process.spawn(
            'ffmpeg',
            // ['-rtsp_transport', 'tcp','-i', this.url, '-vcodec', 'copy', '-probesize', '200000', '-an', '-f', 'mp4', '-reset_timestamps', '1', '-movflags', 'empty_moov+default_base_moof+frag_keyframe', '-loglevel','debug', '-'],
            ['-loglevel', 'quiet', '-rtsp_transport', 'tcp', '-i', this.url, '-f', 'mpegts', '-codec:v', 'mpeg1video', '-bf', '0', '-b:v', '180k', '-r', '30', '-'],
            { detached: false }
        );

        this.inputStreamStarted = true
        this.stream.stdout.on('data', (data) => { return this.emit('mpeg1data', data) })
        this.stream.stderr.on('data', (data) => { return this.emit('ffmpegError', data) })
    }
}

module.exports = Mpeg1Muxer;
