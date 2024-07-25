import { sleepUntil } from '@/utils/async';
import { nextTick, reactive } from 'vue';

export enum MOUNTING_STATE {
  'UNMOUNTED',
  'MOUNTING',
  'MOUNTED',
  'READY'
}

enum PLAYER_STATE {
  'PAUSED',
  'PLAYING'
}

const DEFAULT_OPTIONS = {
  lazy: true,
  initOnCreate: true
};

const FADE_DURATION = 2000;
const FADE_INTERVAL = 100;

export default class Player {
  state: {
    videoId: string,
    elementId: string,
    lazy: boolean,
    player: YT.Player | null,

    mountingState: MOUNTING_STATE,
    playerState: PLAYER_STATE,

    currentTime: number,
    progressInterval: number
  };
  initOnCreate: boolean;
  pauseWhileBufferingErrorEncountered: boolean; // Very special error case which can provoke disfunctionment of the player

  constructor(videoId: string, elementId: string, options?: Partial<typeof DEFAULT_OPTIONS>) {
    const opt = { ...DEFAULT_OPTIONS, ...options };

    const s = reactive({
      videoId,
      elementId,
      lazy: opt.lazy,
      player: null,
      mountingState: MOUNTING_STATE.UNMOUNTED,
      playerState: PLAYER_STATE.PAUSED,
      currentTime: 0,
      progressInterval: 0
    });
    this.state = s;
    this.initOnCreate = opt.initOnCreate;
    this.pauseWhileBufferingErrorEncountered = false;

    if (videoId && elementId) {
      if (this.initOnCreate) this.init();
    } else {
      console.error('Error, incorrect construction parameters for audio player.');
    }
  }

  async init(): Promise<void> {
    if (!(await this.checkSourceValidity())) {
      console.error(`[Error] :: Invalid source for track ${this.state.videoId}.`);
      return;
    }

    if (!document.getElementById(this.state.elementId)) {
      console.error(`[Error] :: element does not exist ${this.state.elementId}.`);
      return;
    }

    this.state.mountingState = MOUNTING_STATE.MOUNTING;
    this.state.player = new YT.Player(this.state.elementId, {
      height: '0',
      width: '0',
      videoId: this.state.videoId,
      playerVars: {
        autoplay: 0,
        playlist: this.state.videoId,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: () => this.onPlayerReady(),
        onStateChange: (ev) => this.onPlayerStateChange(ev),
        onError: (ev) => this.onPlayerError(ev)
      }
    });
  }

  async recreateIframe(): Promise<void> {
    if (this.state.playerState === PLAYER_STATE.PLAYING) {
      this.pause();
      // Wait a bit for player to be paused
      try {
        await sleepUntil(() => this.state.playerState !== PLAYER_STATE.PLAYING, 5000);
      } catch (err) {
        console.error('[ERROR] player.recreateIframe() :: 5s timeout to reacreate IFrame reached');
        return;
      }
    }
    const iframe = document.getElementById(this.state.elementId);
    const newDiv = document.createElement('div');
    newDiv.setAttribute('id', this.state.elementId);
    newDiv.classList.add('hidden');
    this.state.mountingState = MOUNTING_STATE.UNMOUNTED;
    iframe?.replaceWith(newDiv);
    this.init();
  }

  onPlayerReady(): void {
    this.state.mountingState = MOUNTING_STATE.MOUNTED;
    // Adjust config
    this.state.player?.setPlaybackQuality('small');
    this.state.player?.setVolume(100);

    if (!this.state.lazy) {
      this.play();
    }

    if (this.state.player?.getDuration()) {
      //TODO: Emit duration to be displayed
    }
  }

  onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    switch (event.data) {
      case YT.PlayerState.BUFFERING:
        this.state.playerState = PLAYER_STATE.PLAYING;
        break;
      case YT.PlayerState.PLAYING:
        // Special case where user changed time position before track was started
        if (this.state.mountingState === MOUNTING_STATE.MOUNTED && this.state.player?.getCurrentTime() !== this.state.currentTime) {
          this.state.player?.seekTo(this.state.currentTime, true);
        }
        this.state.mountingState = MOUNTING_STATE.READY;
        this.state.playerState = PLAYER_STATE.PLAYING;
        // If playing, lazy is not to be taken in account anymore
        if (!this.state.lazy) this.state.lazy = true;

        this.state.progressInterval = window.setInterval(() => {
          if (this.state.mountingState >= MOUNTING_STATE.MOUNTED) {
            this.state.currentTime = Math.round(this.state.player?.getCurrentTime() ?? 0);
          }
        }, 500);

        // Someone tried to pause the player while it was buffering before being fully ready
        if (this.pauseWhileBufferingErrorEncountered) {
          // Must pause player now
          this.pause();
        }
        break;
      case YT.PlayerState.PAUSED:
        this.state.playerState = PLAYER_STATE.PAUSED;
        window.clearInterval(this.state.progressInterval);
        break;
      case YT.PlayerState.ENDED:
        this.state.playerState = PLAYER_STATE.PAUSED;
        window.clearInterval(this.state.progressInterval);
        this.state.player?.seekTo(0, true);
        break;
      default:
        break;
    }
  }

  onPlayerError(event: YT.OnErrorEvent): void {
    if ([YT.PlayerError?.EmbeddingNotAllowed ?? '101', YT.PlayerError?.EmbeddingNotAllowed2 ?? '150'].includes(event.data)) {
      this.recreateIframe();
    } else {
      console.error('[ERROR] :: unexpected YT player error', event.data);
    }
  }

  play(): void {
    if (this.state.mountingState === MOUNTING_STATE.UNMOUNTED) {
      // Player not yet initialized
      this.init();
    } else if (this.state.mountingState === MOUNTING_STATE.MOUNTING) {
      // Player still initializing
      this.state.lazy = false;
    } else {
      // Player initialized, force player to start
      this.state.player?.playVideo();
    }
  }

  pause(): void {
    this.pauseWhileBufferingErrorEncountered = false;
    if (this.state.mountingState === MOUNTING_STATE.MOUNTING) {
      // Player still initializing
      this.state.lazy = true;
    } else if (this.state.mountingState === MOUNTING_STATE.MOUNTED) {
      // Very special case were a user is trying to pause a video while it is starting
      // Mounted, but not yet ready, currently buffering before first start
      // Note: player jump between unregistered and buffering state several times before actually playing
      this.pauseWhileBufferingErrorEncountered = true;
    } else if (this.state.mountingState === MOUNTING_STATE.READY) {
      // Player initialized, force player to stop
      this.state.player?.pauseVideo();
    }
  }

  destroy(): void {
    window.clearInterval(this.state.progressInterval);
    this.state.player?.destroy();
    document.getElementById(this.state.elementId)?.remove();
  }

  async checkSourceValidity(): Promise<boolean> {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${this.state.videoId}&format=json`);
      if (!res?.ok) throw res;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
